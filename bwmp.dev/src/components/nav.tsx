import { component$ } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';
import { LogoDiscord, LogoLuminescentFull, Nav } from '@luminescent/ui-qwik';
import { Github } from 'lucide-icons-qwik';

export default component$(() => {
  return (
    <Nav floating fixed colorClass="lum-bg-lum-input-bg/50 !text-lum-text">
      <Link
        q:slot="start"
        href="/"
        class="lum-btn lum-bg-transparent rounded-lum-2 gap-2 p-0 px-2 font-bold"
      >
        bwmp
      </Link>

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
