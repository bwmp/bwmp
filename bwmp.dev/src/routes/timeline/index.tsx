import { component$ } from '@builder.io/qwik';
import { type DocumentHead } from '@builder.io/qwik-city';
import { Tag } from '~/components/projects/Tag';
import { Timeline } from '~/components/projects/Timeline';
import { techIconSrc } from '~/data/techIcons';
import { datedProjects } from '~/data/projects';

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
  });

const calculateDuration = (start: string, end: string | null) => {
  const startDate = new Date(start);
  const endDate = end ? new Date(end) : new Date();
  const months = Math.max(
    0,
    (endDate.getFullYear() - startDate.getFullYear()) * 12 +
      (endDate.getMonth() - startDate.getMonth()),
  );
  const years = Math.floor(months / 12);
  const remMonths = months % 12;

  if (years > 0 && remMonths > 0) {
    return `${years} year${years > 1 ? 's' : ''}, ${remMonths} month${remMonths > 1 ? 's' : ''}`;
  }
  if (years > 0) return `${years} year${years > 1 ? 's' : ''}`;
  if (remMonths > 0) return `${remMonths} month${remMonths > 1 ? 's' : ''}`;
  return 'Less than a month';
};

// datedProjects is oldest-first; the written history reads best newest-first.
const sortedTimeline = [...datedProjects].reverse();

export default component$(() => {
  return (
    <div class="mx-auto max-w-6xl px-4">
      <header class="py-12 sm:py-16">
        <h1 class="text-3xl font-bold text-gray-100 sm:text-4xl">Timeline</h1>
        <p class="mt-4 max-w-2xl text-lg leading-relaxed text-gray-400">
          The projects and roles I've worked on, when each started, and which
          ones I'm still on.
        </p>
      </header>

      <section
        aria-labelledby="overview-title"
        class="border-t border-gray-800 py-16"
      >
        <h2
          id="overview-title"
          class="mb-8 text-2xl font-bold text-gray-100 sm:text-3xl"
        >
          Overview
        </h2>
        <Timeline />
      </section>

      <section
        aria-labelledby="history-title"
        class="border-t border-gray-800 py-16"
      >
        <h2
          id="history-title"
          class="mb-8 text-2xl font-bold text-gray-100 sm:text-3xl"
        >
          History
        </h2>
        <div class="space-y-4">
          {sortedTimeline.map((item) => (
            <article
              key={item.id}
              class="rounded-lum-2 lum-bg-gray-800/30 p-6"
            >
              <div class="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h3 class="text-lg font-semibold text-gray-100">
                  {item.title}
                </h3>
                <p class="text-sm text-gray-400">
                  {formatDate(item.start)} –{' '}
                  {item.end ? formatDate(item.end) : 'Present'} ·{' '}
                  {calculateDuration(item.start, item.end)}
                </p>
              </div>

              <p class="mt-1 text-sm font-medium text-blue-300">{item.role}</p>

              <p class="mt-4 leading-relaxed text-gray-400">
                {item.description}
              </p>

              {item.tech && item.tech.length > 0 && (
                <div class="mt-4 flex flex-wrap gap-1.5">
                  {item.tech.map((tech) => (
                    <Tag key={tech} name={tech} iconSrc={techIconSrc[tech]} />
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
      </section>
    </div>
  );
});

export const head: DocumentHead = {
  title: 'Timeline - bwmp.dev',
  meta: [
    {
      name: 'description',
      content:
        'A detailed timeline of my projects, roles, and development journey from start to present.',
    },
  ],
};
