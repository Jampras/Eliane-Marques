'use client';

import Link from 'next/link';
import { upsertProduct, deleteProduct } from '@/lib/actions/admin-crud';
import { Button } from '@/components/ui/Button';
import { Heading } from '@/components/ui/Typography';
import { DeleteConfirmButton } from '@/components/features/admin/DeleteConfirmButton';
import { AdminMobileFormBar } from '@/components/features/admin/AdminMobileFormBar';
import { AdminInlineNotice } from '@/components/features/admin/AdminInlineNotice';
import { ImageUpload } from '@/components/features/admin/ImageUpload';
import {
  ADMIN_FORM_PANEL_CLASS,
  ADMIN_INPUT_CLASS,
  ADMIN_LABEL_CLASS,
  ADMIN_MONO_TEXTAREA_CLASS,
  ADMIN_SELECT_CLASS,
} from '@/components/features/admin/formStyles';
import { useAdminEntityForm } from '@/lib/hooks/useAdminEntityForm';
import type { Product } from '@prisma/client';

interface ProductFormProps {
  product?: Product;
}

export default function ProductForm({ product }: ProductFormProps) {
  const formId = 'admin-product-form';
  const { feedback, loading, handleSubmit, handleDelete, handleCancel } = useAdminEntityForm({
    entityId: product?.id,
    redirectTo: '/admin/produtos',
    saveAction: upsertProduct,
    deleteAction: deleteProduct,
    mapSubmitPayload: (form) => {
      const formData = new FormData(form);
      const data = Object.fromEntries(formData);

      return {
        ...data,
        price: Number(data.price),
        active: data.active === 'on',
      };
    },
    messages: {
      createSuccessTitle: 'Produto criado',
      updateSuccessTitle: 'Produto atualizado',
      saveSuccessDescription: 'Alteracoes salvas com sucesso.',
      saveErrorTitle: 'Nao foi possivel salvar',
      saveErrorDescription: 'Verifique os dados e tente novamente.',
      deleteSuccessTitle: 'Produto excluido',
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
          href="/admin/produtos"
          className="text-text-secondary hover:text-primary mb-6 inline-block text-[10px] tracking-[0.3em] uppercase"
        >
          Voltar para lista
        </Link>
        <Heading as="h1" className="text-3xl sm:text-4xl">
          {product ? 'Editar Produto' : 'Novo Produto'}
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
              defaultValue={product?.title}
              required
              className={ADMIN_INPUT_CLASS}
            />
          </div>
          <div className="space-y-2">
            <label className={ADMIN_LABEL_CLASS}>Slug (URL)</label>
            <input
              name="slug"
              defaultValue={product?.slug}
              required
              className={ADMIN_INPUT_CLASS}
            />
          </div>
          <div className="space-y-2">
            <label className={ADMIN_LABEL_CLASS}>Tipo</label>
            <select
              name="type"
              defaultValue={product?.type || 'CONSULTORIA'}
              className={ADMIN_SELECT_CLASS}
            >
              <option value="CONSULTORIA">Consultoria</option>
              <option value="CURSO">Curso</option>
              <option value="EBOOK">Ebook</option>
              <option value="CHECKLIST">Checklist</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className={ADMIN_LABEL_CLASS}>Publico</label>
            <select
              name="audience"
              defaultValue={product?.audience || 'AMBOS'}
              className={ADMIN_SELECT_CLASS}
            >
              <option value="PESSOAS">Pessoas</option>
              <option value="EMPRESAS">Empresas</option>
              <option value="AMBOS">Ambos</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className={ADMIN_LABEL_CLASS}>Preco (BRL)</label>
            <input
              name="price"
              type="number"
              step="0.01"
              defaultValue={product?.price}
              required
              className={ADMIN_INPUT_CLASS}
            />
          </div>
          <ImageUpload name="coverImage" defaultValue={product?.coverImage || ''} label="Imagem de Capa" />
        </div>

        <div className="space-y-2">
          <label className={ADMIN_LABEL_CLASS}>Descricao Curta</label>
          <input
            name="shortDesc"
            defaultValue={product?.shortDesc}
            required
            className={ADMIN_INPUT_CLASS}
          />
        </div>

        <div className="space-y-2">
          <label className={ADMIN_LABEL_CLASS}>Descricao Longa (Markdown)</label>
          <textarea
            name="longDesc"
            defaultValue={product?.longDesc || ''}
            rows={6}
            className={ADMIN_MONO_TEXTAREA_CLASS}
          />
        </div>

        <div className="flex items-center gap-4">
          <input
            id="active"
            name="active"
            type="checkbox"
            defaultChecked={product?.active ?? true}
            className="accent-primary h-5 w-5"
          />
          <label htmlFor="active" className="cursor-pointer text-sm font-bold tracking-widest uppercase">
            Produto Ativo no Site
          </label>
        </div>

        {feedback && (
          <AdminInlineNotice
            variant={feedback.variant}
            title={feedback.title}
            description={feedback.description}
          />
        )}

        <div className="flex flex-wrap gap-4 border-t border-border-soft pt-8">
          <Button type="submit" disabled={loading} className="hidden w-full md:w-auto lg:inline-flex">
            {loading ? 'Salvando...' : 'Salvar Alteracoes'}
          </Button>

          {product?.id && (
            <DeleteConfirmButton label="Excluir Produto" loading={loading} onConfirm={handleDelete} />
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
        savingLabel="Salvando..."
        onCancel={handleCancel}
      />
    </div>
  );
}
