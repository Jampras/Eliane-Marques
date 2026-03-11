'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';

interface AdminMobileFormBarProps {
  formId: string;
  loading: boolean;
  saveLabel: string;
  savingLabel: string;
  onCancel?: () => void;
  cancelLabel?: string;
}

export const AdminMobileFormBar: React.FC<AdminMobileFormBarProps> = ({
  formId,
  loading,
  saveLabel,
  savingLabel,
  onCancel,
  cancelLabel = 'Cancelar',
}) => {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[color:var(--linho)] bg-[color:rgba(247,240,230,0.97)] px-4 pt-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] shadow-[0_-10px_24px_rgba(58,36,24,0.08)] backdrop-blur-sm lg:hidden">
      <div className="flex gap-3">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            disabled={loading}
            onClick={onCancel}
            className="flex-1 !py-3"
          >
            {cancelLabel}
          </Button>
        )}

        <Button type="submit" form={formId} disabled={loading} className="flex-1 !py-3">
          {loading ? savingLabel : saveLabel}
        </Button>
      </div>
    </div>
  );
};
