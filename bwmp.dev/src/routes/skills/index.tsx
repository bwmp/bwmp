import { component$ } from '@builder.io/qwik';
import { type DocumentHead } from '@builder.io/qwik-city';
import TechShowcase from '~/components/skills/TechShowcase';

const expertise = [
  {
    area: 'Frontend',
    items: [
      'Modern JavaScript/TypeScript frameworks (Qwik, Vue, React)',
      'Responsive design with Tailwind CSS',
    ],
  },
  {
    area: 'Backend',
    items: ['RESTful API design and development'],
  },
  {
    area: 'Minecraft',
    items: [
      'Plugin development (Bukkit/Spigot/Paper)',
      'Mod development (Fabric/Forge)',
      'Server management & optimization',
      'Custom world generation',
    ],
  },
  {
    area: 'DevOps',
    items: [
      'Cloud platforms (Cloudflare, OVH)',
      'Containerization (Docker)',
      'CI/CD pipelines',
      'Version control (Git)',
      'Monitoring & logging (Prometheus, Grafana, Loki)',
    ],
  },
];

export default component$(() => {
  return (
    <div class="mx-auto max-w-6xl px-4">
      <header class="py-12 sm:py-16">
        <h1 class="text-3xl font-bold text-gray-100 sm:text-4xl">Skills</h1>
        <p class="mt-4 max-w-2xl text-lg leading-relaxed text-gray-400">
          The technologies I work with and where I've gone deep. I'm always
          adding to this as projects pull me into new stacks.
        </p>
      </header>

      <section
        aria-labelledby="stack-title"
        class="border-t border-gray-800 py-16"
      >
        <h2
          id="stack-title"
          class="mb-8 text-2xl font-bold text-gray-100 sm:text-3xl"
        >
          Technology stack
        </h2>
        <TechShowcase />
      </section>

      <section
        aria-labelledby="expertise-title"
        class="border-t border-gray-800 py-16"
      >
        <h2
          id="expertise-title"
          class="mb-8 text-2xl font-bold text-gray-100 sm:text-3xl"
        >
          Where I've gone deep
        </h2>
        <div class="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {expertise.map((group) => (
            <div key={group.area}>
              <h3 class="mb-3 text-sm font-semibold text-gray-200">
                {group.area}
              </h3>
              <ul class="space-y-2 text-sm leading-relaxed text-gray-400">
                {group.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
});

export const head: DocumentHead = {
  title: 'Skills - bwmp.dev',
  meta: [
    {
      name: 'description',
      content:
        'Skills and technologies used by me, including frontend, backend, and Minecraft development expertise.',
    },
  ],
};
