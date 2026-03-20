interface AdminInlineNoticeProps {
  variant?: 'success' | 'error' | 'info';
  title: string;
  description: string;
}

const variantClasses = {
  success:
    'border-[color:var(--theme-state-success-border)] bg-[color:var(--theme-state-success-bg)] text-[color:var(--theme-state-success-text)]',
  error:
    'border-[color:var(--theme-state-error-border)] bg-[color:var(--theme-state-error-bg)] text-[color:var(--theme-state-error-text)]',
  info: 'border-[color:var(--theme-state-info-border)] bg-[color:var(--theme-state-info-bg)] text-[color:var(--theme-state-info-text)]',
} as const;

export function AdminInlineNotice({
  variant = 'info',
  title,
  description,
}: AdminInlineNoticeProps) {
  return (
    <div className={`border px-4 py-4 ${variantClasses[variant]}`}>
      <p className="text-[10px] font-medium tracking-[0.24em] uppercase">{title}</p>
      <p className="mt-2 text-sm leading-7 text-text-secondary">{description}</p>
    </div>
  );
}
