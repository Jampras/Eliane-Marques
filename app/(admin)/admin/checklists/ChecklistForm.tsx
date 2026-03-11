'use client';

import { useState } from 'react';
import Link from 'next/link';
import { upsertChecklist, deleteChecklist } from '@/lib/actions/admin-crud';
import { Button } from '@/components/ui/Button';
import { Heading } from '@/components/ui/Typography';
import { DeleteConfirmButton } from '@/components/features/admin/DeleteConfirmButton';
import { AdminMobileFormBar } from '@/components/features/admin/AdminMobileFormBar';
import { useAdminEntityForm } from '@/lib/hooks/useAdminEntityForm';
import type { Checklist, ChecklistItem } from '@prisma/client';

type ChecklistWithItems = Checklist & { items: ChecklistItem[]; published?: boolean };
type EditableChecklistItem = { label: string; linkUrl: string };

interface ChecklistFormProps {
  checklist?: ChecklistWithItems;
}

export default function ChecklistForm({ checklist }: ChecklistFormProps) {
  const formId = 'admin-checklist-form';
  const [items, setItems] = useState<EditableChecklistItem[]>(
    checklist?.items.map((item) => ({ label: item.label, linkUrl: item.linkUrl ?? '' })) || [
      { label: '', linkUrl: '' },
    ]
  );

  const { loading, handleSubmit, handleDelete, handleCancel } = useAdminEntityForm({
    entityId: checklist?.id,
    redirectTo: '/admin/checklists',
    saveAction: upsertChecklist,
    deleteAction: deleteChecklist,
    mapSubmitPayload: (form) => {
      const formData = new FormData(form);

      return {
        title: formData.get('title'),
        slug: formData.get('slug'),
        description: formData.get('description'),
        published: formData.get('published') === 'on',
        items: items.map((item, index) => ({ ...item, sortOrder: index })),
      };
    },
    messages: {
      createSuccessTitle: 'Checklist criada',
      updateSuccessTitle: 'Checklist atualizada',
      saveSuccessDescription: 'Alteracoes salvas com sucesso.',
      saveErrorTitle: 'Nao foi possivel salvar',
      saveErrorDescription: 'Revise os campos e tente novamente.',
      deleteSuccessTitle: 'Checklist excluida',
      deleteSuccessDescription: 'Remocao concluida com sucesso.',
      deleteErrorTitle: 'Falha ao excluir',
      deleteErrorDescription: 'Tente novamente em instantes.',
      connectionErrorTitle: 'Erro de conexao',
      connectionErrorDescription: 'Nao foi possivel concluir o salvamento agora.',
    },
  });

  const addItem = () => setItems((current) => [...current, { label: '', linkUrl: '' }]);
  const removeItem = (index: number) => setItems((current) => current.filter((_, idx) => idx !== index));
  const updateItem = (index: number, field: keyof EditableChecklistItem, value: string) => {
    setItems((current) => {
      const next = [...current];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };
  const moveItem = (index: number, direction: 'up' | 'down') => {
    setItems((current) => {
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= current.length) {
        return current;
      }

      const next = [...current];
      [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
      return next;
    });
  };

  return (
    <div className="mx-auto max-w-4xl p-4 sm:p-6 lg:p-12">
      <div className="mb-8 sm:mb-10 lg:mb-12">
        <Link
          href="/admin/checklists"
          className="text-text-secondary hover:text-primary mb-6 inline-block text-[10px] tracking-[0.3em] uppercase"
        >
          Voltar para lista
        </Link>
        <Heading as="h1" className="text-3xl sm:text-4xl">
          {checklist ? 'Editar Checklist' : 'Novo Checklist'}
        </Heading>
      </div>

      <form id={formId} onSubmit={handleSubmit} className="space-y-12 pb-28 lg:pb-0">
        <div className="bg-surface space-y-8 border border-border-soft p-4 sm:p-6 lg:p-12">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-text-secondary text-[10px] tracking-widest uppercase">
                Titulo
              </label>
              <input
                name="title"
                defaultValue={checklist?.title}
                required
                className="focus:border-primary w-full border border-border bg-bg p-4 text-sm outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-text-secondary text-[10px] tracking-widest uppercase">
                Slug
              </label>
              <input
                name="slug"
                defaultValue={checklist?.slug}
                required
                className="focus:border-primary w-full border border-border bg-bg p-4 text-sm outline-none"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-text-secondary text-[10px] tracking-widest uppercase">
              Descricao
            </label>
            <textarea
              name="description"
              defaultValue={checklist?.description || ''}
              rows={3}
              className="focus:border-primary w-full resize-none border border-border bg-bg p-4 text-sm outline-none"
            />
          </div>

          <div className="flex items-center gap-4">
            <input
              id="published"
              name="published"
              type="checkbox"
              defaultChecked={checklist?.published ?? false}
              className="accent-primary h-5 w-5"
            />
            <label htmlFor="published" className="cursor-pointer text-sm font-bold tracking-widest uppercase">
              Publicar no Site
            </label>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Heading as="h3" className="text-2xl">
              Itens do Checklist
            </Heading>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addItem}
              className="w-full sm:w-auto"
            >
              Adicionar Item
            </Button>
          </div>

          <div className="space-y-3">
            {items.map((item, index) => (
              <div
                key={`${index}-${item.label}`}
                className="bg-surface animate-in fade-in slide-in-from-right-2 flex flex-col gap-4 border border-border-soft p-4 sm:flex-row sm:items-start sm:p-6"
              >
                <div className="flex gap-1 sm:flex-col sm:pt-2">
                  <button
                    type="button"
                    onClick={() => moveItem(index, 'up')}
                    disabled={index === 0}
                    className="text-text-secondary hover:text-primary disabled:opacity-20"
                  >
                    <span className="material-symbols-outlined">expand_less</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => moveItem(index, 'down')}
                    disabled={index === items.length - 1}
                    className="text-text-secondary hover:text-primary disabled:opacity-20"
                  >
                    <span className="material-symbols-outlined">expand_more</span>
                  </button>
                </div>
                <div className="grid flex-grow grid-cols-1 gap-4 md:grid-cols-2">
                  <input
                    placeholder="Label do item"
                    value={item.label}
                    onChange={(e) => updateItem(index, 'label', e.target.value)}
                    className="focus:border-primary border border-border bg-bg p-4 text-sm outline-none"
                  />
                  <input
                    placeholder="Link recomendado (opcional)"
                    value={item.linkUrl}
                    onChange={(e) => updateItem(index, 'linkUrl', e.target.value)}
                    className="focus:border-primary border border-border bg-bg p-4 text-sm outline-none"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="self-end text-red-500 hover:text-red-400 sm:mt-4 sm:self-auto"
                >
                  <span className="material-symbols-outlined">delete</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-4 border-t border-border-soft pt-8">
          <Button type="submit" disabled={loading} className="hidden w-full md:w-auto lg:inline-flex">
            {loading ? 'Salvando...' : 'Salvar Checklist'}
          </Button>

          {checklist?.id && (
            <DeleteConfirmButton label="Excluir Checklist" loading={loading} onConfirm={handleDelete} />
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
