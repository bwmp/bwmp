import { component$ } from '@builder.io/qwik';
import { routeLoader$, type DocumentHead, Link } from '@builder.io/qwik-city';
import { LogoDiscord } from '@luminescent/ui-qwik';
import { Github, Mail, ChevronDown } from 'lucide-icons-qwik';
// @ts-ignore
import { SiModrinth } from 'simple-icons-qwik';
import UniversalCarousel from '~/components/projects/UniversalCarousel';
import LanyardActivities from '~/components/discord/LanyardActivities';
import DiscordStatus from '~/components/discord/DiscordStatus';
import { useLanyardStatus } from '~/components/discord/useLanyardStatus';
import GitHubStats from '~/components/github/GitHubStats';
import TechShowcase from '~/components/skills/TechShowcase';
import { Timeline } from '~/components/projects/Timeline';
import { getLanyardData, type LanyardData } from '~/lib/discord';
import projects from '~/data/projects.json';

type DiscordUser = NonNullable<LanyardData['data']>['discord_user'];

export const useDiscordUser = routeLoader$<{
  user: DiscordUser;
  bannerUrl: string | undefined;
  isSafari: boolean;
} | null>(async (req) => {
  try {
    const isSafari =
      req.request.headers.get('user-agent')?.includes('Safari') || false;
    const userid = '798738506859282482';
    const lanyardData = await getLanyardData(userid);
    const bannerUrl = lanyardData.data?.kv?.banner;
    if (!lanyardData.success || !lanyardData.data?.discord_user) {
      console.error('Failed to fetch Discord user data:', lanyardData.error);
      return null;
    }

    return {
      user: lanyardData.data.discord_user,
      bannerUrl,
      isSafari,
    };
  } catch (error) {
    console.error('Error fetching Discord user data:', error);
    return null;
  }
});

