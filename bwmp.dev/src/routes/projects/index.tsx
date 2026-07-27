import { component$ } from '@builder.io/qwik';
import { routeLoader$, type DocumentHead } from '@builder.io/qwik-city';
import ProjectCard from '~/components/projects/ProjectCard';
import ModrinthCard, {
  type ModrinthProject,
} from '~/components/projects/ModrinthCard';
import { featuredProjects, otherProjects } from '~/data/projects';

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
    <div class="mx-auto max-w-6xl px-4">
      <header class="py-12 sm:py-16">
        <h1 class="text-3xl font-bold text-gray-100 sm:text-4xl">Projects</h1>
        <p class="mt-4 max-w-2xl text-lg leading-relaxed text-gray-400">
          Everything I've built and still maintain — web apps, Minecraft servers
          and tooling, and Discord bots. Each one started as a problem I wanted
          solved.
        </p>
      </header>

      <section
        aria-labelledby="portfolio-title"
        class="border-t border-gray-800 py-16"
      >
        <h2
          id="portfolio-title"
          class="mb-8 text-2xl font-bold text-gray-100 sm:text-3xl"
        >
          Products &amp; platforms
        </h2>

        <div class="grid gap-5 lg:grid-cols-2">
          {featuredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} featured />
          ))}
        </div>

        <div class="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {otherProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>

      {modrinthProjects.value && modrinthProjects.value.length > 0 && (
        <section
          aria-labelledby="modrinth-title"
          class="border-t border-gray-800 py-16"
        >
          <h2
            id="modrinth-title"
            class="text-2xl font-bold text-gray-100 sm:text-3xl"
          >
            Minecraft mods &amp; plugins
          </h2>
          <p class="mt-2 mb-8 max-w-2xl text-gray-400">
            Published on Modrinth. Download and follower counts are pulled live
            from their API.
          </p>
          <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {modrinthProjects.value.map((project) => (
              <ModrinthCard key={project.id} project={project} />
            ))}
          </div>
        </section>
      )}

      <section class="border-t border-gray-800 py-16">
        <p class="text-gray-400">
          More repositories, including the ones that never made it this far, are
          on{' '}
          <a
            href="https://github.com/bwmp"
            target="_blank"
            rel="noopener noreferrer"
            class="font-medium text-blue-300 transition-colors hover:text-blue-200"
          >
            my GitHub profile
          </a>
          .
        </p>
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
