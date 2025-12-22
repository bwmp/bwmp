import { component$ } from '@builder.io/qwik';
import { type DocumentHead } from '@builder.io/qwik-city';
import { Timeline } from '~/components/projects/Timeline';
import timelineData from '~/data/timeline.json';

export default component$(() => {
  // Sort timeline by start date (most recent first)
  const sortedTimeline = [...timelineData].sort((a, b) => {
    const dateA = new Date(a.start).getTime();
    const dateB = new Date(b.start).getTime();
    return dateB - dateA;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const calculateDuration = (start: string, end: string | null) => {
    const startDate = new Date(start);
    const endDate = end ? new Date(end) : new Date();
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const years = Math.floor(diffDays / 365);
    const months = Math.floor((diffDays % 365) / 30);

    if (years > 0 && months > 0) {
      return `${years} year${years > 1 ? 's' : ''}, ${months} month${months > 1 ? 's' : ''}`;
    } else if (years > 0) {
      return `${years} year${years > 1 ? 's' : ''}`;
    } else if (months > 0) {
      return `${months} month${months > 1 ? 's' : ''}`;
    } else {
      return 'Less than a month';
    }
  };

  const getStatusColor = (end: string | null) => {
    return end
      ? 'bg-gray-500/20 text-gray-400'
      : 'bg-green-500/20 text-green-400';
  };

  const getStatusText = (end: string | null) => {
    return end ? 'Completed' : 'Active';
  };

  return (
    <div class="mx-auto max-w-7xl px-4 py-24">
      <div class="mb-12">
        <h1 class="mb-4 text-4xl font-bold text-gray-100 sm:text-5xl">
          My Journey
        </h1>
        <p class="max-w-3xl text-lg leading-relaxed text-gray-400">
          A detailed timeline of my projects, roles, and learning experiences.
          Each entry represents a significant milestone in my development
          journey.
        </p>
      </div>

      <div class="mb-12 flex flex-wrap gap-4">
        <div class="rounded-lg bg-gray-800/50 px-4 py-2">
          <span class="text-sm font-medium text-gray-300">
            {timelineData.length} Total Entries
          </span>
        </div>
        <div class="rounded-lg bg-green-500/20 px-4 py-2">
          <span class="text-sm font-medium text-green-300">
            {timelineData.filter((item) => !item.end).length} Active Projects
          </span>
        </div>
        <div class="rounded-lg bg-blue-500/20 px-4 py-2">
          <span class="text-sm font-medium text-blue-300">
            {timelineData.filter((item) => item.end).length} Completed Projects
          </span>
        </div>
      </div>

      <section class="mb-16">
        <h2 class="mb-8 text-2xl font-bold text-gray-100 sm:text-3xl">
          Interactive Timeline
        </h2>
        <div class="rounded-lg border border-gray-700/50 bg-gray-800/30 p-6">
          <Timeline />
        </div>
      </section>

      <section class="mb-16">
        <h2 class="mb-8 text-2xl font-bold text-gray-100 sm:text-3xl">
          Detailed History
        </h2>
        <div class="space-y-8">
          {sortedTimeline.map((item) => (
            <div
              key={item.id}
              class="rounded-lg border border-gray-700/50 bg-gray-800/30 p-6"
            >
              <div class="mb-4 flex flex-wrap items-start justify-between gap-4">
                <div class="flex-1">
                  <h3 class="mb-2 text-xl font-bold text-gray-100">
                    {item.project}
                  </h3>
                  <div class="mb-3 flex flex-wrap gap-2">
                    <span
                      class={`rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(item.end)}`}
                    >
                      {getStatusText(item.end)}
                    </span>
                    <span class="rounded-full bg-blue-500/20 px-3 py-1 text-xs font-medium text-blue-300">
                      {item.role}
                    </span>
                  </div>
                </div>
                <div class="text-right text-sm text-gray-400">
                  <div class="font-medium text-gray-300">
                    {formatDate(item.start)} -{' '}
                    {item.end ? formatDate(item.end) : 'Present'}
                  </div>
                  <div class="text-xs">
                    Duration: {calculateDuration(item.start, item.end)}
                  </div>
                </div>
              </div>

              <p class="mb-4 leading-relaxed text-gray-300">
                {item.description}
              </p>

              {item.tech && item.tech.length > 0 && (
                <div class="mb-4">
                  <h4 class="mb-2 text-sm font-semibold text-gray-200">
                    Technologies Used:
                  </h4>
                  <div class="flex flex-wrap gap-2">
                    {item.tech.map((tech) => (
                      <span
                        key={tech}
                        class="rounded-md bg-purple-500/20 px-2 py-1 text-xs text-purple-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div class="border-t border-gray-600/30 pt-4">
                <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <div>
                    <span class="text-xs font-medium text-gray-400">
                      Start Date
                    </span>
                    <p class="text-sm text-gray-200">
                      {formatDate(item.start)}
                    </p>
                  </div>
                  {item.end && (
                    <div>
                      <span class="text-xs font-medium text-gray-400">
                        End Date
                      </span>
                      <p class="text-sm text-gray-200">
                        {formatDate(item.end)}
                      </p>
                    </div>
                  )}
                  <div>
                    <span class="text-xs font-medium text-gray-400">
                      Duration
                    </span>
                    <p class="text-sm text-gray-200">
                      {calculateDuration(item.start, item.end)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section class="mb-16">
        <h2 class="mb-8 text-2xl font-bold text-gray-100 sm:text-3xl">
          Timeline Statistics
        </h2>
        <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div class="rounded-lg border border-gray-700/50 bg-gray-800/50 p-6 text-center">
            <div class="mb-2 text-2xl font-bold text-blue-400">
              {new Date().getFullYear() -
                new Date(
                  Math.min(
                    ...timelineData.map((item) =>
                      new Date(item.start).getTime(),
                    ),
                  ),
                ).getFullYear()}
            </div>
            <div class="text-sm text-gray-400">Years of Experience</div>
          </div>
          <div class="rounded-lg border border-gray-700/50 bg-gray-800/50 p-6 text-center">
            <div class="mb-2 text-2xl font-bold text-green-400">
              {timelineData.filter((item) => !item.end).length}
            </div>
            <div class="text-sm text-gray-400">Active Projects</div>
          </div>
          <div class="rounded-lg border border-gray-700/50 bg-gray-800/50 p-6 text-center">
            <div class="mb-2 text-2xl font-bold text-purple-400">
              {
                [...new Set(timelineData.flatMap((item) => item.tech || []))]
                  .length
              }
            </div>
            <div class="text-sm text-gray-400">Technologies Used</div>
          </div>
          <div class="rounded-lg border border-gray-700/50 bg-gray-800/50 p-6 text-center">
            <div class="mb-2 text-2xl font-bold text-orange-400">
              {timelineData.filter((item) => item.end).length}
            </div>
            <div class="text-sm text-gray-400">Completed Projects</div>
          </div>
        </div>
      </section>

      <section class="mb-16">
        <h2 class="mb-8 text-2xl font-bold text-gray-100 sm:text-3xl">
          Key Milestones
        </h2>
        <div class="space-y-4">
          <div class="flex items-center gap-4 rounded-lg border border-gray-700/50 bg-gray-800/30 p-4">
            <div class="text-2xl">🚀</div>
            <div>
              <h4 class="font-semibold text-gray-100">First Project</h4>
              <p class="text-sm text-gray-400">
                Started with{' '}
                {
                  timelineData.sort(
                    (a, b) =>
                      new Date(a.start).getTime() - new Date(b.start).getTime(),
                  )[0]?.project
                }{' '}
                in{' '}
                {new Date(
                  timelineData.sort(
                    (a, b) =>
                      new Date(a.start).getTime() - new Date(b.start).getTime(),
                  )[0]?.start,
                ).getFullYear()}
              </p>
            </div>
          </div>
          <div class="flex items-center gap-4 rounded-lg border border-gray-700/50 bg-gray-800/30 p-4">
            <div class="text-2xl">⭐</div>
            <div>
              <h4 class="font-semibold text-gray-100">
                Longest Running Project
              </h4>
              <p class="text-sm text-gray-400">
                {
                  timelineData
                    .map((item) => ({
                      ...item,
                      duration: calculateDuration(item.start, item.end),
                    }))
                    .sort((a, b) => {
                      // Sort by duration length (rough approximation)
                      const getDurationScore = (dur: string) => {
                        if (dur.includes('year')) return parseInt(dur) * 12;
                        if (dur.includes('month')) return parseInt(dur);
                        return 0;
                      };
                      return (
                        getDurationScore(b.duration) -
                        getDurationScore(a.duration)
                      );
                    })[0]?.project
                }{' '}
                -{' '}
                {
                  timelineData
                    .map((item) => ({
                      ...item,
                      duration: calculateDuration(item.start, item.end),
                    }))
                    .sort((a, b) => {
                      const getDurationScore = (dur: string) => {
                        if (dur.includes('year')) return parseInt(dur) * 12;
                        if (dur.includes('month')) return parseInt(dur);
                        return 0;
                      };
                      return (
                        getDurationScore(b.duration) -
                        getDurationScore(a.duration)
                      );
                    })[0]?.duration
                }
              </p>
            </div>
          </div>
          <div class="flex items-center gap-4 rounded-lg border border-gray-700/50 bg-gray-800/30 p-4">
            <div class="text-2xl">🎯</div>
            <div>
              <h4 class="font-semibold text-gray-100">Current Focus</h4>
              <p class="text-sm text-gray-400">
                Working on {timelineData.filter((item) => !item.end).length}{' '}
                active projects simultaneously
              </p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div class="rounded-lg border border-gray-700/50 bg-gray-800/50 p-8 text-center">
          <h3 class="mb-4 text-xl font-semibold text-gray-100">
            Interested in my work?
          </h3>
          <p class="mb-6 text-gray-400">
            Check out my projects in detail or learn more about my skills and
            expertise.
          </p>
          <div class="flex flex-wrap justify-center gap-4">
            <a
              href="/projects"
              class="rounded-lg bg-blue-600/50 px-6 py-3 font-medium text-gray-100 transition-all hover:bg-blue-500/50"
            >
              View All Projects
            </a>
            <a
              href="/skills"
              class="rounded-lg bg-purple-600/50 px-6 py-3 font-medium text-gray-100 transition-all hover:bg-purple-500/50"
            >
              Skills & Technologies
            </a>
            <a
              href="/"
              class="rounded-lg bg-gray-700/50 px-6 py-3 font-medium text-gray-100 transition-all hover:bg-gray-600/50"
            >
              Back to Homepage
            </a>
          </div>
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
