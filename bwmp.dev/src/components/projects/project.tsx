import { component$, JSX, useSignal, $ } from '@builder.io/qwik';
import { Tag } from './Tag';
import { LogoDiscord } from '@luminescent/ui-qwik';
import { Github, Globe } from 'lucide-icons-qwik';

import AetherSMPImg from '~/components/images/AetherSMP.png?jsx';
import TwinkForSaleImg from '~/components/images/twinkforsale.png?jsx';
import LuminImg from '~/components/images/Lumin.png?jsx';

interface ProjectLink {
  name: string;
  url: string;
  icon?: string;
}

interface ProjectProps {
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

export default component$<ProjectProps>((props) => {
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
  };

  const renderImage = () => {
    if (props.imageComponentKey && imageRegistry[props.imageComponentKey]) {
      const Img = imageRegistry[props.imageComponentKey];
      return (
        <Img
          alt={props.imageAlt ?? props.title}
          width={props.imageWidth ?? 200}
          height={props.imageHeight ?? 200}
          class="mx-auto mb-4 h-auto max-w-full sm:mb-5"
        />
      );
    } else if (props.imageUrl) {
      return (
        <img
          src={props.imageUrl}
          alt={props.imageAlt ?? props.title}
          width={props.imageWidth ?? 200}
          height={props.imageHeight ?? 200}
          class="mx-auto mb-4 h-auto max-w-full sm:mb-5"
        />
      );
    }
    return null;
  };

  return (
    <div
      class="lum-card lum-bg-gray-800/30 group relative w-full cursor-pointer overflow-hidden sm:max-w-76 sm:min-w-76 sm:cursor-default"
      onClick$={handleClick}
    >
      {renderImage()}
      <h3 class="mb-3 text-lg font-bold text-gray-100 sm:text-xl">
        {props.title}
      </h3>
      {props.tech && props.tech.length > 0 && (
        <div class="mb-3 flex flex-wrap items-center gap-1.5 sm:gap-2">
          {props.tech.map((t) => (
            <Tag key={t} name={t} iconSrc={techIconSrc[t]} />
          ))}
        </div>
      )}
      <p class="mb-4 text-sm leading-relaxed text-gray-400 sm:mb-0">
        {props.description}
      </p>
      {(() => {
        const links = props.links || [];

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
