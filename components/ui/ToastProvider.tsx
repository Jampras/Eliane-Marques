'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Icon, type IconName } from '@/components/ui/Icon';

type ToastVariant = 'success' | 'error' | 'info';

interface ToastInput {
  title: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
  actionLabel?: string;
  onAction?: () => void;
}

interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  variant: ToastVariant;
  duration: number;
  actionLabel?: string;
  onAction?: () => void;
}

interface ToastContextValue {
  showToast: (toast: ToastInput) => string;
  dismissToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const MAX_TOASTS = 3;
const DEFAULT_DURATION = 3800;
let toastCounter = 0;

const variantStyles: Record<ToastVariant, string> = {
  success:
    'border-[color:var(--theme-state-success-border)] bg-[color:var(--manteiga)] text-[color:var(--theme-state-success-text)]',
  error:
    'border-[color:var(--theme-state-error-border)] bg-[color:var(--creme-rosa)] text-[color:var(--theme-state-error-text)]',
  info: 'border-[color:var(--theme-state-info-border)] bg-[color:var(--aveia)] text-[color:var(--theme-state-info-text)]',
};

const variantIcon: Record<ToastVariant, IconName> = {
  success: 'check_circle',
  error: 'error',
  info: 'info',
};

function nextToastId() {
  toastCounter += 1;
  return `toast-${Date.now()}-${toastCounter}`;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const timersRef = useRef<Record<string, number>>({});

  const dismissToast = useCallback((id: string) => {
    const timer = timersRef.current[id];
    if (timer) {
      window.clearTimeout(timer);
      delete timersRef.current[id];
    }

    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    (input: ToastInput) => {
      const id = nextToastId();
      const duration = input.duration ?? DEFAULT_DURATION;
      const toast: ToastMessage = {
        id,
        title: input.title,
        description: input.description,
        variant: input.variant ?? 'info',
        duration,
        actionLabel: input.actionLabel,
        onAction: input.onAction,
      };

      setToasts((prev) => {
        const next = [...prev, toast];
        return next.slice(-MAX_TOASTS);
      });

      if (duration > 0) {
        timersRef.current[id] = window.setTimeout(() => {
          dismissToast(id);
        }, duration);
      }

      return id;
    },
    [dismissToast]
  );

  useEffect(() => {
    const timers = timersRef.current;

    return () => {
      Object.values(timers).forEach((timer) => window.clearTimeout(timer));
    };
  }, []);

  const value = useMemo(() => ({ showToast, dismissToast }), [showToast, dismissToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}

      <div
        aria-live="polite"
        aria-atomic="true"
        className="pointer-events-none fixed inset-x-4 top-4 z-[200] sm:left-auto sm:w-[380px]"
      >
        <div className="space-y-3">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className={`pointer-events-auto border px-4 py-4 shadow-[var(--theme-toast-shadow)] ${variantStyles[toast.variant]}`}
            >
              <div className="flex items-start gap-3">
                <Icon
                  name={variantIcon[toast.variant]}
                  className="mt-0.5 text-[20px] text-[color:var(--argila)]"
                />

                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-[500] leading-tight text-[color:var(--espresso)]">
                    {toast.title}
                  </p>
                  {toast.description && (
                    <p className="mt-1 text-[11px] leading-[1.75] text-[color:var(--taupe)]">
                      {toast.description}
                    </p>
                  )}

                  {toast.actionLabel && toast.onAction && (
                    <button
                      type="button"
                      className="mt-3 text-[9px] uppercase tracking-[0.18em] text-[color:var(--cacau)] transition-colors hover:text-[color:var(--argila)]"
                      onClick={() => {
                        toast.onAction?.();
                        dismissToast(toast.id);
                      }}
                    >
                      {toast.actionLabel}
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => dismissToast(toast.id)}
                  className="text-[color:var(--taupe)] transition-colors hover:text-[color:var(--espresso)]"
                  aria-label="Fechar notificacao"
                >
                  <Icon name="close" className="text-[18px]" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast must be used inside ToastProvider');
  }

  return context;
}
