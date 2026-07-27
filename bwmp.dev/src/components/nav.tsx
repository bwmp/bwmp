import { component$, useSignal } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';
import { LogoDiscord, Nav } from '@luminescent/ui-qwik';
import { ChevronDown, Github } from 'lucide-icons-qwik';

const primaryLinks = [
  { href: '/projects', label: 'Projects' },
  { href: '/skills', label: 'Skills' },
  { href: '/timeline', label: 'Timeline' },
];

const secondaryLinks = [
  { href: '/wishlist', label: 'Wishlist' },
  { href: '/twitter', label: 'Twitter' },
  { href: '/reactions', label: 'Pure Chaos' },
];

const linkClass =
  'lum-btn lum-bg-transparent hover:lum-bg-gray-700/50 rounded-lum-2 px-3 py-2 text-sm font-medium transition-all';

export default component$(() => {
  const moreOpen = useSignal(false);

  return (
    <Nav floating fixed colorClass="lum-bg-lum-input-bg/50 !text-lum-text">
      <Link
        q:slot="start"
        href="/"
        class="lum-btn lum-bg-transparent rounded-lum-2 gap-2 p-0 px-2 font-bold"
      >
        bwmp
      </Link>

      <div q:slot="center" class="hidden items-center gap-1 sm:flex">
        {primaryLinks.map((link) => (
          <Link key={link.href} href={link.href} class={linkClass}>
            {link.label}
          </Link>
        ))}
        <a href="mailto:contact@bwmp.dev" class={`${linkClass} hidden md:flex`}>
          Contact
        </a>

        <div
          class="relative hidden md:block"
          onFocusOut$={(event, el) => {
            if (!el.contains(event.relatedTarget as Node | null)) {
              moreOpen.value = false;
            }
          }}
        >
          <button
            type="button"
            aria-expanded={moreOpen.value}
            class={linkClass}
            onClick$={() => (moreOpen.value = !moreOpen.value)}
          >
            More
            <ChevronDown
              size={14}
              class={{
                'motion-safe:transition-transform': true,
                'rotate-180': moreOpen.value,
              }}
            />
          </button>
          {moreOpen.value && (
            <div class="lum-card lum-bg-lum-card-bg rounded-lum-2 absolute top-full right-0 mt-2 min-w-40 !gap-1 !p-2">
              {secondaryLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  class={linkClass}
                  onClick$={() => (moreOpen.value = false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      <div q:slot="end" class="hidden gap-2 sm:flex">
        <SocialButtons />
      </div>

      <div q:slot="mobile" class="flex">
        <div class="flex w-full flex-col gap-2">
          <div class="flex flex-wrap justify-center gap-2">
            {primaryLinks.map((link) => (
              <Link key={link.href} href={link.href} class={linkClass}>
                {link.label}
              </Link>
            ))}
            <a href="mailto:contact@bwmp.dev" class={linkClass}>
              Contact
            </a>
          </div>
          <div class="flex flex-wrap justify-center gap-2">
            {secondaryLinks.map((link) => (
              <Link key={link.href} href={link.href} class={linkClass}>
                {link.label}
              </Link>
            ))}
          </div>
          <SocialButtons />
        </div>
      </div>
    </Nav>
  );
});

export const SocialButtons = component$(() => {
  return (
    <div class="flex justify-evenly gap-2">
      <a
        href="https://github.com/bwmp"
        title="GitHub"
        aria-label="GitHub"
        class="lum-btn lum-bg-transparent rounded-lum-2 p-2"
      >
        <Github size={20} />
      </a>
      <a
        href="/discord"
        title="Discord"
        aria-label="Discord"
        class="lum-btn lum-bg-transparent rounded-lum-2 p-2"
      >
        <LogoDiscord size={20} />
      </a>
    </div>
  );
});
