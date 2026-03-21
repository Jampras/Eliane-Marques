export const MAX_UPLOAD_FILE_SIZE = 5 * 1024 * 1024;
export const ALLOWED_UPLOAD_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
  'image/gif',
] as const;

export const EXTENSION_BY_UPLOAD_TYPE: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/avif': 'avif',
  'image/gif': 'gif',
};

export class UploadValidationError extends Error {
  status: number;

  constructor(message: string, status = 400) {
    super(message);
    this.name = 'UploadValidationError';
    this.status = status;
  }
}

interface UploadFileLike {
  type: string;
  size: number;
}

export function validateUploadFile(file: unknown): asserts file is File & UploadFileLike {
  if (!(file instanceof File)) {
    throw new UploadValidationError('Nenhum arquivo enviado.');
  }

  if (!ALLOWED_UPLOAD_TYPES.includes(file.type as (typeof ALLOWED_UPLOAD_TYPES)[number])) {
    throw new UploadValidationError('Tipo nao permitido. Use: JPG, PNG, WebP, AVIF ou GIF.');
  }

  if (file.size > MAX_UPLOAD_FILE_SIZE) {
    throw new UploadValidationError('Arquivo muito grande. Maximo: 5MB.');
  }
}

export function getUploadExtension(contentType: string) {
  return EXTENSION_BY_UPLOAD_TYPE[contentType] ?? 'jpg';
}
