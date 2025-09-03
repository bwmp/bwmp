export type TechIconKey = string;

export const techIconSrc: Record<TechIconKey, string> = {
  Qwik: '/qwik.svg',
  Minecraft: '/minecraft.avif',
  TypeScript: '/typescript.svg',
  Python: '/python.svg',
  Vue: '/vue.svg',
  Tailwind: '/tailwindcss.svg',
  'Node.js': '/nodejs.svg',
};

const techIconSrcLower: Record<string, string> = Object.keys(techIconSrc).reduce(
  (acc, key) => {
    acc[key.toLowerCase()] = techIconSrc[key];
    return acc;
  },
  {} as Record<string, string>,
);

export function getTechIcon(name: string): string | undefined {
  if (!name) return undefined;
  return techIconSrc[name] ?? techIconSrcLower[name.toLowerCase()];
}