export default component$(() => {
  const discordUserData = useDiscordUser();

  const discordStatus = useLanyardStatus(
    discordUserData.value?.user?.id || '798738506859282482',
  );

  return (
    <div>
      <section class="relative flex min-h-dvh items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-4">
        <div class="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10"></div>
        <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-700/20 via-gray-900/40 to-gray-900"></div>

        <div class="absolute right-0 bottom-0 left-0 h-40 bg-gradient-to-b from-transparent to-gray-950"></div>
        {(() => {
          const user = discordUserData.value?.user;
          const display =
            user?.display_name || user?.global_name || user?.username || 'Oli';
          const avatarUrl = user?.avatar
            ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${user.avatar.startsWith('a_') ? 'gif' : 'png'}?size=256`
            : 'https://cdn.discordapp.com/embed/avatars/0.png';

          return (
            <div class="rounded-lum-2 relative w-full max-w-7xl overflow-hidden border border-gray-700/50 shadow-2xl backdrop-blur-sm">
              {discordUserData.value?.bannerUrl ? (
                <>
                  <div class="absolute inset-0">
                    <img
                      src={discordUserData.value.bannerUrl}
                      alt="Discord banner background"
                      width={1024}
                      height={512}
                      class="h-full w-full object-cover blur-xs"
                      loading="lazy"
                    />
                    <div class="absolute inset-0 bg-gray-900/70"></div>
                  </div>
                </>
              ) : (
                <div class="lum-bg-gray-900/60 absolute inset-0"></div>
              )}

              <div class="relative p-8 sm:p-12 lg:p-16">
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
                    <DiscordStatus
                      status={discordStatus.status.value}
                      size="lg"
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
                      I enjoy learning with a hands on approach, I learn best by
                      doing and experimenting.
                      <br class="hidden sm:block" />I am a quick learner when it
                      comes to picking up new technologies!
                    </p>

                    <div class="flex flex-wrap justify-center gap-4 lg:justify-start">
                      <a
                        href="/discord"
                        class="lum-btn rounded-lum lum-bg-gray-800/60 hover:lum-bg-gray-700/80 border border-gray-600/50 px-4 py-3 text-gray-100 transition-all duration-200 hover:scale-105 hover:border-gray-500/50"
                        aria-label="Contact via Discord"
                        data-umami-event="link-visit"
                        data-umami-event-variant="discord"
                        target="_blank"
                      >
                        <LogoDiscord class="h-5 w-5" />
                      </a>
                      <a
                        href="https://github.com/bwmp"
                        class="lum-btn rounded-lum lum-bg-gray-800/60 hover:lum-bg-gray-700/80 border border-gray-600/50 px-4 py-3 text-gray-100 transition-all duration-200 hover:scale-105 hover:border-gray-500/50"
                        aria-label="Check out my GitHub"
                        data-umami-event="link-visit"
                        data-umami-event-variant="github"
                        target="_blank"
                      >
                        <Github class="h-5 w-5" />
                      </a>
                      <a
                        href="https://throne.com/bwmp"
                        class="lum-btn rounded-lum lum-bg-gray-800/60 hover:lum-bg-gray-700/80 border border-gray-600/50 px-4 py-3 text-gray-100 transition-all duration-200 hover:scale-105 hover:border-gray-500/50"
                        aria-label="Check out my Throne"
                        data-umami-event="link-visit"
                        data-umami-event-variant="throne"
                        target="_blank"
                      >
                        <img
                          // eslint-disable-next-line qwik/jsx-img
                          src="/icons/throne.svg"
                          class="h-5 w-5 object-contain"
                          width="20"
                          height="20"
                        />
                      </a>
                      <a
                        href="https://x.com/buwump"
                        class="lum-btn rounded-lum lum-bg-gray-800/60 hover:lum-bg-gray-700/80 border border-gray-600/50 px-4 py-3 text-gray-100 transition-all duration-200 hover:scale-105 hover:border-gray-500/50"
                        aria-label="Check out my Twitter"
                        data-umami-event="link-visit"
                        data-umami-event-variant="twitter"
                        target="_blank"
                      >
                        <img
                          // eslint-disable-next-line qwik/jsx-img
                          src="/icons/logo.svg"
                          class="h-5 w-5 object-contain"
                          width="20"
                          height="20"
                        />
                      </a>
                      <a
                        href="https://modrinth.com/user/bwmp"
                        class="lum-btn rounded-lum lum-bg-gray-800/60 hover:lum-bg-gray-700/80 border border-gray-600/50 px-4 py-3 text-gray-100 transition-all duration-200 hover:scale-105 hover:border-gray-500/50"
                        aria-label="Check out my modrinth"
                        data-umami-event="link-visit"
                        data-umami-event-variant="modrinth"
                        target="_blank"
                      >
                        <SiModrinth class="h-5 w-5" />
                      </a>
                      <a
                        href="mailto:contact@bwmp.dev"
                        class="lum-btn rounded-lum lum-bg-gray-800/60 hover:lum-bg-gray-700/80 border border-gray-600/50 px-4 py-3 text-gray-100 transition-all duration-200 hover:scale-105 hover:border-gray-500/50"
                        aria-label="Contact via email"
                        data-umami-event="link-visit"
                        data-umami-event-variant="email"
                        target="_blank"
                      >
                        <Mail class="h-5 w-5" />
                      </a>
                    </div>
                  </div>
                </div>
                {discordUserData.value?.user && (
                  <div class="pt-8">
                    <LanyardActivities
                      userId={discordUserData.value.user.id}
                      isSafari={discordUserData.value.isSafari}
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })()}

        <button
          onClick$={() => {
            const targetId = 'about';
            document.getElementById(targetId)?.scrollIntoView({
              behavior: 'smooth',
            });
          }}
          class="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-gray-400 transition-colors duration-200 hover:text-gray-200"
          aria-label="Scroll down to about section"
        >
          <span class="text-sm font-medium">Scroll Down</span>
          <div class="animate-bounce">
            <ChevronDown class="h-6 w-6" />
          </div>
        </button>
      </section>

      <div class="mx-auto max-w-7xl px-4 py-10">
        <section
          id="about"
          aria-labelledby="about-title"
          class="mb-16 scroll-mt-20"
        >
          <h2
            id="about-title"
            class="mb-6 text-2xl font-bold text-gray-100 sm:text-3xl"
          >
            About Me
          </h2>
          <div class="grid gap-8 lg:grid-cols-2 lg:gap-12">
            <div class="space-y-4">
              <p class="text-base leading-relaxed text-gray-300 sm:text-lg">
                I'm a self-taught full-stack developer who likes building useful
                projects and learning by jumping in and figuring things out as I
                go. That hands-on approach has helped me adapt quickly to new
                tools, and when I'm not coding I'm usually playing games, or
                tinkering with side projects, or hanging out with friends.
              </p>
            </div>
            <div class="space-y-6">
              <div>
                <h3 class="mb-3 text-lg font-semibold text-gray-200">
                  What I Do
                </h3>
                <ul class="space-y-2 text-gray-300">
                  <li class="flex items-center gap-2">
                    <div class="h-2 w-2 rounded-full bg-blue-400"></div>
                    Full-stack web development
                  </li>
                  <li class="flex items-center gap-2">
                    <div class="h-2 w-2 rounded-full bg-purple-400"></div>
                    Minecraft server & plugin development
                  </li>
                  <li class="flex items-center gap-2">
                    <div class="h-2 w-2 rounded-full bg-green-400"></div>
                    Bot development & Discord integrations
                  </li>
                  <li class="flex items-center gap-2">
                    <div class="h-2 w-2 rounded-full bg-orange-400"></div>
                    Open source contributions
                  </li>
                </ul>
              </div>
              <div>
                <h3 class="mb-3 text-lg font-semibold text-gray-200">
                  Currently Working On
                </h3>
                <ul class="space-y-2 text-gray-300">
                  <li>Lumin - Discord bot with utilities and fun features</li>
                  <li>Mineplace - 3D collaborative art platform</li>
                  <li>Birdflop - Nonprofit Minecraft hosting</li>
                  <li>PiShock - Internet-controlled remote shock device platform with shareable access and integrations.</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
        <section
          id="technologies"
          aria-labelledby="technologies-title"
          class="mb-16"
        >
          <h2
            id="technologies-title"
            class="mb-6 text-2xl font-bold text-gray-100 sm:text-3xl"
          >
            Technologies & Skills
          </h2>
          <TechShowcase />
        </section>

        <section id="timeline" aria-labelledby="timeline-title" class="mb-16">
          <h2
            id="timeline-title"
            class="mb-6 text-2xl font-bold text-gray-100 sm:text-3xl"
          >
            Timeline
          </h2>
          <p class="mb-6 max-w-3xl text-sm leading-relaxed text-gray-400 sm:text-base">
            A quick look at when I started certain projects/jobs and how long
            I've been working on them.
          </p>
          <Timeline />
        </section>

        <section
          id="github-stats"
          aria-labelledby="github-stats-title"
          class="mb-16"
        >
          <h2
            id="github-stats-title"
            class="mb-6 text-2xl font-bold text-gray-100 sm:text-3xl"
          >
            GitHub Activity
          </h2>
          <GitHubStats />
        </section>

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

        <section class="mb-16">
          <h2 class="mb-8 text-center text-2xl font-bold text-gray-100 sm:text-3xl">
            Want to Learn More?
          </h2>
          <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Link
              href="/projects"
              class="group rounded-lg border border-gray-700/50 bg-gray-800/50 p-6 transition-all duration-200 hover:border-gray-600/50 hover:bg-gray-700/50"
            >
              <h3 class="mb-3 text-xl font-semibold text-gray-100 group-hover:text-white">
                View All Projects →
              </h3>
              <p class="text-gray-400 group-hover:text-gray-300">
                Explore my complete portfolio including detailed project
                descriptions, tech stacks, and live demos.
              </p>
            </Link>
            <Link
              href="/skills"
              class="group rounded-lg border border-gray-700/50 bg-gray-800/50 p-6 transition-all duration-200 hover:border-gray-600/50 hover:bg-gray-700/50"
            >
              <h3 class="mb-3 text-xl font-semibold text-gray-100 group-hover:text-white">
                Skills & Expertise →
              </h3>
              <p class="text-gray-400 group-hover:text-gray-300">
                Deep dive into my technical skills, expertise areas, and the
                technologies I work with daily.
              </p>
            </Link>
            <Link
              href="/timeline"
              class="group rounded-lg border border-gray-700/50 bg-gray-800/50 p-6 transition-all duration-200 hover:border-gray-600/50 hover:bg-gray-700/50"
            >
              <h3 class="mb-3 text-xl font-semibold text-gray-100 group-hover:text-white">
                My Journey →
              </h3>
              <p class="text-gray-400 group-hover:text-gray-300">
                Follow my development journey with a detailed timeline of
                projects, roles, and milestones.
              </p>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: 'bwmp.dev Meow :3',
  meta: [
    {
      name: 'description',
      content:
        'My personal website, mainly used to show off my projects and other stuff.',
    },
  ],
};
