import assert from 'node:assert/strict';
import test from 'node:test';
import {
  detectUploadContentType,
  getUploadExtension,
  UploadValidationError,
  validateUploadFile,
  validateUploadSignature,
} from '@/lib/server/upload-helpers';

test('getUploadExtension maps known mime types', () => {
  assert.equal(getUploadExtension('image/webp'), 'webp');
  assert.equal(getUploadExtension('image/jpeg'), 'jpg');
});

test('getUploadExtension falls back to jpg for unknown types', () => {
  assert.equal(getUploadExtension('image/unknown'), 'jpg');
});

test('validateUploadFile rejects invalid payload', () => {
  assert.throws(() => validateUploadFile(null), UploadValidationError);
});

test('validateUploadFile rejects oversized file', () => {
  const file = new File(['x'], 'big.png', { type: 'image/png' });
  Object.defineProperty(file, 'size', { value: 6 * 1024 * 1024 });

  assert.throws(() => validateUploadFile(file), /Arquivo muito grande/);
});

test('validateUploadFile rejects unsupported mime type', () => {
  const file = new File(['svg'], 'icon.svg', { type: 'image/svg+xml' });

  assert.throws(() => validateUploadFile(file), /Tipo nao permitido/);
});

test('detectUploadContentType identifies png signatures', () => {
  const pngBytes = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10, 0, 0, 0, 0]);

  assert.equal(detectUploadContentType(pngBytes), 'image/png');
});

test('validateUploadSignature rejects spoofed mime types', () => {
  const pngBytes = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10, 0, 0, 0, 0]);

  assert.throws(
    () => validateUploadSignature('image/jpeg', pngBytes),
    /nao corresponde ao tipo informado/i
  );
});

test('validateUploadSignature rejects unknown binary content', () => {
  const bytes = new Uint8Array([1, 2, 3, 4, 5, 6]);

  assert.throws(
    () => validateUploadSignature('image/png', bytes),
    /nao foi possivel validar o conteudo/i
  );
});
