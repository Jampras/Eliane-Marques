'use client';

import Link from 'next/link';
import { upsertPost, deletePost } from '@/lib/actions/admin-crud';
import { Button } from '@/components/ui/Button';
import { Heading } from '@/components/ui/Typography';
import { DeleteConfirmButton } from '@/components/features/admin/DeleteConfirmButton';
import { AdminMobileFormBar } from '@/components/features/admin/AdminMobileFormBar';
import { ImageUpload } from '@/components/features/admin/ImageUpload';
import {
  ADMIN_FORM_PANEL_CLASS,
  ADMIN_INPUT_CLASS,
  ADMIN_LABEL_CLASS,
  ADMIN_MONO_TEXTAREA_CLASS,
} from '@/components/features/admin/formStyles';
import { useAdminEntityForm } from '@/lib/hooks/useAdminEntityForm';
import type { Post } from '@prisma/client';

interface ContentFormProps {
  post?: Post;
}

export default function ContentForm({ post }: ContentFormProps) {
  const formId = 'admin-content-form';
  const { loading, handleSubmit, handleDelete, handleCancel } = useAdminEntityForm({
    entityId: post?.id,
    redirectTo: '/admin/conteudos',
    saveAction: upsertPost,
    deleteAction: deletePost,
    mapSubmitPayload: (form) => {
      const formData = new FormData(form);

      return {
        title: formData.get('title'),
        slug: formData.get('slug'),
        excerpt: formData.get('excerpt'),
        content: formData.get('content'),
        coverImage: formData.get('coverImage'),
        published: formData.get('published') === 'on',
      };
    },
    messages: {
      createSuccessTitle: 'Conteudo criado',
      updateSuccessTitle: 'Conteudo atualizado',
      saveSuccessDescription: 'Alteracoes salvas com sucesso.',
      saveErrorTitle: 'Nao foi possivel salvar',
      saveErrorDescription: 'Revise os campos e tente novamente.',
      deleteSuccessTitle: 'Conteudo excluido',
      deleteSuccessDescription: 'Remocao concluida com sucesso.',
      deleteErrorTitle: 'Falha ao excluir',
      deleteErrorDescription: 'Tente novamente em instantes.',
      connectionErrorTitle: 'Erro de conexao',
      connectionErrorDescription: 'Nao foi possivel concluir o salvamento agora.',
    },
  });

  return (
    <div className="mx-auto max-w-4xl p-4 sm:p-6 lg:p-12">
      <div className="mb-8 sm:mb-10 lg:mb-12">
        <Link
          href="/admin/conteudos"
          className="text-text-secondary hover:text-primary mb-6 inline-block text-[10px] tracking-[0.3em] uppercase"
        >
          Voltar para lista
        </Link>
        <Heading as="h1" className="text-3xl sm:text-4xl">
          {post ? 'Editar Artigo' : 'Novo Artigo'}
        </Heading>
      </div>

      <form
        id={formId}
        onSubmit={handleSubmit}
        className={ADMIN_FORM_PANEL_CLASS}
      >
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="space-y-2">
            <label className={ADMIN_LABEL_CLASS}>Titulo</label>
            <input
              name="title"
              defaultValue={post?.title}
              required
              className={ADMIN_INPUT_CLASS}
            />
          </div>
          <div className="space-y-2">
            <label className={ADMIN_LABEL_CLASS}>Slug</label>
            <input
              name="slug"
              defaultValue={post?.slug}
              required
              className={ADMIN_INPUT_CLASS}
            />
          </div>
        </div>

        <ImageUpload name="coverImage" defaultValue={post?.coverImage || ''} label="Imagem de Capa" />

        <div className="space-y-2">
          <label className={ADMIN_LABEL_CLASS}>Resumo / Excerpt</label>
          <input
            name="excerpt"
            defaultValue={post?.excerpt}
            required
            className={ADMIN_INPUT_CLASS}
          />
        </div>

        <div className="space-y-2">
          <label className={ADMIN_LABEL_CLASS}>Conteudo Completo (Markdown)</label>
          <textarea
            name="content"
            defaultValue={post?.content}
            rows={15}
            required
            className={ADMIN_MONO_TEXTAREA_CLASS}
          />
        </div>

        <div className="flex items-center gap-4">
          <input
            id="published"
            name="published"
            type="checkbox"
            defaultChecked={post?.published ?? false}
            className="accent-primary h-5 w-5"
          />
          <label htmlFor="published" className="cursor-pointer text-sm font-bold tracking-widest uppercase">
            Publicar Imediatamente
          </label>
        </div>

        <div className="flex flex-wrap gap-4 border-t border-border-soft pt-8">
          <Button type="submit" disabled={loading} className="hidden w-full md:w-auto lg:inline-flex">
            {loading ? 'Publicando...' : 'Salvar Conteudo'}
          </Button>

          {post?.id && (
            <DeleteConfirmButton label="Excluir Artigo" loading={loading} onConfirm={handleDelete} />
          )}

          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={loading}
            className="hidden w-full md:w-auto lg:inline-flex"
          >
            Cancelar
          </Button>
        </div>
      </form>

      <AdminMobileFormBar
        formId={formId}
        loading={loading}
        saveLabel="Salvar"
        savingLabel="Publicando..."
        onCancel={handleCancel}
      />
    </div>
  );
}
