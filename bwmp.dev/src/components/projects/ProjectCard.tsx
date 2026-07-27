import { component$, JSX } from '@builder.io/qwik';
import { Tag } from './Tag';
import { techIconSrc } from '~/data/techIcons';
import { type Project } from '~/data/projects';
import { LogoBirdflop, LogoDiscord } from '@luminescent/ui-qwik';
import { Github, Globe } from 'lucide-icons-qwik';

import AetherSMPImg from '~/components/images/AetherSMP.png?jsx';
import TwinkForSaleImg from '~/components/images/twinkforsale.png?jsx';
import LuminImg from '~/components/images/Lumin.png?jsx';
// Resolves to a URL string, not a component — render it through <img>.
import serversPulseUrl from '~/components/images/serverspulse.svg?url';

type ProjectCardProps = {
  project: Project;
  featured?: boolean;
};

const linkIcons: Record<string, JSX.Element> = {
  website: <Globe class="h-4 w-4" />,
  github: <Github class="h-4 w-4" />,
  discord: <LogoDiscord class="h-4 w-4" />,
  twitter: (
    <img
      // eslint-disable-next-line qwik/jsx-img
      src="/icons/logo.svg"
      alt=""
      width="16"
      height="16"
      class="h-4 w-4 object-contain"
    />
  ),
};

// Marks are decorative: the project title always sits next to them.
const projectMarks: Record<string, (cls: string) => JSX.Element> = {
  AetherSMP: (cls) => <AetherSMPImg class={cls} alt="" />,
  TwinkForSale: (cls) => <TwinkForSaleImg class={cls} alt="" />,
  Lumin: (cls) => <LuminImg class={cls} alt="" />,
  ServersPulse: (cls) => (
    <img
      src={serversPulseUrl}
      alt=""
      width="128"
      height="128"
      class={cls}
      loading="lazy"
    />
  ),
  Birdflop: (cls) => (
    <LogoBirdflop class={cls} fillGradient={['#54daf4', '#545eb6']} />
  ),
};

export default component$<ProjectCardProps>(({ project, featured }) => {
  const renderMark = (cls: string) => {
    const mark =
      project.imageComponentKey && projectMarks[project.imageComponentKey];
    if (mark) return mark(cls);
    if (project.imageUrl) {
      return (
        <img
          src={project.imageUrl}
          alt=""
          width="128"
          height="128"
          class={cls}
          loading="lazy"
        />
      );
    }
    return null;
  };

  const links = project.links ?? [];
  const linkRow = links.length > 0 && (
    <div class="mt-auto flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-gray-700/40 pt-5">
      {links.map((link) => (
        <a
          key={link.name}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-2 text-sm font-medium text-gray-300 transition-colors hover:text-white focus-visible:text-white"
        >
          {link.icon && linkIcons[link.icon]}
          {link.name}
        </a>
      ))}
    </div>
  );

  const techRow = project.tech && project.tech.length > 0 && (
    <div class="mt-4 mb-5 flex flex-wrap items-center gap-1.5">
      {project.tech.map((t) => (
        <Tag key={t} name={t} iconSrc={techIconSrc[t]} />
      ))}
    </div>
  );

  if (featured) {
    return (
      <article class="lum-card lum-bg-gray-800/30 h-full overflow-hidden !gap-0 !p-0">
        <div class="flex h-full flex-col sm:flex-row">
          <div class="flex items-center justify-center bg-gray-950/40 p-6 sm:w-44 sm:shrink-0">
            {renderMark('h-24 w-24 object-contain sm:h-28 sm:w-28')}
          </div>
          <div class="flex flex-1 flex-col p-6">
            <h3 class="text-xl font-semibold text-gray-100">{project.title}</h3>
            <p class="mt-3 text-sm leading-relaxed text-gray-400">
              {project.description}
            </p>
            {techRow}
            {linkRow}
          </div>
        </div>
      </article>
    );
  }

  return (
    <article class="lum-card lum-bg-gray-800/30 h-full !gap-0 !p-5">
      <div class="flex items-start gap-3">
        <div class="rounded-lum-4 flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden bg-gray-950/40 p-1.5">
          {renderMark('h-full w-full object-contain')}
        </div>
        <h3 class="mt-1.5 text-base leading-snug font-semibold text-gray-100">
          {project.title}
        </h3>
      </div>
      <p class="mt-4 text-sm leading-relaxed text-gray-400">
        {project.description}
      </p>
      {techRow}
      {linkRow}
    </article>
  );
});
