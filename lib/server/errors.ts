import { Prisma } from '@prisma/client';
import { ZodError } from 'zod';

export class UnauthorizedError extends Error {
  constructor(message = 'Unauthorized') {
    super(message);
    this.name = 'UnauthorizedError';
  }
}

export function mapServerErrorToMessage(error: unknown): string {
  if (error instanceof UnauthorizedError) {
    return 'Sessao expirada ou nao autorizada.';
  }

  if (error instanceof ZodError) {
    return `Dados invalidos: ${error.issues[0]?.message || 'verifique os campos.'}`;
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      return 'Ja existe um registro com este identificador (ex.: slug).';
    }

    if (error.code === 'P2025') {
      return 'Registro nao encontrado ou ja removido.';
    }

    return 'Falha de persistencia no banco de dados.';
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    return 'Dados invalidos para operacao no banco.';
  }

  return 'Ocorreu um erro interno no servidor.';
}

export function logServerError(context: string, error: unknown) {
  if (process.env.NODE_ENV === 'production') {
    const safeMessage = error instanceof Error ? error.message : String(error);
    console.error(`[${context}] ${safeMessage}`);
    return;
  }

  console.error(`[${context}]`, error);
}
