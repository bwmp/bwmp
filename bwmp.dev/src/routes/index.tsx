import { component$ } from '@builder.io/qwik';
import { routeLoader$, type DocumentHead, Link } from '@builder.io/qwik-city';
import { LogoDiscord } from '@luminescent/ui-qwik';
import { Github, Mail } from 'lucide-icons-qwik';
// @ts-ignore
import { SiModrinth } from 'simple-icons-qwik';
import ProjectCard from '~/components/projects/ProjectCard';
import LanyardActivities from '~/components/discord/LanyardActivities';
import DiscordStatus from '~/components/discord/DiscordStatus';
import { useLanyardStatus } from '~/components/discord/useLanyardStatus';
import GitHubStats from '~/components/github/GitHubStats';
import TechShowcase from '~/components/skills/TechShowcase';
import { Timeline } from '~/components/projects/Timeline';
import { getLanyardData, type LanyardData } from '~/lib/discord';
import {
  activeProjects,
  featuredProjects,
  otherProjects,
} from '~/data/projects';

type DiscordUser = NonNullable<LanyardData['data']>['discord_user'];

const DISCORD_USER_ID = '798738506859282482';

export const useDiscordUser = routeLoader$<{
  user: DiscordUser;
  isSafari: boolean;
} | null>(async (req) => {
  try {
    const isSafari =
      req.request.headers.get('user-agent')?.includes('Safari') || false;
    const lanyardData = await getLanyardData(DISCORD_USER_ID);
    if (!lanyardData.success || !lanyardData.data?.discord_user) {
      console.error('Failed to fetch Discord user data:', lanyardData.error);
      return null;
    }

    return {
      user: lanyardData.data.discord_user,
      isSafari,
    };
  } catch (error) {
    console.error('Error fetching Discord user data:', error);
    return null;
  }
});

const socials = [
  {
    href: 'https://github.com/bwmp',
    label: 'GitHub',
    variant: 'github',
    icon: <Github class="h-5 w-5" />,
  },
  {
    href: '/discord',
    label: 'Discord',
    variant: 'discord',
    icon: <LogoDiscord class="h-5 w-5" />,
  },
  {
    href: 'https://modrinth.com/user/bwmp',
    label: 'Modrinth',
    variant: 'modrinth',
    icon: <SiModrinth class="h-5 w-5" />,
  },
  {
    href: 'https://x.com/buwump',
    label: 'Twitter',
    variant: 'twitter',
    icon: (
      <img
        // eslint-disable-next-line qwik/jsx-img
        src="/icons/logo.svg"
        alt=""
        width="20"
        height="20"
        class="h-5 w-5 object-contain"
      />
    ),
  },
  {
    href: 'https://throne.com/bwmp',
    label: 'Throne',
    variant: 'throne',
    icon: (
      <img
        // eslint-disable-next-line qwik/jsx-img
        src="/icons/throne.svg"
        alt=""
        width="20"
        height="20"
        class="h-5 w-5 object-contain"
      />
    ),
  },
  {
    href: 'mailto:contact@bwmp.dev',
    label: 'Email',
    variant: 'email',
    icon: <Mail class="h-5 w-5" />,
  },
];

