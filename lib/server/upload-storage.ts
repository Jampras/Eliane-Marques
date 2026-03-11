import { mkdir, writeFile } from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import {
  ensureProductionUploadConfig,
  ensureServiceRoleKeyNotCompromised,
} from './production-guards';

const LOCAL_UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');

export type UploadStorageDriver = 'supabase' | 'local';

interface UploadImageInput {
  buffer: Buffer;
  extension: string;
  contentType: string;
}

interface UploadImageResult {
  driver: UploadStorageDriver;
  filename: string;
  url: string;
}

function buildFilename(extension: string) {
  const hash = crypto.randomBytes(8).toString('hex');
  return `${Date.now()}-${hash}.${extension}`;
}

function getBaseSiteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, '') || 'http://localhost:3000';
}

function getSupabaseConfig() {
  const url = process.env.SUPABASE_URL?.trim();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  const bucket = process.env.SUPABASE_STORAGE_BUCKET?.trim() || 'uploads';

  if (!url || !serviceRoleKey) {
    return null;
  }

  return { url: url.replace(/\/+$/, ''), serviceRoleKey, bucket };
}

function resolveDriver(): UploadStorageDriver {
  return getSupabaseConfig() ? 'supabase' : 'local';
}

async function uploadToLocal({ buffer, extension }: UploadImageInput): Promise<UploadImageResult> {
  const filename = buildFilename(extension);

  await mkdir(LOCAL_UPLOAD_DIR, { recursive: true });
  await writeFile(path.join(LOCAL_UPLOAD_DIR, filename), buffer);

  return {
    driver: 'local',
    filename,
    url: `/uploads/${filename}`,
  };
}

async function uploadToSupabase({
  buffer,
  extension,
  contentType,
}: UploadImageInput): Promise<UploadImageResult> {
  const config = getSupabaseConfig();

  if (!config) {
    throw new Error('Supabase storage nao configurado');
  }

  const filename = buildFilename(extension);
  const objectPath = filename;

  const response = await fetch(
    `${config.url}/storage/v1/object/${config.bucket}/${objectPath}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.serviceRoleKey}`,
        apikey: config.serviceRoleKey,
        'Content-Type': contentType,
        'x-upsert': 'false',
      },
      body: buffer,
    }
  );

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Supabase storage upload failed: ${response.status} ${errorBody}`);
  }

  return {
    driver: 'supabase',
    filename,
    url: `${config.url}/storage/v1/object/public/${config.bucket}/${objectPath}`,
  };
}

export async function uploadImage(input: UploadImageInput): Promise<UploadImageResult> {
  ensureServiceRoleKeyNotCompromised();

  if (process.env.NODE_ENV === 'production') {
    ensureProductionUploadConfig();
    return uploadToSupabase(input);
  }

  if (resolveDriver() === 'supabase') {
    return uploadToSupabase(input);
  }

  return uploadToLocal(input);
}
