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

type AllowedUploadType = (typeof ALLOWED_UPLOAD_TYPES)[number];

function bufferStartsWith(buffer: Uint8Array, signature: number[]) {
  return signature.every((value, index) => buffer[index] === value);
}

function isJpeg(buffer: Uint8Array) {
  return bufferStartsWith(buffer, [0xff, 0xd8, 0xff]);
}

function isPng(buffer: Uint8Array) {
  return bufferStartsWith(buffer, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
}

function isGif(buffer: Uint8Array) {
  return (
    bufferStartsWith(buffer, [0x47, 0x49, 0x46, 0x38, 0x37, 0x61]) ||
    bufferStartsWith(buffer, [0x47, 0x49, 0x46, 0x38, 0x39, 0x61])
  );
}

function isWebp(buffer: Uint8Array) {
  return (
    buffer.length >= 12 &&
    bufferStartsWith(buffer, [0x52, 0x49, 0x46, 0x46]) &&
    buffer[8] === 0x57 &&
    buffer[9] === 0x45 &&
    buffer[10] === 0x42 &&
    buffer[11] === 0x50
  );
}

function isAvif(buffer: Uint8Array) {
  if (buffer.length < 16) {
    return false;
  }

  if (buffer[4] !== 0x66 || buffer[5] !== 0x74 || buffer[6] !== 0x79 || buffer[7] !== 0x70) {
    return false;
  }

  const brands = [] as string[];
  for (let index = 8; index + 3 < Math.min(buffer.length, 32); index += 4) {
    brands.push(
      String.fromCharCode(buffer[index], buffer[index + 1], buffer[index + 2], buffer[index + 3])
    );
  }

  return brands.includes('avif') || brands.includes('avis');
}

export function detectUploadContentType(buffer: Uint8Array): AllowedUploadType | null {
  if (isPng(buffer)) {
    return 'image/png';
  }

  if (isJpeg(buffer)) {
    return 'image/jpeg';
  }

  if (isWebp(buffer)) {
    return 'image/webp';
  }

  if (isAvif(buffer)) {
    return 'image/avif';
  }

  if (isGif(buffer)) {
    return 'image/gif';
  }

  return null;
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

export function validateUploadSignature(contentType: string, buffer: Uint8Array) {
  const detectedType = detectUploadContentType(buffer);

  if (!detectedType) {
    throw new UploadValidationError(
      'Nao foi possivel validar o conteudo do arquivo. Envie uma imagem valida.',
      400
    );
  }

  if (detectedType !== contentType) {
    throw new UploadValidationError(
      'O arquivo enviado nao corresponde ao tipo informado. Reenvie a imagem original.',
      400
    );
  }

  return detectedType;
}

export function getUploadExtension(contentType: string) {
  return EXTENSION_BY_UPLOAD_TYPE[contentType] ?? 'jpg';
}
