import type { SVGProps } from 'react';
import { cn } from '@/lib/utils/cn';

export type IconName =
  | 'add_shopping_cart'
  | 'admin_panel_settings'
  | 'alternate_email'
  | 'analytics'
  | 'article'
  | 'chat'
  | 'check_circle'
  | 'checklist'
  | 'cloud_upload'
  | 'close'
  | 'dashboard'
  | 'delete'
  | 'edit_note'
  | 'error'
  | 'expand_less'
  | 'expand_more'
  | 'home'
  | 'image'
  | 'info'
  | 'logout'
  | 'mail'
  | 'menu'
  | 'playlist_add'
  | 'progress_activity'
  | 'settings'
  | 'shopping_bag'
  | 'tune';

interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'name'> {
  name: IconName;
}

const commonProps = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

function Path({ name }: { name: IconName }) {
  switch (name) {
    case 'dashboard':
      return <path {...commonProps} d="M4 4h7v7H4zM13 4h7v5h-7zM13 11h7v9h-7zM4 13h7v7H4z" />;
    case 'shopping_bag':
      return (
        <>
          <path {...commonProps} d="M6 8h12l-1 12H7L6 8Z" />
          <path {...commonProps} d="M9 8a3 3 0 1 1 6 0" />
        </>
      );
    case 'article':
      return (
        <>
          <path {...commonProps} d="M6 4h12v16H6z" />
          <path {...commonProps} d="M9 8h6M9 12h6M9 16h4" />
        </>
      );
    case 'checklist':
      return (
        <>
          <path {...commonProps} d="M9 7h10M9 12h10M9 17h10M5 7l1 1 2-2M5 12l1 1 2-2M5 17l1 1 2-2" />
        </>
      );
    case 'settings':
    case 'tune':
      return (
        <>
          <circle {...commonProps} cx="12" cy="12" r="3" />
          <path {...commonProps} d="M19.4 15a1 1 0 0 0 .2 1.1l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1 1 0 0 0-1.1-.2 1 1 0 0 0-.6.9V20a2 2 0 1 1-4 0v-.2a1 1 0 0 0-.7-1 1 1 0 0 0-1.1.2l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1 1 0 0 0 .2-1.1 1 1 0 0 0-.9-.6H4a2 2 0 1 1 0-4h.2a1 1 0 0 0 1-.7 1 1 0 0 0-.2-1.1l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1 1 0 0 0 1.1.2 1 1 0 0 0 .6-.9V4a2 2 0 1 1 4 0v.2a1 1 0 0 0 .7 1 1 1 0 0 0 1.1-.2l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1 1 0 0 0-.2 1.1 1 1 0 0 0 .9.6H20a2 2 0 1 1 0 4h-.2a1 1 0 0 0-1 .7Z" />
        </>
      );
    case 'logout':
      return (
        <>
          <path {...commonProps} d="M10 17l5-5-5-5" />
          <path {...commonProps} d="M15 12H3" />
          <path {...commonProps} d="M7 21h10a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H7" />
        </>
      );
    case 'menu':
      return <path {...commonProps} d="M4 7h16M4 12h16M4 17h16" />;
    case 'close':
      return <path {...commonProps} d="M6 6l12 12M18 6 6 18" />;
    case 'mail':
      return (
        <>
          <path {...commonProps} d="M4 6h16v12H4z" />
          <path {...commonProps} d="m4 7 8 6 8-6" />
        </>
      );
    case 'alternate_email':
      return (
        <>
          <circle {...commonProps} cx="12" cy="12" r="8" />
          <path {...commonProps} d="M15.5 12a3.5 3.5 0 1 1-3.5-3.5v6a2 2 0 1 0 2-2" />
        </>
      );
    case 'chat':
      return (
        <>
          <path {...commonProps} d="M5 6h14v10H9l-4 4V6Z" />
        </>
      );
    case 'add_shopping_cart':
      return (
        <>
          <path {...commonProps} d="M3 5h2l2.4 9.5h8.8L19 8H7.2M10 18h.01M17 18h.01" />
          <path {...commonProps} d="M12 4v4M10 6h4" />
        </>
      );
    case 'edit_note':
      return (
        <>
          <path {...commonProps} d="M4 6h9M4 10h9M4 14h5" />
          <path {...commonProps} d="m14 15 5-5 2 2-5 5-3 1 1-3Z" />
        </>
      );
    case 'playlist_add':
      return (
        <>
          <path {...commonProps} d="M4 7h10M4 12h10M4 17h6" />
          <path {...commonProps} d="M18 11v6M15 14h6" />
        </>
      );
    case 'analytics':
      return <path {...commonProps} d="M5 17V9M12 17V5M19 17v-7" />;
    case 'info':
      return (
        <>
          <circle {...commonProps} cx="12" cy="12" r="9" />
          <path {...commonProps} d="M12 10v5M12 7h.01" />
        </>
      );
    case 'image':
      return (
        <>
          <rect {...commonProps} x="4" y="5" width="16" height="14" />
          <path {...commonProps} d="m7 15 3-3 2 2 3-4 2 2 1 3" />
          <circle {...commonProps} cx="9" cy="9" r="1" />
        </>
      );
    case 'home':
      return (
        <>
          <path {...commonProps} d="M4 10.5 12 4l8 6.5" />
          <path {...commonProps} d="M6 9.5V20h12V9.5" />
          <path {...commonProps} d="M10 20v-5h4v5" />
        </>
      );
    case 'expand_less':
      return <path {...commonProps} d="m6 14 6-6 6 6" />;
    case 'expand_more':
      return <path {...commonProps} d="m6 10 6 6 6-6" />;
    case 'delete':
      return (
        <>
          <path {...commonProps} d="M5 7h14M9 7V5h6v2M8 7l1 12h6l1-12" />
        </>
      );
    case 'progress_activity':
      return (
        <>
          <path {...commonProps} d="M12 3a9 9 0 1 0 9 9" />
          <path {...commonProps} d="M12 3a9 9 0 0 1 9 9" opacity="0.35" />
        </>
      );
    case 'cloud_upload':
      return (
        <>
          <path {...commonProps} d="M7 17a4 4 0 1 1 .8-7.9A5 5 0 0 1 18 10h1a3 3 0 0 1 0 6H7Z" />
          <path {...commonProps} d="m12 10-3 3M12 10l3 3M12 10v8" />
        </>
      );
    case 'admin_panel_settings':
      return (
        <>
          <path {...commonProps} d="M12 3 5 6v5c0 4.2 2.7 8.1 7 10 4.3-1.9 7-5.8 7-10V6l-7-3Z" />
          <path {...commonProps} d="M9.5 12.5 11 14l3.5-3.5" />
        </>
      );
    case 'check_circle':
      return (
        <>
          <circle {...commonProps} cx="12" cy="12" r="9" />
          <path {...commonProps} d="m8.5 12 2.2 2.2 4.8-4.7" />
        </>
      );
    case 'error':
      return (
        <>
          <path {...commonProps} d="M12 4 3 20h18L12 4Z" />
          <path {...commonProps} d="M12 9v5M12 17h.01" />
        </>
      );
  }
}

export function Icon({ name, className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      className={cn('inline-block h-[1em] w-[1em] shrink-0', className)}
      {...props}
    >
      <Path name={name} />
    </svg>
  );
}
