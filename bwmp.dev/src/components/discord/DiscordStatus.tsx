import { component$ } from '@builder.io/qwik';

type DiscordStatusProps = {
  status: 'online' | 'idle' | 'dnd' | 'offline' | null;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

const statusColors = {
  online: 'bg-green-500',
  idle: 'bg-yellow-500',
  dnd: 'bg-red-500',
  offline: 'bg-gray-500',
};

const statusSizes = {
  sm: 'w-3 h-3',
  md: 'w-4 h-4',
  lg: 'w-5 h-5',
};

const statusPositions = {
  sm: '-bottom-0.5 -right-0.5',
  md: '-bottom-1 -right-1',
  lg: '-bottom-1 -right-1',
};

export default component$<DiscordStatusProps>(({ status, size = 'md', className = '' }) => {
  if (!status || status === 'offline') {
    return null;
  }

  return (
    <div
      class={[
        'absolute rounded-full border-2 border-gray-900',
        statusColors[status],
        statusSizes[size],
        statusPositions[size],
        className,
      ].filter(Boolean).join(' ')}
      title={`Discord status: ${status}`}
      aria-label={`Discord status: ${status}`}
    />
  );
});
