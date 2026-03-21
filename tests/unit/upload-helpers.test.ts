import assert from 'node:assert/strict';
import test from 'node:test';
import {
  getUploadExtension,
  UploadValidationError,
  validateUploadFile,
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
