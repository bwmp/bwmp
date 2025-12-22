import { component$ } from '@builder.io/qwik';
import { routeLoader$, type DocumentHead } from '@builder.io/qwik-city';
import ProjectCard from '~/components/projects/ProjectCard';
import ModrinthCard, {
  type ModrinthProject,
} from '~/components/projects/ModrinthCard';
import projects from '~/data/projects.json';

export const useModrinth = routeLoader$<ModrinthProject[]>(async () => {
  try {
    const url = 'https://api.modrinth.com/v2/user/bwmp/projects';
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = (await res.json()) as any[];

    return data.map((project) => ({
      id: project.id,
      slug: project.slug,
      title: project.title,
      description: project.description,
      downloads: project.downloads,
      followers: project.followers,
      categories: project.categories || [],
      loaders: project.loaders || [],
      icon_url: project.icon_url,
    }));
  } catch {
    return [];
  }
});

export default component$(() => {
  const modrinthProjects = useModrinth();

  return (
    <div class="mx-auto max-w-7xl px-4 py-24">
      <div class="mb-12">
        <h1 class="mb-4 text-4xl font-bold text-gray-100 sm:text-5xl">
          My Projects
        </h1>
        <p class="max-w-3xl text-lg leading-relaxed text-gray-400">
          A collection of projects I've worked on, from web applications to
          Minecraft mods and Discord bots. Each project represents a learning
          experience and a step forward in my development journey.
        </p>
      </div>

      <div class="mb-12 flex flex-wrap gap-4">
        <div class="rounded-lg bg-gray-800/50 px-4 py-2">
          <span class="text-sm font-medium text-gray-300">
            {projects.length + (modrinthProjects.value?.length || 0)} Total
            Projects
          </span>
        </div>
        <div class="rounded-lg bg-blue-500/20 px-4 py-2">
          <span class="text-sm font-medium text-blue-300">
            {projects.length} Projects
          </span>
        </div>
        {modrinthProjects.value && modrinthProjects.value.length > 0 && (
          <div class="rounded-lg bg-green-500/20 px-4 py-2">
            <span class="text-sm font-medium text-green-300">
              {modrinthProjects.value.length} Minecraft Projects
            </span>
          </div>
        )}
      </div>

      <section class="mb-16">
        <h2 class="mb-6 text-2xl font-bold text-gray-100 sm:text-3xl">
          Portfolio Projects
        </h2>
        <p class="mb-8 max-w-3xl text-gray-400">
          These are some of my main projects that showcase different aspects of
          my development skills.
        </p>
        <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {projects.map((project) => (
            <ProjectCard
              key={project.title}
              project={{ ...project, id: project.title }}
            />
          ))}
        </div>
      </section>

      {modrinthProjects.value && modrinthProjects.value.length > 0 && (
        <section class="mb-16">
          <h2 class="mb-6 text-2xl font-bold text-gray-100 sm:text-3xl">
            Minecraft Mods & Plugins
          </h2>
          <p class="mb-8 max-w-3xl text-gray-400">
            My contributions to the Minecraft community through various mods and
            plugins available on Modrinth.
          </p>
          <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {modrinthProjects.value.map((project) => (
              <ModrinthCard key={project.id} project={project} />
            ))}
          </div>
        </section>
      )}

      <section class="mt-16 text-center">
        <div class="rounded-lg border border-gray-700/50 bg-gray-800/50 p-8">
          <h3 class="mb-4 text-xl font-semibold text-gray-100">
            Want to see more of my work?
          </h3>
          <p class="mb-6 text-gray-400">
            Check out my GitHub for more repositories, or visit my main page to
            learn more about me.
          </p>
          <div class="flex flex-wrap justify-center gap-4">
            <a
              href="https://github.com/bwmp"
              target="_blank"
              rel="noopener noreferrer"
              class="rounded-lg bg-gray-700/50 px-6 py-3 font-medium text-gray-100 transition-all hover:bg-gray-600/50"
            >
              View GitHub Profile
            </a>
            <a
              href="/"
              class="rounded-lg bg-blue-600/50 px-6 py-3 font-medium text-gray-100 transition-all hover:bg-blue-500/50"
            >
              Back to Homepage
            </a>
          </div>
        </div>
      </section>
    </div>
  );
});

export const head: DocumentHead = {
  title: 'Projects - bwmp.dev',
  meta: [
    {
      name: 'description',
      content:
        'A collection of projects by me, including web applications, Minecraft mods, and Discord bots.',
    },
  ],
};
