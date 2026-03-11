'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/ToastProvider';
import type { ActionResponse } from '@/lib/server/action-runner';

interface ToastMessages {
  createSuccessTitle: string;
  updateSuccessTitle: string;
  saveSuccessDescription: string;
  saveErrorTitle: string;
  saveErrorDescription: string;
  deleteSuccessTitle: string;
  deleteSuccessDescription: string;
  deleteErrorTitle: string;
  deleteErrorDescription: string;
  connectionErrorTitle: string;
  connectionErrorDescription: string;
}

interface UseAdminEntityFormOptions<TPayload> {
  entityId?: string;
  redirectTo: string;
  messages: ToastMessages;
  saveAction: (id: string | null, payload: TPayload) => Promise<ActionResponse>;
  mapSubmitPayload: (form: HTMLFormElement) => TPayload;
  deleteAction?: (id: string) => Promise<ActionResponse>;
}

interface AdminFormFeedback {
  variant: 'error';
  title: string;
  description: string;
}

export function useAdminEntityForm<TPayload>({
  entityId,
  redirectTo,
  messages,
  saveAction,
  mapSubmitPayload,
  deleteAction,
}: UseAdminEntityFormOptions<TPayload>) {
  const router = useRouter();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<AdminFormFeedback | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);

    try {
      const result = await saveAction(entityId ?? null, mapSubmitPayload(e.currentTarget));

      if (result.success) {
        showToast({
          variant: 'success',
          title: entityId ? messages.updateSuccessTitle : messages.createSuccessTitle,
          description: messages.saveSuccessDescription,
        });
        router.push(redirectTo);
        return;
      }

      showToast({
        variant: 'error',
        title: messages.saveErrorTitle,
        description: result.error || messages.saveErrorDescription,
      });
      setFeedback({
        variant: 'error',
        title: messages.saveErrorTitle,
        description: result.error || messages.saveErrorDescription,
      });
    } catch (error) {
      console.error(error);
      showToast({
        variant: 'error',
        title: messages.connectionErrorTitle,
        description: messages.connectionErrorDescription,
      });
      setFeedback({
        variant: 'error',
        title: messages.connectionErrorTitle,
        description: messages.connectionErrorDescription,
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!entityId || !deleteAction) {
      return;
    }

    setLoading(true);
    setFeedback(null);

    try {
      const result = await deleteAction(entityId);

      if (result.success) {
        showToast({
          variant: 'success',
          title: messages.deleteSuccessTitle,
          description: messages.deleteSuccessDescription,
        });
        router.push(redirectTo);
        return;
      }

      showToast({
        variant: 'error',
        title: messages.deleteErrorTitle,
        description: result.error || messages.deleteErrorDescription,
      });
      setFeedback({
        variant: 'error',
        title: messages.deleteErrorTitle,
        description: result.error || messages.deleteErrorDescription,
      });
    } catch (error) {
      console.error(error);
      showToast({
        variant: 'error',
        title: messages.deleteErrorTitle,
        description: messages.deleteErrorDescription,
      });
      setFeedback({
        variant: 'error',
        title: messages.deleteErrorTitle,
        description: messages.deleteErrorDescription,
      });
    } finally {
      setLoading(false);
    }
  }

  return {
    feedback,
    loading,
    handleSubmit,
    handleDelete,
    handleCancel: () => router.back(),
  };
}
