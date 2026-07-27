import { component$ } from '@builder.io/qwik';
import { getTechIcon } from '~/data/techIcons';

export interface Skill {
  name: string;
  iconSrc?: string;
  category: 'frontend' | 'languages' | 'tools';
}

export const skills: Skill[] = [
  // Frontend
  { name: 'Qwik', iconSrc: getTechIcon('Qwik'), category: 'frontend' },
  { name: 'React', iconSrc: getTechIcon('React'), category: 'frontend' },
  { name: 'Vue.js', iconSrc: getTechIcon('Vue'), category: 'frontend' },
  {
    name: 'TailwindCSS',
    iconSrc: getTechIcon('Tailwind'),
    category: 'frontend',
  },
  {
    name: 'Blazor/Mudblazor',
    iconSrc: getTechIcon('Blazor'),
    category: 'frontend',
  },
  // Languages
  { name: 'Node.js', iconSrc: getTechIcon('Node.js'), category: 'languages' },
  { name: 'GoLang', iconSrc: getTechIcon('Go'), category: 'languages' },
  {
    name: 'TypeScript',
    iconSrc: getTechIcon('TypeScript'),
    category: 'languages',
  },
  { name: 'Python', iconSrc: getTechIcon('Python'), category: 'languages' },
  { name: 'C#', iconSrc: getTechIcon('C#'), category: 'languages' },
  { name: 'Java', iconSrc: getTechIcon('Java'), category: 'languages' },
  // Tools
  { name: 'Docker', iconSrc: getTechIcon('Docker'), category: 'tools' },
  {
    name: 'Cloudflare',
    iconSrc: getTechIcon('Cloudflare'),
    category: 'tools',
  },
  { name: 'Grafana', iconSrc: getTechIcon('Grafana'), category: 'tools' },
  {
    name: 'Prometheus',
    iconSrc: getTechIcon('Prometheus'),
    category: 'tools',
  },
  { name: 'Loki', iconSrc: getTechIcon('Loki'), category: 'tools' },
  { name: 'Git', iconSrc: getTechIcon('Git'), category: 'tools' },
];

const categories: Record<Skill['category'], string> = {
  frontend: 'Frontend',
  languages: 'Languages',
  tools: 'Tools & DevOps',
};

export default component$(() => {
  return (
    <div class="space-y-8">
      {Object.entries(categories).map(([categoryKey, categoryName]) => {
        const categorySkills = skills.filter(
          (skill) => skill.category === categoryKey,
        );
        if (categorySkills.length === 0) return null;

        return (
          <div key={categoryKey}>
            <h3 class="mb-3 text-sm font-semibold text-gray-300">
              {categoryName}
            </h3>
            <div class="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {categorySkills.map((skill) => (
                <div
                  key={skill.name}
                  class="rounded-lum-2 lum-bg-gray-800/30 flex items-center gap-2.5 px-3 py-2.5"
                >
                  {skill.iconSrc ? (
                    <img
                      src={skill.iconSrc}
                      alt=""
                      class="h-5 w-5 shrink-0 object-contain"
                      width="20"
                      height="20"
                      loading="lazy"
                    />
                  ) : (
                    <span class="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-gray-700/60 text-[10px] font-bold text-gray-300">
                      {skill.name.charAt(0)}
                    </span>
                  )}
                  <span class="truncate text-sm text-gray-300">
                    {skill.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
});
