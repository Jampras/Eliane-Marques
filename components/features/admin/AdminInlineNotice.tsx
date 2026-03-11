interface AdminInlineNoticeProps {
  variant?: 'success' | 'error' | 'info';
  title: string;
  description: string;
}

const variantClasses = {
  success:
    'border-[color:rgba(168,184,154,0.45)] bg-[color:rgba(168,184,154,0.12)] text-[color:var(--espresso)]',
  error:
    'border-[color:rgba(184,132,90,0.35)] bg-[color:rgba(184,132,90,0.12)] text-[color:var(--espresso)]',
  info: 'border-border-soft bg-[color:rgba(221,208,188,0.16)] text-[color:var(--espresso)]',
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
