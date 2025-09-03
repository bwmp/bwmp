// Centralized technology icon mapping for reuse across components.
// Add new technologies here so they become available everywhere.

export type TechIconKey = string; // You can narrow this union if you want stricter typing.

export const techIconSrc: Record<TechIconKey, string> = {
  Qwik: '/qwik.svg',
  Minecraft: '/minecraft.avif',
  TypeScript: '/typescript.svg',
  Python: '/python.svg',
  Vue: '/vue.svg',
  Tailwind: '/tailwindcss.svg',
  'Node.js': '/nodejs.svg',
};

// Helper to safely read an icon (returns undefined if missing)
export function getTechIcon(name: string): string | undefined {
  return techIconSrc[name];
}