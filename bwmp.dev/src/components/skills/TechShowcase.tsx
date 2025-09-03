import { component$ } from '@builder.io/qwik';
import { Hoverable } from '@luminescent/ui-qwik';
interface Skill {
  name: string;
  icon?: any;
  iconSrc?: string;
  level: 'expert' | 'intermediate' | 'learning';
  category: 'frontend' | 'backend' | 'languages';
  color?: string;
  iconClasses?: string;
}

const skills: Skill[] = [
  // Frontend
  {
    name: 'Qwik',
    iconSrc: '/qwik.svg',
    level: 'intermediate',
    category: 'frontend',
    color: 'from-blue-400 to-cyan-400',
  },
  {
    name: 'Vue.js',
    iconSrc: '/vue.svg',
    level: 'learning',
    category: 'frontend',
    color: 'from-green-400 to-emerald-500',
  },
  {
    name: 'TailwindCSS',
    iconSrc: '/tailwindcss.svg',
    level: 'intermediate',
    category: 'frontend',
    color: 'from-teal-400 to-cyan-500',
  },

  {
    name: 'Node.js',
    iconSrc: '/nodejs.svg',
    level: 'intermediate',
    category: 'backend',
    color: 'from-green-500 to-green-600',
  },
  {
    name: 'TypeScript',
    iconSrc: '/typescript.svg',
    level: 'intermediate',
    category: 'languages',
    color: 'from-blue-500 to-blue-600',
  },
  {
    name: 'Python',
    iconSrc: '/python.svg',
    level: 'intermediate',
    category: 'languages',
    color: 'from-yellow-400 to-blue-500',
  },
  {
    name: 'C#',
    level: 'learning',
    category: 'languages',
    color: 'from-purple-500 to-purple-600',
  },
  {
    name: 'Java',
    level: 'learning',
    category: 'languages',
    color: 'from-red-500 to-orange-500',
  },
];

const categories = {
  frontend: { name: 'Frontend', color: 'text-cyan-400' },
  backend: { name: 'Backend', color: 'text-green-400' },
  languages: { name: 'Languages', color: 'text-purple-400' },
};

const levelColors = {
  expert: 'bg-green-500/20 border-green-400/30 text-green-300',
  intermediate: 'bg-yellow-500/20 border-yellow-400/30 text-yellow-300',
  learning: 'bg-purple-500/20 border-purple-400/30 text-purple-300',
};

export default component$(() => {
  return (
    <div class="space-y-8">
      <div class="text-center lg:text-left">
        <h3 class="mb-2 text-lg font-semibold text-gray-200">
          Technologies & Skills
        </h3>
        <p class="text-sm text-gray-400">
          Here are the technologies I work with, organized by category and skill
          level
        </p>
      </div>

      <div class="space-y-6">
        {Object.entries(categories).map(([categoryKey, categoryInfo]) => {
          const categorySkills = skills.filter(
            (skill) => skill.category === categoryKey,
          );

          if (categorySkills.length === 0) return null;

          return (
            <div key={categoryKey} class="space-y-3">
              <h4
                class={`text-sm font-medium ${categoryInfo.color} flex items-center gap-2`}
              >
                <span class="h-px max-w-8 flex-1 bg-current"></span>
                {categoryInfo.name}
                <span class="h-px flex-1 bg-current"></span>
              </h4>

              <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                {categorySkills.map((skill) => (
                  <div
                    key={skill.name}
                    class="group lum-card lum-hoverable relative overflow-hidden"
                    onMouseMove$={(e, el) => Hoverable.onMouseMove$(e, el)}
                    onMouseLeave$={(e, el) => Hoverable.onMouseLeave$(e, el)}
                  >
                    <div
                      class={`absolute inset-0 bg-gradient-to-br ${skill.color || 'from-gray-600 to-gray-700'} opacity-0 transition-opacity duration-300 group-hover:opacity-10`}
                    ></div>

                    <div class="relative space-y-3">
                      <div class="flex items-center justify-center">
                        {skill.iconSrc ? (
                          <img
                            src={skill.iconSrc}
                            alt={skill.name}
                            class="h-8 w-8 object-contain"
                            width="32"
                            height="32"
                          />
                        ) : skill.icon ? (
                          <skill.icon
                            class={`h-8 w-8 transition-colors group-hover:text-white ${skill.iconClasses || ''}`}
                          />
                        ) : (
                          <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-600/50">
                            <span class="text-xs font-bold text-gray-300">
                              {skill.name.charAt(0)}
                            </span>
                          </div>
                        )}
                      </div>

                      <div class="text-center">
                        <p class="text-xs leading-tight font-medium text-gray-200 transition-colors group-hover:text-white">
                          {skill.name}
                        </p>
                      </div>

                      <div class="flex justify-center">
                        <span
                          class={`rounded-full border px-2 py-1 text-xs ${levelColors[skill.level]} font-medium`}
                        >
                          {skill.level === 'expert'
                            ? '●●●'
                            : skill.level === 'intermediate'
                              ? '●●○'
                              : '●○○'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div class="flex flex-wrap justify-center gap-4 text-xs lg:justify-start">
        <div class="flex items-center gap-2">
          <div class="h-3 w-3 rounded-full border border-green-400/50 bg-green-500/30"></div>
          <span class="text-gray-400">●●● Expert</span>
        </div>
        <div class="flex items-center gap-2">
          <div class="h-3 w-3 rounded-full border border-yellow-400/50 bg-yellow-500/30"></div>
          <span class="text-gray-400">●●○ Intermediate</span>
        </div>
        <div class="flex items-center gap-2">
          <div class="h-3 w-3 rounded-full border border-purple-400/50 bg-purple-500/30"></div>
          <span class="text-gray-400">●○○ Learning</span>
        </div>
      </div>
    </div>
  );
});
