import { component$, JSX } from '@builder.io/qwik';

interface TagProps {
  name: string;
  icon?: JSX.Element;
  iconSrc?: string;
  iconAlt?: string;
  iconSize?: number;
}

export const Tag = component$<TagProps>(
  ({ name, icon, iconSrc, iconAlt, iconSize = 14 }) => {
    return (
      <span class="rounded-lum-4 lum-bg-gray-700/40 flex items-center gap-1.5 px-2 py-1 text-xs font-medium text-gray-300">
        {icon ? (
          <span class="inline-block h-3.5 w-3.5">{icon}</span>
        ) : iconSrc ? (
          <img
            src={iconSrc}
            alt={iconAlt ?? ''}
            width={iconSize}
            height={iconSize}
            class="inline-block"
          />
        ) : null}
        {name}
      </span>
    );
  },
);
