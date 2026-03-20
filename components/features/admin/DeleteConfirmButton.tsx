'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Typography';

interface DeleteConfirmButtonProps {
  label: string;
  loading: boolean;
  onConfirm: () => Promise<void>;
}

export const DeleteConfirmButton: React.FC<DeleteConfirmButtonProps> = ({
  label,
  loading,
  onConfirm,
}) => {
  const [confirming, setConfirming] = useState(false);

  if (!confirming) {
    return (
      <Button
        type="button"
        variant="outline"
        onClick={() => setConfirming(true)}
        disabled={loading}
        className="w-full border-red-500/20 text-red-500 hover:border-red-500 hover:bg-red-500/5 md:w-auto"
      >
        {label}
      </Button>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-left-2 flex flex-wrap items-center gap-2 border border-[color:var(--theme-state-error-border)] bg-[color:var(--theme-state-error-bg)] px-3 py-2">
      <Text className="mr-2 text-[10px] font-bold tracking-widest text-[color:var(--theme-state-error-text)] uppercase">
        Confirmar exclusao?
      </Text>
      <Button
        type="button"
        onClick={onConfirm}
        disabled={loading}
        className="!border-[color:var(--cacau)] !bg-[color:var(--cacau)] px-4 py-1 text-[10px] !text-[color:var(--aveia)] hover:!bg-[color:var(--espresso)]"
      >
        Sim
      </Button>
      <Button
        type="button"
        variant="outline"
        onClick={() => setConfirming(false)}
        disabled={loading}
        className="border-border px-4 py-1 text-[10px]"
      >
        Cancelar
      </Button>
    </div>
  );
};
