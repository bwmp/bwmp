import { component$ } from '@builder.io/qwik';
import { routeLoader$, type DocumentHead } from '@builder.io/qwik-city';
import { LogoDiscord } from '@luminescent/ui-qwik';
import { Github, Mail, ChevronDown } from 'lucide-icons-qwik';
import UniversalCarousel from '~/components/projects/UniversalCarousel';
import { type ModrinthProject } from '~/components/projects/ModrinthCard';
import { Tag } from '~/components/projects/Tag';
import projects from '~/data/projects.json';

type LanyardResponse = {
  data: LanyardData;
  success: boolean;
};

type LanyardData = {
  kv: Record<string, string>;
  spotify: Spotify | null;
  discord_user: DiscordUser;
  activities: Activity[];
  discord_status: 'online' | 'idle' | 'dnd' | 'offline';
  active_on_discord_web: boolean;
  active_on_discord_desktop: boolean;
  active_on_discord_mobile: boolean;
  listening_to_spotify: boolean;
};

type DiscordUser = {
  id: string;
  username: string;
  avatar: string | null;
  discriminator: string;
  bot: boolean;
  clan: unknown | null;
  global_name: string | null;
  avatar_decoration_data: unknown | null;
  display_name: string | null;
  public_flags: number;
};

type Activity = {
  id: string;
  name: string;
  type: number;
  state?: string;
  details?: string;
  emoji?: { id: string | null; name: string; animated?: boolean };
  created_at: number;
  [key: string]: unknown;
};

type Spotify = unknown;

