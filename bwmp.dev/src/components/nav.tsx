import { $, component$, useOnDocument, useSignal } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';
import { LogoDiscord, LogoLuminescentFull, Nav } from '@luminescent/ui-qwik';
import { Github } from 'lucide-icons-qwik';

export default component$(() => {
  const hidden = useSignal(true);

  useOnDocument(
    'scroll',
    $(() => {
      hidden.value = window.scrollY < 10;
    }),
  );

  return (
    <Nav
      floating
      fixed
      colorClass="lum-bg-lum-input-bg/50 !text-lum-text"
      class={{
        '-mt-20': hidden.value,
      }}
    >
      <Link
        q:slot="start"
        href="/"
        class="lum-btn lum-bg-transparent rounded-lum-2 gap-2 p-0 px-2 font-bold"
      >
        bwmp
      </Link>

      <div q:slot="center" class="hidden gap-4 md:flex">
        <button
          onClick$={() => {
            if (window.location.pathname === '/') {
              document.getElementById('about')?.scrollIntoView({
                behavior: 'smooth',
              });
            } else {
              window.location.href = '/#about';
            }
          }}
          class="lum-btn lum-bg-transparent hover:lum-bg-gray-700/50 rounded-lum-2 px-3 py-2 text-sm font-medium transition-all"
        >
          About
        </button>
        <Link
          href="/projects"
          class="lum-btn lum-bg-transparent hover:lum-bg-gray-700/50 rounded-lum-2 px-3 py-2 text-sm font-medium transition-all"
        >
          Projects
        </Link>
        <Link
          href="/skills"
          class="lum-btn lum-bg-transparent hover:lum-bg-gray-700/50 rounded-lum-2 px-3 py-2 text-sm font-medium transition-all"
        >
          Skills
        </Link>
        <Link
          href="/timeline"
          class="lum-btn lum-bg-transparent hover:lum-bg-gray-700/50 rounded-lum-2 px-3 py-2 text-sm font-medium transition-all"
        >
          Timeline
        </Link>
      </div>

      <div q:slot="end" class="hidden gap-2 sm:flex">
        <SocialButtons />
      </div>

      <a
        q:slot="mobile"
        href="https://luminescent.dev"
        class="lum-btn lum-bg-transparent"
      >
        <div class="flex items-center gap-1 font-semibold">
          <LogoLuminescentFull size={20} />
        </div>
      </a>
      <div q:slot="mobile" class="flex justify-evenly">
        <SocialButtons />
      </div>
    </Nav>
  );
});

export const SocialButtons = component$(({ large }: { large?: boolean }) => {
  return (
    <>
      <a
        href="https://github.com/bwmp"
        title="GitHub"
        class={{
          'lum-btn lum-bg-transparent': true,
          'rounded-lum-4 p-3': large,
          'rounded-lum-2 p-2': !large,
        }}
      >
        <Github size={large ? 32 : 20} />
      </a>
      <a
        href="/discord"
        title="Discord"
        class={{
          'lum-btn lum-bg-transparent': true,
          'rounded-lum-4 p-3': large,
          'rounded-lum-2 p-2': !large,
        }}
      >
        <LogoDiscord size={large ? 32 : 20} />
      </a>
    </>
  );
});
