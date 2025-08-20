import { component$, JSX, useSignal, $ } from '@builder.io/qwik';
import { Tag } from './Tag';
import { LogoBirdflop, LogoDiscord } from '@luminescent/ui-qwik';
import { Github, Globe } from 'lucide-icons-qwik';

import AetherSMPImg from '~/components/images/AetherSMP.png?jsx';
import TwinkForSaleImg from '~/components/images/twinkforsale.png?jsx';
import LuminImg from '~/components/images/Lumin.png?jsx';

interface ProjectLink {
  name: string;
  url: string;
  icon?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  imageComponentKey?: string;
  imageAlt?: string;
  imageWidth?: number;
  imageHeight?: number;
  tech?: string[];
  links?: ProjectLink[];
}

type ProjectCardProps = {
  project: Project;
};

export default component$<ProjectCardProps>(({ project }) => {
  const isActive = useSignal(false);

  const handleClick = $(() => {
    isActive.value = !isActive.value;
  });

  const techIconSrc: Record<string, string> = {
    Qwik: '/qwik.svg',
    Minecraft: '/minecraft.avif',
  };

  const linkIcons: Record<string, JSX.Element> = {
    website: <Globe class="h-5 w-5" />,
    github: <Github class="h-5 w-5" />,
    discord: <LogoDiscord class="h-5 w-5" />,
  };

  const imageRegistry: Record<string, any> = {
    AetherSMP: AetherSMPImg,
    TwinkForSale: TwinkForSaleImg,
    Lumin: LuminImg,
    Birdflop: <LogoBirdflop size={200} class="mx-auto mb-5 w-25 h-25 md:w-50 md:h-50" fillGradient={['#54daf4', '#545eb6']} />,
  };

  const renderImage = () => {
    if (project.imageComponentKey && imageRegistry[project.imageComponentKey]) {
      const entry = imageRegistry[project.imageComponentKey];
      if (typeof entry === 'function') {
        const Img = entry;
        return (
          <Img
            alt={project.imageAlt ?? project.title}
            width={project.imageWidth ?? 200}
            height={project.imageHeight ?? 200}
            class="mx-auto mb-4 h-auto max-w-full sm:mb-5"
          />
        );
      } else if (typeof entry === 'string') {
        return (
          <img
            src={entry}
            alt={project.imageAlt ?? project.title}
            width={project.imageWidth ?? 200}
            height={project.imageHeight ?? 200}
            class="mx-auto mb-4 h-auto max-w-full sm:mb-5"
          />
        );
      }
      return <div class="mx-auto mb-4 flex items-center justify-center sm:mb-5">{entry}</div>;
    } else if (project.imageUrl) {
      return (
        <img
          src={project.imageUrl}
          alt={project.imageAlt ?? project.title}
          width={project.imageWidth ?? 200}
          height={project.imageHeight ?? 200}
          class="mx-auto mb-4 h-auto max-w-full sm:mb-5"
        />
      );
    }
    return null;
  };

  return (
    <div
      class="lum-card lum-bg-gray-800/30 group relative w-full h-full cursor-pointer overflow-hidden sm:max-w-76 sm:min-w-76 sm:cursor-default"
      onClick$={handleClick}
    >
      {renderImage()}
      <h3 class="mb-3 text-lg font-bold text-gray-100 sm:text-xl">
        {project.title}
      </h3>
      {project.tech && project.tech.length > 0 && (
        <div class="mb-3 flex flex-wrap items-center gap-1.5 sm:gap-2">
          {project.tech.map((t) => (
            <Tag key={t} name={t} iconSrc={techIconSrc[t]} />
          ))}
        </div>
      )}
      <p class="mb-4 text-sm leading-relaxed text-gray-400 sm:mb-0">
        {project.description}
      </p>
      {(() => {
        const links = project.links || [];

        return links.length > 0 ? (
          <div
            class={{
              'lum-card lum-bg-gray-900/50 pointer-events-none absolute inset-0 z-10 h-full w-full !gap-2 !border-0 !p-3 !text-white backdrop-blur-xl transition duration-300 ease-out sm:!p-2':
                true,
              'opacity-100': isActive.value,
              'opacity-0 group-hover:opacity-100 hover:duration-75':
                !isActive.value,
            }}
          >
            <div class="flex h-full w-full flex-col gap-2 sm:gap-1">
              {links.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  draggable={false}
                  class="lum-btn rounded-lum-2 lum-bg-transparent hover:lum-bg-orange-900/20 pointer-events-auto flex flex-1 items-center justify-center gap-2 py-3 transition-all sm:flex-col sm:gap-2 sm:py-0"
                >
                  {link.icon && linkIcons[link.icon] && (
                    <span class="inline-block">{linkIcons[link.icon]}</span>
                  )}
                  <span class="text-sm font-medium">{link.name}</span>
                </a>
              ))}
            </div>
          </div>
        ) : null;
      })()}
    </div>
  );
});
