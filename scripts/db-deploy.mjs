import 'dotenv/config';
import { spawnSync } from 'node:child_process';
import { createHash, randomUUID } from 'node:crypto';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { Client } from 'pg';

const MIGRATIONS_DIR = path.join(process.cwd(), 'prisma', 'migrations');
const PRISMA_MIGRATION_TABLE_SQL = `
  CREATE TABLE IF NOT EXISTS "_prisma_migrations" (
    "id" TEXT PRIMARY KEY,
    "checksum" TEXT NOT NULL,
    "finished_at" TIMESTAMPTZ,
    "migration_name" TEXT NOT NULL UNIQUE,
    "logs" TEXT,
    "rolled_back_at" TIMESTAMPTZ,
    "started_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "applied_steps_count" INTEGER NOT NULL DEFAULT 0
  )
`;

function runPrismaMigrateDeploy() {
  const command = process.platform === 'win32' ? 'npx.cmd' : 'npx';
  return spawnSync(command, ['prisma', 'migrate', 'deploy'], {
    stdio: 'inherit',
    cwd: process.cwd(),
    env: process.env,
  });
}

async function getMigrationDirectories() {
  const entries = await readdir(MIGRATIONS_DIR, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
}

async function runSqlFallback() {
  const candidates = Array.from(
    new Set([process.env.DIRECT_URL, process.env.DATABASE_URL].filter(Boolean)),
  );
  if (candidates.length === 0) {
    throw new Error(
      'DIRECT_URL ou DATABASE_URL precisam estar definidas para executar o fallback SQL.',
    );
  }

  const { client, connectionLabel } = await connectWithFallback(candidates);

  try {
    console.log(`[db:deploy] Conexao de fallback estabelecida via ${connectionLabel}`);
    await client.query(PRISMA_MIGRATION_TABLE_SQL);

    const appliedRows = await client.query(
      'SELECT "migration_name" FROM "_prisma_migrations" WHERE "finished_at" IS NOT NULL AND "rolled_back_at" IS NULL'
    );
    const applied = new Set(appliedRows.rows.map((row) => row.migration_name));
    const migrationDirectories = await getMigrationDirectories();

    for (const migrationName of migrationDirectories) {
      if (applied.has(migrationName)) {
        continue;
      }

      const migrationPath = path.join(MIGRATIONS_DIR, migrationName, 'migration.sql');
      const sql = await readFile(migrationPath, 'utf8');
      const checksum = createHash('sha256').update(sql).digest('hex');

      await client.query('BEGIN');
      try {
        await client.query(sql);
        await recordAppliedMigration(client, { checksum, migrationName, logs: null });
        await client.query('COMMIT');
        console.log(`[db:deploy] Applied ${migrationName} via SQL fallback`);
      } catch (error) {
        await client.query('ROLLBACK');

        if (isRecoverableAlreadyAppliedError(error)) {
          await recordAppliedMigration(client, {
            checksum,
            migrationName,
            logs: `Marked as applied by fallback runner after detecting existing database objects: ${
              error instanceof Error ? error.message : String(error)
            }`,
          });
          console.warn(
            `[db:deploy] ${migrationName} ja refletia o schema atual. Migration marcada como aplicada.`,
          );
          continue;
        }

        throw error;
      }
    }
  } finally {
    await client.end().catch(() => {});
  }
}

async function recordAppliedMigration(client, { checksum, migrationName, logs }) {
  const existing = await client.query(
    'SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = $1 LIMIT 1',
    [migrationName],
  );

  if (existing.rowCount > 0) {
    return;
  }

  await client.query(
    `
      INSERT INTO "_prisma_migrations" (
        "id",
        "checksum",
        "finished_at",
        "migration_name",
        "logs",
        "rolled_back_at",
        "started_at",
        "applied_steps_count"
      ) VALUES ($1, $2, NOW(), $3, $4, NULL, NOW(), 1)
    `,
    [randomUUID(), checksum, migrationName, logs],
  );
}

async function connectWithFallback(candidates) {
  const errors = [];

  for (const connectionString of candidates) {
    const client = new Client({ connectionString });
    const connectionLabel = maskConnectionString(connectionString);

    try {
      await client.connect();
      return { client, connectionLabel };
    } catch (error) {
      errors.push(
        `${connectionLabel} -> ${error instanceof Error ? error.message : String(error)}`,
      );
      await client.end().catch(() => {});
    }
  }

  throw new Error(
    `Nao foi possivel conectar ao banco para aplicar migrations.\n${errors.join('\n')}`,
  );
}

function maskConnectionString(connectionString) {
  return connectionString.replace(/:\/\/([^:]+):([^@]+)@/, '://$1:***@');
}

function isRecoverableAlreadyAppliedError(error) {
  const code = error && typeof error === 'object' ? error.code : undefined;
  return code === '42701' || code === '42P07' || code === '42710';
}

async function main() {
  const prismaResult = runPrismaMigrateDeploy();
  if (prismaResult.status === 0) {
    return;
  }

  console.warn('[db:deploy] Prisma migrate deploy failed. Falling back to SQL migration runner.');
  await runSqlFallback();
}

main().catch((error) => {
  console.error('[db:deploy] Failed:', error);
  process.exit(1);
});
