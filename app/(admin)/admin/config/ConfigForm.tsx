'use client';

import React, { useState } from 'react';
import { updateConfigs } from '@/lib/actions/admin-crud';
import { Button } from '@/components/ui/Button';
import { Heading, Text } from '@/components/ui/Typography';
import { Badge } from '@/components/ui/Badge';
import { AdminMobileFormBar } from '@/components/features/admin/AdminMobileFormBar';
import { AdminInlineNotice } from '@/components/features/admin/AdminInlineNotice';
import {
  ADMIN_FORM_PANEL_CLASS,
  ADMIN_INPUT_CLASS,
  ADMIN_LABEL_CLASS,
  ADMIN_TEXTAREA_CLASS,
} from '@/components/features/admin/formStyles';
import { useToast } from '@/components/ui/ToastProvider';

export default function ConfigForm({ initialConfigs }: { initialConfigs: Record<string, string> }) {
  const formId = 'admin-config-form';
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{
    variant: 'success' | 'error';
    title: string;
    description: string;
  } | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);
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
        setFeedback({
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
        setFeedback({
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
      setFeedback({
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
    { key: 'heroHeadline', label: 'Titulo Hero (Home)', type: 'textarea' },
    { key: 'heroSubheadline', label: 'Subtitulo Hero (Home)', type: 'textarea' },
    { key: 'siteName', label: 'Nome da Marca', type: 'text' },
    { key: 'instagramLink', label: 'Instagram URL', type: 'text' },
  ] as const;

  return (
    <div className="mx-auto max-w-4xl p-4 sm:p-6 lg:p-12">
      <div className="mb-8 sm:mb-10 lg:mb-12">
        <Badge className="mb-4">Global</Badge>
        <Heading as="h1" className="text-3xl sm:text-4xl">
          Configuracoes Gerais
        </Heading>
        <Text className="mt-2">Controle o conteudo principal e contatos do ecossistema.</Text>
      </div>

      <form id={formId} onSubmit={handleSubmit} className={ADMIN_FORM_PANEL_CLASS}>
        {fields.map((field) => (
          <div key={field.key} className="space-y-2">
            <label className={ADMIN_LABEL_CLASS}>{field.label}</label>
            {field.type === 'textarea' ? (
              <textarea
                name={field.key}
                defaultValue={initialConfigs[field.key]}
                rows={3}
                className={ADMIN_TEXTAREA_CLASS}
              />
            ) : (
              <input
                name={field.key}
                defaultValue={initialConfigs[field.key]}
                placeholder={'placeholder' in field ? field.placeholder : undefined}
                className={ADMIN_INPUT_CLASS}
              />
            )}
          </div>
        ))}

        {feedback && (
          <AdminInlineNotice
            variant={feedback.variant}
            title={feedback.title}
            description={feedback.description}
          />
        )}

        <div className="border-t border-border-soft pt-8">
          <Button type="submit" disabled={loading} className="hidden w-full lg:inline-flex">
            {loading ? 'Salvando...' : 'Publicar Alteracoes'}
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
