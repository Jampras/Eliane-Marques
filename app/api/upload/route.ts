import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/server/admin-auth';
import { UnauthorizedError } from '@/lib/server/errors';
import { isSameOriginRequest } from '@/lib/server/request-security';
import { uploadImage } from '@/lib/server/upload-storage';
import {
  getUploadExtension,
  UploadValidationError,
  validateUploadFile,
} from '@/lib/server/upload-helpers';

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();

    if (!isSameOriginRequest(request.headers)) {
      return NextResponse.json({ error: 'Origem invalida' }, { status: 403 });
    }

    const formData = await request.formData();
    const file = formData.get('file');
    validateUploadFile(file);

    const bytes = await file.arrayBuffer();
    const uploaded = await uploadImage({
      buffer: Buffer.from(bytes),
      extension: getUploadExtension(file.type),
      contentType: file.type,
    });

    return NextResponse.json({
      url: uploaded.url,
      filename: uploaded.filename,
      storage: uploaded.driver,
    });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: 'Nao autorizado' }, { status: 401 });
    }

    if (error instanceof UploadValidationError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Erro ao salvar arquivo' }, { status: 500 });
  }
}
