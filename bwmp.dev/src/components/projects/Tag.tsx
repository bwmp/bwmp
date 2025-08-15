import { component$, JSX } from '@builder.io/qwik';

interface TagProps {
  name: string;
  icon?: JSX.Element;
  iconSrc?: string;
  iconAlt?: string;
  iconSize?: number;
}

export const Tag = component$<TagProps>(({ name, icon, iconSrc, iconAlt, iconSize = 16 }) => {
  return (
    <p class="lum-btn lum-bg-blue-800/50 rounded-lum text-xs gap-1.5 font-semibold p-1 pr-2 flex items-center">
      {icon ? (
        <span class="inline-block w-4 h-4">{icon}</span>
      ) : iconSrc ? (
        <img
          src={iconSrc}
          alt={iconAlt ?? `${name} icon`}
          width={iconSize}
          height={iconSize}
          class="inline-block"
        />
      ) : null}
      {name}
    </p>
  );
});