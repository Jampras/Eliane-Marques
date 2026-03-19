import 'dotenv/config';
import { existsSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { spawnSync } from 'node:child_process';

const isWindows = process.platform === 'win32';
const prismaBin = path.join(
  process.cwd(),
  'node_modules',
  '.bin',
  isWindows ? 'prisma.cmd' : 'prisma'
);
const nextBin = path.join(
  process.cwd(),
  'node_modules',
  '.bin',
  isWindows ? 'next.cmd' : 'next'
);
const generatedClientPaths = [
  path.join(process.cwd(), 'node_modules', '.prisma', 'client', 'index.js'),
  path.join(process.cwd(), 'node_modules', '@prisma', 'client', 'index.js'),
];

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function hasGeneratedPrismaClient() {
  return generatedClientPaths.every((target) => existsSync(target));
}

function run(command, args, options = {}) {
  const result = isWindows
    ? spawnSync([command, ...args].map((part) => `"${part}"`).join(' '), {
        stdio: 'inherit',
        cwd: process.cwd(),
        env: process.env,
        shell: true,
        ...options,
      })
    : spawnSync(command, args, {
        stdio: 'inherit',
        cwd: process.cwd(),
        env: process.env,
        ...options,
      });

  if (result.error) {
    console.error(`[build] Failed to execute ${command}:`, result.error);
  }

  return result;
}

async function runPrismaGenerateWithRetry() {
  const attempts = isWindows ? 4 : 2;
  let lastResult = null;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    const result = run(prismaBin, ['generate']);
    lastResult = result;

    if (result.status === 0) {
      return;
    }

    if (!isWindows) {
      break;
    }

    if (attempt < attempts) {
      console.warn(`[build] prisma generate falhou no Windows. Tentando novamente (${attempt}/${attempts})...`);
      await sleep(1200 * attempt);
    }
  }

  if (hasGeneratedPrismaClient()) {
    console.warn('[build] Prisma client existente detectado. Seguindo sem regenerar por lock do engine.');
    return;
  }

  process.exit(lastResult?.status ?? 1);
}

async function main() {
  const generateOnly = process.argv.includes('--generate-only');

  await runPrismaGenerateWithRetry();

  if (generateOnly) {
    return;
  }

  const env = {
    ...process.env,
    DATA_QUERY_FAIL_FAST: process.env.DATA_QUERY_FAIL_FAST ?? 'false',
  };

  const nextBuild = run(nextBin, ['build'], { env });
  process.exit(nextBuild.status ?? 1);
}

main().catch((error) => {
  console.error('[build] Failed:', error);
  process.exit(1);
});
