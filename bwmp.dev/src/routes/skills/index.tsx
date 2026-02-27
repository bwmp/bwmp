import { component$ } from '@builder.io/qwik';
import { type DocumentHead } from '@builder.io/qwik-city';
import TechShowcase from '~/components/skills/TechShowcase';

export default component$(() => {
  return (
    <div class="mx-auto max-w-7xl px-4 py-24">
      <div class="mb-12">
        <h1 class="mb-4 text-4xl font-bold text-gray-100 sm:text-5xl">
          Skills & Technologies
        </h1>
        <p class="max-w-3xl text-lg leading-relaxed text-gray-400">
          A showcase of the technologies I work with and my areas of expertise.
          I'm always learning and adding new tools to my toolkit.
        </p>
      </div>

      <section class="mb-16">
        <h2 class="mb-6 text-2xl font-bold text-gray-100 sm:text-3xl">
          Technology Stack
        </h2>
        <TechShowcase />
      </section>

      <section class="mb-16">
        <h2 class="mb-6 text-2xl font-bold text-gray-100 sm:text-3xl">
          Expertise Areas
        </h2>
        <div class="grid gap-8 md:grid-cols-2">
          <div class="rounded-lg border border-gray-700/50 bg-gray-800/50 p-6">
            <h3 class="mb-4 text-xl font-semibold text-gray-100">
              Frontend Development
            </h3>
            <ul class="space-y-2 text-gray-300">
              <li>
                • Modern JavaScript/TypeScript frameworks (Qwik, Vue, React)
              </li>
              <li>• Responsive design with Tailwind CSS</li>
            </ul>
          </div>
          <div class="rounded-lg border border-gray-700/50 bg-gray-800/50 p-6">
            <h3 class="mb-4 text-xl font-semibold text-gray-100">
              Backend Development
            </h3>
            <ul class="space-y-2 text-gray-300">
              <li>• RESTful API design and development</li>
            </ul>
          </div>
          <div class="rounded-lg border border-gray-700/50 bg-gray-800/50 p-6">
            <h3 class="mb-4 text-xl font-semibold text-gray-100">
              Minecraft Development
            </h3>
            <ul class="space-y-2 text-gray-300">
              <li>• Plugin development (Bukkit/Spigot/Paper)</li>
              <li>• Mod development (Fabric/Forge)</li>
              <li>• Server management & optimization</li>
              <li>• Custom world generation</li>
            </ul>
          </div>
          <div class="rounded-lg border border-gray-700/50 bg-gray-800/50 p-6">
            <h3 class="mb-4 text-xl font-semibold text-gray-100">
              DevOps & Tools
            </h3>
            <ul class="space-y-2 text-gray-300">
              <li>• Cloud platforms (Cloudflare, OVH)</li>
              <li>• Containerization (Docker)</li>
              <li>• CI/CD pipelines</li>
              <li>• Version control (Git)</li>
              <li>• Monitoring & logging (Prometheus, Grafana, Loki)</li>
            </ul>
          </div>
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
