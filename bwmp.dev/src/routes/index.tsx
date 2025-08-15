import { $, component$, useOnDocument, useSignal } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';
import Project from '~/components/projects/project';
import { Tag } from '~/components/projects/Tag';
import projects from '~/data/projects.json';
type ProjectData = (typeof projects)[number] & { imageComponentKey?: string };

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

export default component$(() => {
  const discordUserData = useSignal<LanyardResponse | null>(null);
  useOnDocument(
    'DOMContentLoaded',
    $(() => {
      const url = 'https://api.lanyard.rest/v1/users/798738506859282482';
      fetch(url)
        .then((response) => response.json() as Promise<LanyardResponse>)
        .then((data) => {
          discordUserData.value = data;
          console.log(data);
        })
        .catch((err) => {
          console.error('Failed to load Lanyard data', err);
        });
    }),
  );

  return (
    <div class="mx-auto mt-20 max-w-7xl px-4 py-10">
      <section class="rounded-lum-2 lum-bg-gray-900/40 relative mb-10 overflow-hidden border border-gray-800/50 p-8 sm:p-12">
        {(() => {
          const user = discordUserData.value?.data?.discord_user;
          const display =
            user?.display_name ||
            user?.global_name ||
            user?.username ||
            'Welcome';
          const avatarUrl = user?.avatar
            ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${user.avatar.startsWith('a_') ? 'gif' : 'png'}?size=128`
            : 'https://cdn.discordapp.com/embed/avatars/0.png';
          return (
            <div class="flex items-center gap-6 md:gap-10">
              <img
                src={avatarUrl}
                alt={`${display} profile picture`}
                width={96}
                height={96}
                loading="lazy"
                decoding="async"
                class="h-24 w-24 rounded-full border border-gray-700 object-cover md:h-28 md:w-28"
              />
              <div class="flex-1">
                <p class="mb-4 text-3xl font-extrabold tracking-tight text-gray-100 sm:text-5xl">
                  Hi, I'm {display}
                </p>
                <h1 class="mb-4 text-3xl font-extrabold tracking-tight text-gray-100 sm:text-3xl">
                  Making random, hopefully useful projects!
                </h1>
                <p class="mb-6 max-w-2xl text-gray-300">
                  I'm a self taught full-stack developer with skills in many
                  different technologies.
                  <br />
                  I kinda just fuck around and find out with a lot of what I do
                  but it works out
                  <br />I am a quick learner when it comes to picking up new
                  technologies!
                </p>
                <div class="mb-6 flex flex-wrap items-center gap-3">
                  <Tag name="Qwik" iconSrc="/qwik.svg" />
                  <Tag name="TypeScript" />
                  <Tag name="TailwindCSS" />
                </div>
                <div class="flex flex-wrap gap-3">
                  <a
                    href="#projects"
                    class="lum-btn rounded-lum lum-bg-orange-700/70 hover:lum-bg-orange-700 px-4 py-2 text-white transition"
                    aria-label="Skip to projects"
                  >
                    View Projects
                  </a>
                  <a
                    href="mailto:oli@bwmp.dev"
                    class="lum-btn rounded-lum lum-bg-transparent hover:lum-bg-gray-800/60 border border-gray-700 px-4 py-2 text-gray-100 transition"
                    aria-label="Contact via email"
                  >
                    Email
                  </a>
                  <a
                    href="/discord"
                    class="lum-btn rounded-lum lum-bg-transparent hover:lum-bg-gray-800/60 border border-gray-700 px-4 py-2 text-gray-100 transition"
                    aria-label="Contact via Discord"
                  >
                    Discord
                  </a>
                </div>
              </div>
            </div>
          );
        })()}
      </section>

      <section id="projects" aria-labelledby="projects-title">
        <h2 id="projects-title" class="mb-4 text-2xl font-bold text-gray-100">
          Projects
        </h2>
        <div class="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {(projects as ProjectData[]).map((p) => (
            <Project
              key={p.title}
              title={p.title}
              description={p.description}
              imageUrl={p.imageUrl}
              imageComponentKey={p.imageComponentKey}
              tech={p.tech}
              links={p.links}
            />
          ))}
        </div>
      </section>
    </div>
  );
});

export const head: DocumentHead = {
  title: 'bwmp.dev Meow :3',
  meta: [
    {
      name: 'description',
      content: 'My personal/portfolio website',
    },
  ],
};
