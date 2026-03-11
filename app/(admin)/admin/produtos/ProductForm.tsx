'use client';

import Link from 'next/link';
import { upsertProduct, deleteProduct } from '@/lib/actions/admin-crud';
import { Button } from '@/components/ui/Button';
import { Heading } from '@/components/ui/Typography';
import { DeleteConfirmButton } from '@/components/features/admin/DeleteConfirmButton';
import { AdminMobileFormBar } from '@/components/features/admin/AdminMobileFormBar';
import { ImageUpload } from '@/components/features/admin/ImageUpload';
import { useAdminEntityForm } from '@/lib/hooks/useAdminEntityForm';
import type { Product } from '@prisma/client';

interface ProductFormProps {
  product?: Product;
}

export default function ProductForm({ product }: ProductFormProps) {
  const formId = 'admin-product-form';
  const { loading, handleSubmit, handleDelete, handleCancel } = useAdminEntityForm({
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
        className="bg-surface space-y-8 border border-border-soft p-4 pb-28 sm:p-6 lg:p-12 lg:pb-12"
      >
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-text-secondary text-[10px] tracking-widest uppercase">
              Titulo
            </label>
            <input
              name="title"
              defaultValue={product?.title}
              required
              className="focus:border-primary w-full border border-border bg-bg p-4 text-sm outline-none"
            />
          </div>
          <div className="space-y-2">
            <label className="text-text-secondary text-[10px] tracking-widest uppercase">
              Slug (URL)
            </label>
            <input
              name="slug"
              defaultValue={product?.slug}
              required
              className="focus:border-primary w-full border border-border bg-bg p-4 text-sm outline-none"
            />
          </div>
          <div className="space-y-2">
            <label className="text-text-secondary text-[10px] tracking-widest uppercase">
              Tipo
            </label>
            <select
              name="type"
              defaultValue={product?.type || 'CONSULTORIA'}
              className="focus:border-primary w-full appearance-none border border-border bg-bg p-4 text-sm outline-none"
            >
              <option value="CONSULTORIA">Consultoria</option>
              <option value="CURSO">Curso</option>
              <option value="EBOOK">Ebook</option>
              <option value="CHECKLIST">Checklist</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-text-secondary text-[10px] tracking-widest uppercase">
              Publico
            </label>
            <select
              name="audience"
              defaultValue={product?.audience || 'AMBOS'}
              className="focus:border-primary w-full appearance-none border border-border bg-bg p-4 text-sm outline-none"
            >
              <option value="PESSOAS">Pessoas</option>
              <option value="EMPRESAS">Empresas</option>
              <option value="AMBOS">Ambos</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-text-secondary text-[10px] tracking-widest uppercase">
              Preco (BRL)
            </label>
            <input
              name="price"
              type="number"
              step="0.01"
              defaultValue={product?.price}
              required
              className="focus:border-primary w-full border border-border bg-bg p-4 text-sm outline-none"
            />
          </div>
          <ImageUpload name="coverImage" defaultValue={product?.coverImage || ''} label="Imagem de Capa" />
        </div>

        <div className="space-y-2">
          <label className="text-text-secondary text-[10px] tracking-widest uppercase">
            Descricao Curta
          </label>
          <input
            name="shortDesc"
            defaultValue={product?.shortDesc}
            required
            className="focus:border-primary w-full border border-border bg-bg p-4 text-sm outline-none"
          />
        </div>

        <div className="space-y-2">
          <label className="text-text-secondary text-[10px] tracking-widest uppercase">
            Descricao Longa (Markdown)
          </label>
          <textarea
            name="longDesc"
            defaultValue={product?.longDesc || ''}
            rows={6}
            className="focus:border-primary w-full resize-none border border-border bg-bg p-4 text-sm outline-none"
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
