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
          <div class="space-y-6">
            <div class="rounded-lg border border-gray-700/50 bg-gray-800/50 p-6">
              <h3 class="mb-4 text-xl font-semibold text-gray-100">Frontend Development</h3>
              <ul class="space-y-2 text-gray-300">
                <li>• Modern JavaScript/TypeScript frameworks (Qwik, Vue, React)</li>
                <li>• Responsive design with Tailwind CSS</li>
              </ul>
            </div>
            <div class="rounded-lg border border-gray-700/50 bg-gray-800/50 p-6">
              <h3 class="mb-4 text-xl font-semibold text-gray-100">Backend Development</h3>
              <ul class="space-y-2 text-gray-300">
                <li>• RESTful API design and development</li>

              </ul>
            </div>
          </div>
          <div class="space-y-6">
            <div class="rounded-lg border border-gray-700/50 bg-gray-800/50 p-6">
              <h3 class="mb-4 text-xl font-semibold text-gray-100">Minecraft Development</h3>
              <ul class="space-y-2 text-gray-300">
                <li>• Plugin development (Bukkit/Spigot/Paper)</li>
                <li>• Mod development (Fabric/Forge)</li>
                <li>• Server management & optimization</li>
                <li>• Custom world generation</li>
              </ul>
            </div>
            <div class="rounded-lg border border-gray-700/50 bg-gray-800/50 p-6">
              <h3 class="mb-4 text-xl font-semibold text-gray-100">DevOps & Tools</h3>
              <ul class="space-y-2 text-gray-300">
                <li>• Cloud platforms (Cloudflare, some others)</li>
                <li>• Containerization (Docker)</li>
                <li>• CI/CD pipelines</li>
                <li>• Version control (Git)</li>
                <li>• Monitoring & logging</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section class="mb-16">
        <h2 class="mb-6 text-2xl font-bold text-gray-100 sm:text-3xl">
          Experience Levels
        </h2>
        <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div class="text-center">
            <div class="mb-3 rounded-full bg-green-500/20 p-4 text-green-400">
              <div class="text-2xl font-bold">Expert</div>
            </div>
            <h4 class="mb-2 font-semibold text-gray-200">5+ Years</h4>
            <p class="text-sm text-gray-400">JavaScript, HTML/CSS, Minecraft Development</p>
          </div>
          <div class="text-center">
            <div class="mb-3 rounded-full bg-blue-500/20 p-4 text-blue-400">
              <div class="text-2xl font-bold">Advanced</div>
            </div>
            <h4 class="mb-2 font-semibold text-gray-200">3+ Years</h4>
            <p class="text-sm text-gray-400">TypeScript, Qwik, Vue, Node.js</p>
          </div>
          <div class="text-center">
            <div class="mb-3 rounded-full bg-yellow-500/20 p-4 text-yellow-400">
              <div class="text-2xl font-bold">Intermediate</div>
            </div>
            <h4 class="mb-2 font-semibold text-gray-200">2+ Years</h4>
            <p class="text-sm text-gray-400">Python, C#, Docker</p>
          </div>
          <div class="text-center">
            <div class="mb-3 rounded-full bg-orange-500/20 p-4 text-orange-400">
              <div class="text-2xl font-bold">Learning</div>
            </div>
            <h4 class="mb-2 font-semibold text-gray-200">Active</h4>
            <p class="text-sm text-gray-400">Rust, Go, Machine Learning</p>
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
      content: 'Skills and technologies used by me, including frontend, backend, and Minecraft development expertise.',
    },
  ],
};