export default component$(() => {
  const discordUserData = useDiscordUser();
  const user = discordUserData.value?.user;
  const discordStatus = useLanyardStatus(user?.id ?? DISCORD_USER_ID);

  const display = user?.display_name || user?.global_name || user?.username || 'Oli';
  const avatarUrl = user?.avatar
    ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${user.avatar.startsWith('a_') ? 'gif' : 'png'}?size=128`
    : 'https://cdn.discordapp.com/embed/avatars/0.png';

  return (
    <div class="mx-auto max-w-6xl px-4">
      <header class="py-12 sm:py-16">
        <div class="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
          <div class="max-w-2xl">
            <div class="flex items-center gap-3">
              <div class="relative">
                <img
                  src={avatarUrl}
                  alt=""
                  width={48}
                  height={48}
                  decoding="async"
                  class="h-12 w-12 rounded-full object-cover ring-1 ring-gray-700"
                />
                <DiscordStatus status={discordStatus.status.value} size="sm" />
              </div>
              <div>
                <h1 class="text-2xl font-bold text-gray-100 sm:text-3xl">
                  {display}
                </h1>
                <p class="text-sm text-gray-400">
                  Self-taught full-stack developer
                </p>
              </div>
            </div>

            <p class="mt-8 text-lg leading-relaxed text-gray-200 sm:text-xl">
              I build web apps, Minecraft servers and tooling, and Discord bots
              — and I keep maintaining them long after the first release.
            </p>
            <p class="mt-4 leading-relaxed text-gray-400">
              I learn best hands-on: I pick up a new stack by shipping something
              real with it, then keep iterating. Most of what's below started as
              a problem I wanted solved and turned into something other people
              use.
            </p>

            <div class="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="#work"
                class="lum-btn rounded-lum-2 lum-bg-blue-600/80 hover:lum-bg-blue-500/80 px-5 py-2.5 text-sm font-semibold text-white"
              >
                View my work
              </a>
              <a
                href="mailto:contact@bwmp.dev"
                class="lum-btn rounded-lum-2 lum-bg-gray-800/60 hover:lum-bg-gray-700/70 px-5 py-2.5 text-sm font-semibold text-gray-100"
                data-umami-event="link-visit"
                data-umami-event-variant="email"
              >
                Get in touch
              </a>
            </div>

            <div class="mt-6 flex flex-wrap gap-1">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  title={social.label}
                  aria-label={social.label}
                  target={social.href.startsWith('mailto:') ? undefined : '_blank'}
                  rel="noopener noreferrer"
                  class="lum-btn rounded-lum-2 lum-bg-transparent hover:lum-bg-gray-800/60 p-2.5 text-gray-400 transition-colors hover:text-gray-100"
                  data-umami-event="link-visit"
                  data-umami-event-variant={social.variant}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {user && (
            <aside class="lg:w-72 lg:shrink-0">
              <LanyardActivities
                userId={user.id}
                isSafari={discordUserData.value?.isSafari}
                compact
              />
            </aside>
          )}
        </div>
      </header>

      <section
        id="work"
        aria-labelledby="work-title"
        class="scroll-mt-24 border-t border-gray-800 py-16"
      >
        <div class="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2
              id="work-title"
              class="text-2xl font-bold text-gray-100 sm:text-3xl"
            >
              Selected work
            </h2>
            <p class="mt-2 max-w-2xl text-gray-400">
              The projects I spend most of my time on. Everything here is live
              and maintained.
            </p>
          </div>
          <Link
            href="/projects"
            class="text-sm font-medium text-blue-300 transition-colors hover:text-blue-200"
          >
            All projects, including Minecraft mods →
          </Link>
        </div>

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

      <section
        id="about"
        aria-labelledby="about-title"
        class="scroll-mt-24 border-t border-gray-800 py-16"
      >
        <h2
          id="about-title"
          class="mb-8 text-2xl font-bold text-gray-100 sm:text-3xl"
        >
          About
        </h2>
        <div class="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <p class="leading-relaxed text-gray-300">
            I'm a self-taught full-stack developer who likes building useful
            things and learning by jumping in and figuring them out as I go.
            That hands-on approach has helped me adapt quickly to new tools.
            When I'm not coding I'm usually playing games, tinkering with side
            projects, or hanging out with friends.
          </p>
          <div class="grid gap-8 sm:grid-cols-2">
            <div>
              <h3 class="mb-3 text-sm font-semibold text-gray-200">
                What I work on
              </h3>
              <ul class="space-y-2 text-sm text-gray-400">
                <li>Full-stack web development</li>
                <li>Minecraft server &amp; plugin development</li>
                <li>Bot development &amp; Discord integrations</li>
                <li>Open source contributions</li>
              </ul>
            </div>
            <div>
              <h3 class="mb-3 text-sm font-semibold text-gray-200">
                Currently active
              </h3>
              <ul class="space-y-2 text-sm text-gray-400">
                {activeProjects.map((project) => (
                  <li key={project.id}>
                    {project.title}
                    {project.role && (
                      <span class="text-gray-500"> — {project.role}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section
        id="technologies"
        aria-labelledby="technologies-title"
        class="border-t border-gray-800 py-16"
      >
        <h2
          id="technologies-title"
          class="mb-2 text-2xl font-bold text-gray-100 sm:text-3xl"
        >
          Technologies
        </h2>
        <p class="mb-8 max-w-2xl text-gray-400">
          What I reach for, grouped by where it fits in a project.
        </p>
        <TechShowcase />
      </section>

      <section
        id="timeline"
        aria-labelledby="timeline-title"
        class="border-t border-gray-800 py-16"
      >
        <h2
          id="timeline-title"
          class="mb-2 text-2xl font-bold text-gray-100 sm:text-3xl"
        >
          Timeline
        </h2>
        <p class="mb-8 max-w-2xl text-gray-400">
          When I started each project or role, and how long I've been on it.
        </p>
        <Timeline />
      </section>

      <section
        id="github-stats"
        aria-labelledby="github-stats-title"
        class="border-t border-gray-800 py-16"
      >
        <h2
          id="github-stats-title"
          class="mb-8 text-2xl font-bold text-gray-100 sm:text-3xl"
        >
          GitHub activity
        </h2>
        <GitHubStats />
      </section>

      <section
        aria-labelledby="contact-title"
        class="border-t border-gray-800 py-16"
      >
        <h2
          id="contact-title"
          class="text-2xl font-bold text-gray-100 sm:text-3xl"
        >
          Get in touch
        </h2>
        <p class="mt-2 max-w-2xl text-gray-400">
          Email or Discord are the fastest ways to reach me.
        </p>
        <div class="mt-6 flex flex-wrap gap-3">
          <a
            href="mailto:contact@bwmp.dev"
            class="lum-btn rounded-lum-2 lum-bg-gray-800/60 hover:lum-bg-gray-700/70 px-5 py-2.5 text-sm font-semibold text-gray-100"
            data-umami-event="link-visit"
            data-umami-event-variant="email"
          >
            <Mail class="h-4 w-4" />
            contact@bwmp.dev
          </a>
          <a
            href="/discord"
            class="lum-btn rounded-lum-2 lum-bg-gray-800/60 hover:lum-bg-gray-700/70 px-5 py-2.5 text-sm font-semibold text-gray-100"
            data-umami-event="link-visit"
            data-umami-event-variant="discord"
          >
            <LogoDiscord class="h-4 w-4" />
            Discord
          </a>
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
      content:
        'Portfolio of Oli (bwmp) — full-stack developer building web apps, Minecraft tooling, and Discord bots.',
    },
  ],
};
