import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/server/admin-auth';
import { UnauthorizedError } from '@/lib/server/errors';
import { uploadImage } from '@/lib/server/upload-storage';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif'];
const EXTENSION_BY_TYPE: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/avif': 'avif',
  'image/gif': 'gif',
};

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();

    const origin = request.headers.get('origin');
    if (origin && origin !== request.nextUrl.origin) {
      return NextResponse.json({ error: 'Origem invalida' }, { status: 403 });
    }

    const formData = await request.formData();
    const file = formData.get('file');

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'Nenhum arquivo enviado' }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Tipo nao permitido. Use: JPG, PNG, WebP, AVIF ou GIF' },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'Arquivo muito grande. Maximo: 5MB' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const uploaded = await uploadImage({
      buffer: Buffer.from(bytes),
      extension: EXTENSION_BY_TYPE[file.type] ?? 'jpg',
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

    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Erro ao salvar arquivo' }, { status: 500 });
  }
}
