import { component$, useStore, useVisibleTask$ } from '@builder.io/qwik';
import { Github, X } from 'lucide-icons-qwik';

interface GitHubUser {
  name: string;
  bio: string;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
  location: string;
  company: string;
  blog: string;
  avatar_url: string;
  html_url: string;
}

interface Contribution {
  date: string;
  count: number;
}

export default component$(() => {
  const store = useStore<{
    user: GitHubUser | null;
    contributions: Contribution[];
    loading: boolean;
    error: string | null;
    selectedDay: Contribution | null;
  }>({
    user: null,
    contributions: [],
    loading: true,
    error: null,
    selectedDay: null,
  });

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    const fetchGitHubData = async () => {
      try {
        const response = await fetch('https://api.bwmp.dev/api/github');
        if (!response.ok) throw new Error('Failed to fetch GitHub data');

        const result = await response.json();

        const apiUser = result.data.user;
        store.user = {
          name: apiUser.name,
          bio: apiUser.bio,
          public_repos: apiUser.public_repos || apiUser.publicRepos,
          followers: apiUser.followers,
          following: apiUser.following,
          created_at: apiUser.created_at || apiUser.createdAt,
          location: apiUser.location,
          company: apiUser.company,
          blog: apiUser.blog,
          avatar_url: apiUser.avatar_url || apiUser.avatarUrl,
          html_url: apiUser.html_url || apiUser.htmlUrl,
        };

        store.contributions = result.data.contributions || [];

        store.loading = false;
      } catch (error) {
        store.error = error instanceof Error ? error.message : 'Unknown error';
        store.loading = false;
      }
    };

    fetchGitHubData();
  });

  if (store.loading) {
    return (
      <div class="animate-pulse space-y-4">
        <div class="h-4 w-1/4 rounded bg-gray-700"></div>
        <div class="h-32 rounded bg-gray-700"></div>
      </div>
    );
  }

  if (store.error) {
    return (
      <div class="py-8 text-center">
        <p class="text-gray-400">Failed to load GitHub data</p>
      </div>
    );
  }

  const getContributionColor = (count: number) => {
    if (count === 0) return 'bg-gray-800/50';
    if (count <= 2) return 'bg-green-900/50';
    if (count <= 5) return 'bg-green-700/70';
    if (count <= 10) return 'bg-green-500/80';
    return 'bg-green-400';
  };

  const getContributionLevel = (count: number) => {
    if (count === 0) return 'No contributions';
    if (count <= 2) return '1-2 contributions';
    if (count <= 5) return '3-5 contributions';
    if (count <= 10) return '6-10 contributions';
    return '10+ contributions';
  };

  const weeks: Contribution[][] = [];
  for (let i = 0; i < store.contributions.length; i += 7) {
    weeks.push(store.contributions.slice(i, i + 7));
  }

  const totalContributions = store.contributions.reduce(
    (sum, c) => sum + c.count,
    0,
  );

  return (
    <div class="space-y-6">
      {store.user && (
        <div class="rounded-lum-2 lum-bg-gray-800/30 p-6">
          <a
            href={store.user.html_url}
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-2 text-sm font-medium text-gray-300 transition-colors hover:text-white"
          >
            <Github class="h-4 w-4" />
            github.com/bwmp
          </a>

          <div class="mt-6 grid grid-cols-2 gap-6 md:grid-cols-4">
            <div>
              <p class="text-2xl font-semibold text-gray-100">
                {store.user.public_repos}
              </p>
              <p class="mt-1 text-sm text-gray-400">Repositories</p>
            </div>
            <div>
              <p class="text-2xl font-semibold text-gray-100">
                {store.user.followers}
              </p>
              <p class="mt-1 text-sm text-gray-400">Followers</p>
            </div>
            <div>
              <p class="text-2xl font-semibold text-gray-100">
                {store.user.following}
              </p>
              <p class="mt-1 text-sm text-gray-400">Following</p>
            </div>
            <div>
              <p class="text-2xl font-semibold text-gray-100">
                {Math.floor(
                  (Date.now() - new Date(store.user.created_at).getTime()) /
                    (1000 * 60 * 60 * 24 * 365),
                )}
                y
              </p>
              <p class="mt-1 text-sm text-gray-400">On GitHub</p>
            </div>
          </div>
        </div>
      )}

      <div class="rounded-lum-2 lum-bg-gray-800/30 p-6">
        <div class="mb-4 flex flex-wrap items-center justify-between gap-2">
          <h3 class="text-sm font-semibold text-gray-200">Contributions</h3>
          <span class="text-sm text-gray-400">
            {totalContributions} in the last year
          </span>
        </div>

        <div class="overflow-x-auto">
          <div class="inline-flex gap-1">
            {weeks.map((week, weekIdx) => (
              <div key={weekIdx} class="flex flex-col gap-1">
                {week.map((day) => (
                  <button
                    key={day.date}
                    type="button"
                    class={`h-3 w-3 rounded-sm ${getContributionColor(day.count)} cursor-pointer transition-all hover:ring-2 hover:ring-gray-500 ${store.selectedDay?.date === day.date ? 'ring-2 ring-blue-500' : ''}`}
                    title={`${day.date}: ${day.count} contributions - ${getContributionLevel(day.count)}`}
                    onClick$={() => {
                      store.selectedDay = day;
                    }}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        {store.selectedDay && (
          <div class="rounded-lum-2 mt-4 border border-gray-700/50 bg-gray-900/40 p-4">
            <div class="mb-2 flex items-center justify-between">
              <h4 class="text-sm font-semibold text-gray-100">
                {new Date(store.selectedDay.date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </h4>
              <button
                type="button"
                aria-label="Dismiss"
                class="text-gray-400 transition-colors hover:text-gray-200"
                onClick$={() => {
                  store.selectedDay = null;
                }}
              >
                <X class="h-4 w-4" />
              </button>
            </div>
            <div class="flex items-baseline gap-2">
              <p class="text-3xl font-bold text-green-400">
                {store.selectedDay.count}
              </p>
              <p class="text-sm text-gray-400">
                contribution{store.selectedDay.count !== 1 ? 's' : ''}
              </p>
            </div>
            <div class="mt-2 text-xs text-gray-500">
              {getContributionLevel(store.selectedDay.count)}
            </div>
          </div>
        )}

        <div class="mt-4 flex items-center justify-end gap-2 text-xs text-gray-400">
          <span>Less</span>
          <div class="flex gap-1">
            <div class="h-3 w-3 rounded-sm bg-gray-800/50"></div>
            <div class="h-3 w-3 rounded-sm bg-green-900/50"></div>
            <div class="h-3 w-3 rounded-sm bg-green-700/70"></div>
            <div class="h-3 w-3 rounded-sm bg-green-500/80"></div>
            <div class="h-3 w-3 rounded-sm bg-green-400"></div>
          </div>
          <span>More</span>
        </div>
      </div>
    </div>
  );
});