export const useLanyard = routeLoader$<LanyardResponse | null>(async () => {
  try {
    const url = 'https://api.lanyard.rest/v1/users/798738506859282482';
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = (await res.json()) as LanyardResponse;
    return data;
  } catch {
    return null;
  }
});

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
  const discordUserData = useLanyard();
  const modrinthProjects = useModrinth();

  return (
    <div>
      <section class="relative flex min-h-dvh items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-4">
        <div class="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10"></div>
        <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-700/20 via-gray-900/40 to-gray-900"></div>

        <div class="absolute right-0 bottom-0 left-0 h-40 bg-gradient-to-b from-transparent to-gray-950"></div>

        <div class="rounded-lum-2 lum-bg-gray-900/60 relative w-full max-w-7xl overflow-hidden border border-gray-700/50 p-8 shadow-2xl backdrop-blur-sm sm:p-12 lg:p-16">
          {(() => {
            const user = discordUserData.value?.data?.discord_user;
            const display =
              user?.display_name ||
              user?.global_name ||
              user?.username ||
              'Oli';
            const avatarUrl = user?.avatar
              ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${user.avatar.startsWith('a_') ? 'gif' : 'png'}?size=256`
              : 'https://cdn.discordapp.com/embed/avatars/0.png';
            return (
              <div class="flex flex-col items-center gap-8 text-center lg:flex-row lg:items-center lg:gap-16 lg:text-left">
                <div class="relative">
                  <div class="absolute inset-0 animate-pulse rounded-full bg-gradient-to-r from-blue-400 to-purple-400 opacity-30 blur-lg"></div>
                  <img
                    src={avatarUrl}
                    alt={`${display} profile picture`}
                    width={128}
                    height={128}
                    loading="lazy"
                    decoding="async"
                    class="relative h-24 w-24 rounded-full object-cover ring-4 ring-gray-600/50 sm:h-32 sm:w-32 lg:h-36 lg:w-36"
                  />
                </div>

                <div class="flex-1 space-y-6">
                  <div class="space-y-4">
                    <p class="bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-3xl font-black tracking-tight text-transparent sm:text-4xl lg:text-6xl">
                      Hi, I'm {display}
                    </p>
                    <h1 class="text-xl font-bold text-gray-200 sm:text-2xl lg:text-4xl">
                      Making random, hopefully useful projects!
                    </h1>
                  </div>

                  <p class="text-base leading-relaxed text-gray-300 sm:text-lg lg:max-w-3xl lg:text-xl">
                    I'm a self taught full-stack developer with skills in many
                    different technologies.
                    <br class="hidden sm:block" />
                    I kinda just fuck around and find out with a lot of what I
                    do but it works out.
                    <br class="hidden sm:block" />I am a quick learner when it
                    comes to picking up new technologies!
                  </p>

                  <div class="flex flex-wrap items-center justify-center gap-3 lg:justify-start">
                    <Tag name="Qwik" iconSrc="/qwik.svg" />
                    <Tag name="TypeScript" />
                    <Tag name="TailwindCSS" />
                  </div>

                  <div class="flex flex-wrap justify-center gap-4 lg:justify-start">
                    <a
                      href="/discord"
                      class="lum-btn rounded-lum lum-bg-gray-800/60 hover:lum-bg-gray-700/80 border border-gray-600/50 px-4 py-3 text-gray-100 transition-all duration-200 hover:scale-105 hover:border-gray-500/50"
                      aria-label="Contact via Discord"
                    >
                      <LogoDiscord class="h-5 w-5" />
                    </a>
                    <a
                      href="/discord"
                      class="lum-btn rounded-lum lum-bg-gray-800/60 hover:lum-bg-gray-700/80 border border-gray-600/50 px-4 py-3 text-gray-100 transition-all duration-200 hover:scale-105 hover:border-gray-500/50"
                      aria-label="Contact via Discord"
                    >
                      <Github class="h-5 w-5" />
                    </a>
                    <a
                      href="https://modrinth.com/user/bwmp"
                      class="lum-btn rounded-lum lum-bg-gray-800/60 hover:lum-bg-gray-700/80 border border-gray-600/50 px-4 py-3 text-gray-100 transition-all duration-200 hover:scale-105 hover:border-gray-500/50"
                      aria-label="Check out my modrinth"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 512 514"
                        class="modrinth-icon text-brand"
                        data-v-7f8122f1=""
                      >
                        <path
                          fill="currentColor"
                          fill-rule="evenodd"
                          d="M503.16 323.56c11.39-42.09 12.16-87.65.04-132.8C466.57 54.23 326.04-26.8 189.33 9.78 83.81 38.02 11.39 128.07.69 230.47h43.3c10.3-83.14 69.75-155.74 155.76-178.76 106.3-28.45 215.38 28.96 253.42 129.67l-42.14 11.27c-19.39-46.85-58.46-81.2-104.73-95.83l-7.74 43.84c36.53 13.47 66.16 43.84 77 84.25 15.8 58.89-13.62 119.23-67 144.26l11.53 42.99c70.16-28.95 112.31-101.86 102.34-177.02l41.98-11.23a210.2 210.2 0 0 1-3.86 84.16z"
                          clip-rule="evenodd"
                        ></path>
                        <path
                          fill="currentColor"
                          d="M321.99 504.22C185.27 540.8 44.75 459.77 8.11 323.24A257.6 257.6 0 0 1 0 275.46h43.27c1.09 11.91 3.2 23.89 6.41 35.83 3.36 12.51 7.77 24.46 13.11 35.78l38.59-23.15c-3.25-7.5-5.99-15.32-8.17-23.45-24.04-89.6 29.2-181.7 118.92-205.71 17-4.55 34.1-6.32 50.8-5.61L255.19 133c-10.46.05-21.08 1.42-31.66 4.25-66.22 17.73-105.52 85.7-87.78 151.84 1.1 4.07 2.38 8.04 3.84 11.9l49.35-29.61-14.87-39.43 46.6-47.87 58.9-12.69 17.05 20.99-27.15 27.5-23.68 7.45-16.92 17.39 8.29 23.07s16.79 17.84 16.82 17.85l23.72-6.31 16.88-18.54 36.86-11.67 10.98 24.7-38.03 46.63-63.73 20.18-28.58-31.82-49.82 29.89c25.54 29.08 63.94 45.23 103.75 41.86l11.53 42.99c-59.41 7.86-117.44-16.73-153.49-61.91l-38.41 23.04c50.61 66.49 138.2 99.43 223.97 76.48 61.74-16.52 109.79-58.6 135.81-111.78l42.64 15.5c-30.89 66.28-89.84 118.94-166.07 139.34"
                        ></path>
                      </svg>
                    </a>
                    <a
                      href="mailto:oli@bwmp.dev"
                      class="lum-btn rounded-lum lum-bg-gray-800/60 hover:lum-bg-gray-700/80 border border-gray-600/50 px-4 py-3 text-gray-100 transition-all duration-200 hover:scale-105 hover:border-gray-500/50"
                      aria-label="Contact via email"
                    >
                      <Mail class="h-5 w-5" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>

        <button
          onClick$={() => {
            const targetId =
              modrinthProjects.value && modrinthProjects.value.length > 0
                ? 'projects'
                : 'modrinth-projects';
            document.getElementById(targetId)?.scrollIntoView({
              behavior: 'smooth',
            });
          }}
          class="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-gray-400 transition-colors duration-200 hover:text-gray-200"
          aria-label="Scroll down to projects"
        >
          <span class="text-sm font-medium">Scroll Down</span>
          <div class="animate-bounce">
            <ChevronDown class="h-6 w-6" />
          </div>
        </button>
      </section>

      <div class="mx-auto max-w-7xl px-4 py-10">
        <section id="projects" aria-labelledby="projects-title" class="mb-16">
          <h2
            id="projects-title"
            class="mb-6 text-2xl font-bold text-gray-100 sm:text-3xl"
          >
            Projects
          </h2>
          <UniversalCarousel
            items={projects.map((p) => ({ ...p, id: p.title }))}
            type="portfolio"
          />
        </section>
        {modrinthProjects.value && modrinthProjects.value.length > 0 && (
          <section
            id="modrinth-projects"
            aria-labelledby="modrinth-projects-title"
          >
            <h2
              id="modrinth-projects-title"
              class="mb-6 text-2xl font-bold text-gray-100 sm:text-3xl"
            >
              Modrinth Projects
            </h2>
            <UniversalCarousel items={modrinthProjects.value} type="modrinth" />
          </section>
        )}
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: 'bwmp.dev Meow :3',
  meta: [
    {
      name: 'description',
      content: 'My personal website, mainly used to show off my projects and other stuff.',
    },
  ],
};
