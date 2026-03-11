'use server';

import prisma from '@/lib/core/prisma';
import { getProductDetailPath } from '@/lib/core/product-paths';
import { checklistSchema, configSchema, postSchema, productSchema } from '@/lib/validators/admin';
import { runAdminMutation, type ActionResponse } from '@/lib/server/action-runner';
import { requireAdmin } from '@/lib/server/admin-auth';

function normalizeOptionalText(value: string | undefined) {
  if (value === undefined) {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed === '' ? null : trimmed;
}

interface UpsertEntityOptions<TValidated, TPayload> {
  id: string | null;
  data: unknown;
  context: string;
  pathsToRevalidate: string[];
  tagsToRevalidate?: string[];
  schema: { parse: (input: unknown) => TValidated };
  buildPayload: (validated: TValidated) => TPayload;
  create: (payload: TPayload) => Promise<void>;
  update: (id: string, payload: TPayload) => Promise<void>;
  getExtraPathsToRevalidate?: (args: {
    id: string | null;
    validated: TValidated;
    payload: TPayload;
    mode: 'create' | 'update';
  }) => Promise<string[]>;
}

async function upsertEntity<TValidated, TPayload>({
  id,
  data,
  context,
  pathsToRevalidate,
  tagsToRevalidate = [],
  schema,
  buildPayload,
  create,
  update,
  getExtraPathsToRevalidate,
}: UpsertEntityOptions<TValidated, TPayload>): Promise<ActionResponse> {
  return runAdminMutation({
    context,
    pathsToRevalidate,
    tagsToRevalidate,
    mutation: async () => {
      await requireAdmin();
      const validated = schema.parse(data);
      const payload = buildPayload(validated);

      if (id) {
        const extraPathsToRevalidate = await getExtraPathsToRevalidate?.({
          id,
          validated,
          payload,
          mode: 'update',
        });
        await update(id, payload);
        return {
          pathsToRevalidate: extraPathsToRevalidate,
        };
      }

      const extraPathsToRevalidate = await getExtraPathsToRevalidate?.({
        id: null,
        validated,
        payload,
        mode: 'create',
      });
      await create(payload);
      return {
        pathsToRevalidate: extraPathsToRevalidate,
      };
    },
  });
}

interface DeleteEntityOptions {
  id: string;
  context: string;
  pathsToRevalidate: string[];
  tagsToRevalidate?: string[];
  remove: (id: string) => Promise<void>;
  getExtraPathsToRevalidate?: (id: string) => Promise<string[]>;
}

async function deleteEntity({
  id,
  context,
  pathsToRevalidate,
  tagsToRevalidate = [],
  remove,
  getExtraPathsToRevalidate,
}: DeleteEntityOptions): Promise<ActionResponse> {
  return runAdminMutation({
    context,
    pathsToRevalidate,
    tagsToRevalidate,
    mutation: async () => {
      await requireAdmin();
      const extraPathsToRevalidate = await getExtraPathsToRevalidate?.(id);
      await remove(id);
      return { pathsToRevalidate: extraPathsToRevalidate };
    },
  });
}

function getPostDetailPath(slug: string) {
  return `/conteudos/${slug}`;
}

function getChecklistDetailPath(slug: string) {
  return `/checklists/${slug}`;
}

export async function upsertProduct(id: string | null, data: unknown): Promise<ActionResponse> {
  return upsertEntity({
    id,
    data,
    context: 'upsertProduct',
    pathsToRevalidate: ['/admin/produtos', '/', '/servicos', '/cursos', '/materiais'],
    tagsToRevalidate: ['home-services'],
    schema: productSchema,
    buildPayload: (validated) => ({
      ...validated,
      coverImage: normalizeOptionalText(validated.coverImage),
    }),
    update: async (productId, payload) => {
      await prisma.product.update({ where: { id: productId }, data: payload });
    },
    create: async (payload) => {
      await prisma.product.create({ data: payload });
    },
    getExtraPathsToRevalidate: async ({ id: productId, payload }) => {
      const nextPath = getProductDetailPath(payload.type, payload.slug);

      if (!productId) {
        return [nextPath];
      }

      const existing = await prisma.product.findUnique({
        where: { id: productId },
        select: { slug: true, type: true },
      });

      return [
        nextPath,
        ...(existing ? [getProductDetailPath(existing.type, existing.slug)] : []),
      ];
    },
  });
}

export async function deleteProduct(id: string): Promise<ActionResponse> {
  return deleteEntity({
    id,
    context: 'deleteProduct',
    pathsToRevalidate: ['/admin/produtos', '/', '/servicos', '/cursos', '/materiais'],
    tagsToRevalidate: ['home-services'],
    remove: async (productId) => {
      await prisma.product.delete({ where: { id: productId } });
    },
    getExtraPathsToRevalidate: async (productId) => {
      const existing = await prisma.product.findUnique({
        where: { id: productId },
        select: { slug: true, type: true },
      });

      return existing ? [getProductDetailPath(existing.type, existing.slug)] : [];
    },
  });
}

export async function upsertPost(id: string | null, data: unknown): Promise<ActionResponse> {
  return upsertEntity({
    id,
    data,
    context: 'upsertPost',
    pathsToRevalidate: ['/admin/conteudos', '/conteudos'],
    schema: postSchema,
    buildPayload: (validated) => ({
      ...validated,
      coverImage: normalizeOptionalText(validated.coverImage),
      excerpt: validated.excerpt,
      content: validated.content,
    }),
    update: async (postId, payload) => {
      await prisma.post.update({ where: { id: postId }, data: payload });
    },
    create: async (payload) => {
      await prisma.post.create({ data: payload });
    },
    getExtraPathsToRevalidate: async ({ id: postId, payload }) => {
      const nextPath = getPostDetailPath(payload.slug);

      if (!postId) {
        return [nextPath];
      }

      const existing = await prisma.post.findUnique({
        where: { id: postId },
        select: { slug: true },
      });

      return [nextPath, ...(existing ? [getPostDetailPath(existing.slug)] : [])];
    },
  });
}

export async function deletePost(id: string): Promise<ActionResponse> {
  return deleteEntity({
    id,
    context: 'deletePost',
    pathsToRevalidate: ['/admin/conteudos', '/conteudos'],
    remove: async (postId) => {
      await prisma.post.delete({ where: { id: postId } });
    },
    getExtraPathsToRevalidate: async (postId) => {
      const existing = await prisma.post.findUnique({
        where: { id: postId },
        select: { slug: true },
      });

      return existing ? [getPostDetailPath(existing.slug)] : [];
    },
  });
}

export async function upsertChecklist(id: string | null, data: unknown): Promise<ActionResponse> {
  return upsertEntity({
    id,
    data,
    context: 'upsertChecklist',
    pathsToRevalidate: ['/admin/checklists', '/checklists'],
    schema: checklistSchema,
    buildPayload: (validated) => ({
      title: validated.title,
      slug: validated.slug,
      description: normalizeOptionalText(validated.description),
      published: validated.published,
      items: {
        deleteMany: {},
        create: validated.items.map((item, index) => ({
          label: item.label,
          linkUrl: normalizeOptionalText(item.linkUrl) ?? null,
          sortOrder: index,
        })),
      },
    }),
    update: async (checklistId, payload) => {
      await prisma.checklist.update({ where: { id: checklistId }, data: payload });
    },
    create: async (payload) => {
      await prisma.checklist.create({ data: payload });
    },
    getExtraPathsToRevalidate: async ({ id: checklistId, payload }) => {
      const nextPath = getChecklistDetailPath(payload.slug);

      if (!checklistId) {
        return [nextPath];
      }

      const existing = await prisma.checklist.findUnique({
        where: { id: checklistId },
        select: { slug: true },
      });

      return [nextPath, ...(existing ? [getChecklistDetailPath(existing.slug)] : [])];
    },
  });
}

export async function deleteChecklist(id: string): Promise<ActionResponse> {
  return deleteEntity({
    id,
    context: 'deleteChecklist',
    pathsToRevalidate: ['/admin/checklists', '/checklists'],
    remove: async (entityId) => {
      await prisma.checklist.delete({ where: { id: entityId } });
    },
    getExtraPathsToRevalidate: async (entityId) => {
      const existing = await prisma.checklist.findUnique({
        where: { id: entityId },
        select: { slug: true },
      });

      return existing ? [getChecklistDetailPath(existing.slug)] : [];
    },
  });
}

export async function updateConfigs(data: Record<string, string>): Promise<ActionResponse> {
  return runAdminMutation({
    context: 'updateConfigs',
    pathsToRevalidate: [
      '/',
      '/contato',
      '/servicos',
      '/cursos',
      '/materiais',
      '/checklists',
      '/conteudos',
    ],
    tagsToRevalidate: ['site-configs'],
    mutation: async () => {
      await requireAdmin();
      const validated = configSchema.parse(data);
      const entries = Object.entries(validated).filter(([, value]) => value !== undefined) as Array<
        [keyof typeof validated, string]
      >;

      if (entries.length === 0) {
        return;
      }

      const updates = entries.map(([key, value]) =>
        prisma.siteConfig.upsert({
          where: { key },
          update: { value },
          create: { key, value },
        })
      );

      await prisma.$transaction(updates);
      return;
    },
  });
}
