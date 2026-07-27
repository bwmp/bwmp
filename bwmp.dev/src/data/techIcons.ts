export type TechIconKey = string;

export const techIconSrc: Record<TechIconKey, string> = {
  Qwik: '/icons/qwik.svg',
  Minecraft: '/icons/minecraft.avif',
  TypeScript: '/icons/typescript.svg',
  Python: '/icons/python.svg',
  Vue: '/icons/vue.svg',
  Tailwind: '/icons/tailwindcss.svg',
  'Node.js': '/icons/nodejs.svg',
  Blazor: '/icons/blazor.svg',
  Docker: '/icons/docker.svg',
  Cloudflare: '/icons/cloudflare.svg',
  Grafana: '/icons/grafana.svg',
  Github: '/icons/github.svg',
  Go: '/icons/go.svg',
  Rust: '/icons/rust.svg',
  Tauri: '/icons/tauri.svg',
  React: '/icons/react.svg',
  Java: '/icons/java.svg',
  'C#': '/icons/csharp.svg',
  Git: '/icons/git.svg',
  Prometheus: '/icons/prometheus.svg',
  Loki: '/icons/loki.png',
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