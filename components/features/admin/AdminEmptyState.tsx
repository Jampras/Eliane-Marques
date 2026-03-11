import { Badge } from '@/components/ui/Badge';
import { Heading, Text } from '@/components/ui/Typography';
import { LinkButton } from '@/components/ui/LinkButton';

interface AdminEmptyStateProps {
  badge: string;
  title: string;
  description: string;
  actionLabel: string;
  actionHref: string;
}

export function AdminEmptyState({
  badge,
  title,
  description,
  actionLabel,
  actionHref,
}: AdminEmptyStateProps) {
  return (
    <div className="bg-surface border border-border-soft px-6 py-10 text-center">
      <Badge className="mb-4">{badge}</Badge>
      <Heading as="h2" className="text-2xl sm:text-3xl">
        {title}
      </Heading>
      <Text className="mx-auto mt-3 max-w-xl text-sm leading-7">{description}</Text>
      <LinkButton href={actionHref} size="sm" className="mt-6">
        {actionLabel}
      </LinkButton>
    </div>
  );
}
