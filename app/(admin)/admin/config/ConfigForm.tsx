'use client';

import React, { useState } from 'react';
import { updateConfigs } from '@/lib/actions/admin-crud';
import { Button } from '@/components/ui/Button';
import { Heading, Text } from '@/components/ui/Typography';
import { Badge } from '@/components/ui/Badge';
import { AdminMobileFormBar } from '@/components/features/admin/AdminMobileFormBar';
import { useToast } from '@/components/ui/ToastProvider';

export default function ConfigForm({ initialConfigs }: { initialConfigs: Record<string, string> }) {
  const formId = 'admin-config-form';
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData) as Record<string, string>;

    try {
      const result = await updateConfigs(data);

      if (result.success) {
        showToast({
          variant: 'success',
          title: 'Configuracoes atualizadas',
          description: 'As alteracoes ja estao disponiveis no site.',
        });
      } else {
        showToast({
          variant: 'error',
          title: 'Nao foi possivel salvar',
          description: result.error || 'Verifique os campos e tente novamente.',
        });
      }
    } catch (error) {
      console.error(error);
      showToast({
        variant: 'error',
        title: 'Erro ao atualizar configuracoes',
        description: 'Tente novamente em instantes.',
      });
    } finally {
      setLoading(false);
    }
  }

  const fields = [
    {
      key: 'whatsappNumber',
      label: 'WhatsApp (com DDD)',
      type: 'text',
      placeholder: '5511999999999',
    },
    { key: 'whatsappDefaultMessage', label: 'Mensagem Padrao WhatsApp', type: 'textarea' },
    {
      key: 'contactEmail',
      label: 'Email de Contato',
      type: 'text',
      placeholder: 'contato@seudominio.com',
    },
    { key: 'heroHeadline', label: 'Título Hero (Home)', type: 'textarea' },
    { key: 'heroSubheadline', label: 'Subtítulo Hero (Home)', type: 'textarea' },
    { key: 'siteName', label: 'Nome da Marca', type: 'text' },
    { key: 'instagramLink', label: 'Instagram URL', type: 'text' },
  ];

  return (
    <div className="mx-auto max-w-4xl p-4 sm:p-6 lg:p-12">
      <div className="mb-8 sm:mb-10 lg:mb-12">
        <Badge className="mb-4">Global</Badge>
        <Heading as="h1" className="text-3xl sm:text-4xl">
          Configurações Gerais
        </Heading>
        <Text className="mt-2">Controle o conteúdo principal e contatos do ecossistema.</Text>
      </div>

      <form
        id={formId}
        onSubmit={handleSubmit}
        className="bg-surface space-y-8 border border-border-soft p-4 pb-28 sm:p-6 lg:p-12 lg:pb-12"
      >
        {fields.map((f) => (
          <div key={f.key} className="space-y-2">
            <label className="text-text-secondary text-[10px] tracking-widest uppercase">
              {f.label}
            </label>
            {f.type === 'textarea' ? (
              <textarea
                name={f.key}
                defaultValue={initialConfigs[f.key]}
                rows={3}
                className="focus:border-primary w-full resize-none border border-border bg-bg p-4 text-sm outline-none"
              />
            ) : (
              <input
                name={f.key}
                defaultValue={initialConfigs[f.key]}
                placeholder={f.placeholder}
                className="focus:border-primary w-full border border-border bg-bg p-4 text-sm outline-none"
              />
            )}
          </div>
        ))}

        <div className="border-t border-border-soft pt-8">
          <Button type="submit" disabled={loading} className="hidden w-full lg:inline-flex">
            {loading ? 'Salvando...' : 'Publicar Alterações'}
          </Button>
        </div>
      </form>

      <AdminMobileFormBar
        formId={formId}
        loading={loading}
        saveLabel="Salvar"
        savingLabel="Salvando..."
      />
    </div>
  );
}
