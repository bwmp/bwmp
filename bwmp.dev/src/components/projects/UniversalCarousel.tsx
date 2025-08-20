import {
  component$,
  useSignal,
  useVisibleTask$,
  $,
  useStylesScoped$,
} from '@builder.io/qwik';
import { ChevronLeft, ChevronRight } from 'lucide-icons-qwik';
import ModrinthCard, { type ModrinthProject } from './ModrinthCard';
import ProjectCard, { type Project } from './ProjectCard';

const RESPONSIVE_BREAKPOINT = 640;
const DEFAULT_ITEM_WIDTH = 320;
const DEFAULT_GAP = 24;
const MOBILE_ITEM_WIDTH = 280;
const MOBILE_GAP = 16;
const SCROLL_TIMEOUT = 300;
const MIN_ITEMS_FOR_INFINITE = 3;

type BaseCarouselProps = {
  itemWidth?: number;
  gap?: number;
};

type ModrinthCarouselProps = BaseCarouselProps & {
  items: ModrinthProject[];
  type: 'modrinth';
};

type PortfolioCarouselProps = BaseCarouselProps & {
  items: Project[];
  type: 'portfolio';
};

type UniversalCarouselProps = ModrinthCarouselProps | PortfolioCarouselProps;

const isMobile = () => window.innerWidth < RESPONSIVE_BREAKPOINT;

const getResponsiveDimensions = (itemWidth: number, gap: number) => {
  const mobile = isMobile();
  return {
    itemWidth: mobile ? MOBILE_ITEM_WIDTH : itemWidth,
    gap: mobile ? MOBILE_GAP : gap,
  };
};

const createInfiniteItems = (
  items: (ModrinthProject | Project)[],
): (ModrinthProject | Project)[] => {
  const count = items.length;
  if (count === 0) return [];
  if (count === 1) return items;
  if (count === 2) return [...items, ...items];
  if (count <= 4) return [...items, ...items];
  return [...items, ...items, ...items];
};

export default component$((props: UniversalCarouselProps) => {
  const {
    items,
    itemWidth = DEFAULT_ITEM_WIDTH,
    gap = DEFAULT_GAP,
    type,
  } = props;
  const scroller = useSignal<HTMLDivElement>();
  if (!items?.length) {
    return null;
  }

  const itemCount = items.length;
  const infiniteItems = createInfiniteItems(items);
  const useInfiniteScroll = itemCount >= MIN_ITEMS_FOR_INFINITE;
  const shouldShowNavigation = itemCount > 1;
  const shouldUseMask = itemCount > 3;

  const scroll = $((direction: number) => {
    const el = scroller.value;
    if (!el) return;

    const { itemWidth: responsiveItemWidth, gap: responsiveGap } =
      getResponsiveDimensions(itemWidth, gap);
    const scrollAmount = direction * (responsiveItemWidth + responsiveGap);

    el.scrollBy({
      left: scrollAmount,
      behavior: 'smooth',
    });

    if (!useInfiniteScroll) return;

    setTimeout(() => {
      const maxScroll = el.scrollWidth;
      const sectionWidth = maxScroll / 3;

      if (el.scrollLeft >= sectionWidth * 2) {
        el.style.scrollBehavior = 'auto';
        el.scrollLeft = el.scrollLeft - sectionWidth;
        el.style.scrollBehavior = 'smooth';
      } else if (el.scrollLeft < sectionWidth) {
        el.style.scrollBehavior = 'auto';
        el.scrollLeft = el.scrollLeft + sectionWidth;
        el.style.scrollBehavior = 'smooth';
      }
    }, SCROLL_TIMEOUT);
  });

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    const el = scroller.value;
    if (!el || !useInfiniteScroll) return;

    requestAnimationFrame(() => {
      const sectionWidth = el.scrollWidth / 3;
      el.style.scrollBehavior = 'auto';
      el.scrollLeft = sectionWidth;
      el.style.scrollBehavior = '';
    });
  });

  useStylesScoped$(`
    /* Hide scrollbars */
    .hide-scrollbar::-webkit-scrollbar {
      display: none;
    }
    .hide-scrollbar {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }

    /* Gradient masks for fade effect */
    .gradient-mask-x {
      mask: linear-gradient(
        to right,
        transparent 0px,
        black 30px,
        black calc(100% - 30px),
        transparent 100%
      );
      -webkit-mask: linear-gradient(
        to right,
        transparent 0px,
        black 30px,
        black calc(100% - 30px),
        transparent 100%
      );
    }

    @media (min-width: 640px) {
      .gradient-mask-x {
        mask: linear-gradient(
          to right,
          transparent 0px,
          black 60px,
          black calc(100% - 60px),
          transparent 100%
        );
        -webkit-mask: linear-gradient(
          to right,
          transparent 0px,
          black 60px,
          black calc(100% - 60px),
          transparent 100%
        );
      }
    }
  `);

  const navigationButtonClass =
    'lum-btn rounded-lum lum-bg-gray-900/80 hover:lum-bg-gray-800/90 h-140 w-10 flex-shrink-0 p-2 text-white shadow-lg backdrop-blur-sm transition-all duration-200 focus:outline-none sm:w-auto sm:p-3';

  return (
    <div class="flex items-center gap-2 sm:gap-4">
      {shouldShowNavigation && (
        <button
          type="button"
          aria-label="Scroll left"
          onClick$={() => scroll(-1)}
          class={navigationButtonClass}
        >
          <ChevronLeft class="h-4 w-4 sm:h-6 sm:w-6" />
        </button>
      )}

      <div
        class={[
          'relative flex-1 overflow-hidden',
          itemCount === 1 ? 'flex justify-center' : '',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <div class="flex w-full justify-center overflow-hidden">
          <div
            ref={scroller}
            class={[
              'hide-scrollbar flex gap-2 overflow-x-auto pb-2 sm:pb-3',
              'touch-pan-x snap-x snap-mandatory scroll-smooth',
              'scroll-px-4',
              itemCount === 1 ? 'justify-center' : '',
              shouldUseMask ? 'gradient-mask-x' : '',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            {infiniteItems.map((item, index) => (
              <div
                key={`${item.id}-${index}`}
                class="h-140 w-70 min-w-[280px] flex-shrink-0 snap-center sm:w-80"
              >
                {type === 'modrinth' ? (
                  <ModrinthCard project={item as ModrinthProject} />
                ) : (
                  <ProjectCard project={item as Project} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {shouldShowNavigation && (
        <button
          type="button"
          aria-label="Scroll right"
          onClick$={() => scroll(1)}
          class={navigationButtonClass}
        >
          <ChevronRight class="h-4 w-4 sm:h-6 sm:w-6" />
        </button>
      )}
    </div>
  );
});
