import { component$, useStore, useVisibleTask$ } from '@builder.io/qwik';
import { Github, GitFork, Star, Calendar } from 'lucide-icons-qwik';

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

interface GitHubRepo {
  name: string;
  description: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
  html_url: string;
  updated_at: string;
}

export default component$(() => {
  const store = useStore<{
    user: GitHubUser | null;
    repos: GitHubRepo[];
    loading: boolean;
    error: string | null;
  }>({
    user: null,
    repos: [],
    loading: true,
    error: null,
  });

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    const fetchGitHubData = async () => {
      try {
        const userResponse = await fetch('https://api.github.com/users/bwmp');
        if (!userResponse.ok) throw new Error('Failed to fetch user data');
        const userData = await userResponse.json();

        const reposResponse = await fetch(
          'https://api.github.com/users/bwmp/repos?sort=updated&per_page=7',
        );
        if (!reposResponse.ok) throw new Error('Failed to fetch repositories');
        const reposData = await reposResponse.json();

        store.user = userData;
        console.log(reposData);
        store.repos = reposData
          .filter((repo: GitHubRepo) => repo.name !== 'bwmp')
          .slice(0, 6);
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
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} class="h-32 rounded bg-gray-700"></div>
          ))}
        </div>
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div class="space-y-6">
      {store.user && (
        <div class="rounded-lum-2 lum-bg-gray-900/60 border border-gray-700/50 p-6 backdrop-blur-sm">
          <div class="mb-4 flex items-center gap-4">
            <Github class="h-6 w-6 text-gray-300" />
            <h3 class="text-xl font-bold text-gray-100">GitHub Activity</h3>
          </div>

          <div class="grid grid-cols-2 gap-4 text-center md:grid-cols-4">
            <div class="space-y-2">
              <p class="text-2xl font-bold text-blue-400">
                {store.user.public_repos}
              </p>
              <p class="text-sm text-gray-400">Repositories</p>
            </div>
            <div class="space-y-2">
              <p class="text-2xl font-bold text-green-400">
                {store.user.followers}
              </p>
              <p class="text-sm text-gray-400">Followers</p>
            </div>
            <div class="space-y-2">
              <p class="text-2xl font-bold text-purple-400">
                {store.user.following}
              </p>
              <p class="text-sm text-gray-400">Following</p>
            </div>
            <div class="space-y-2">
              <p class="text-2xl font-bold text-yellow-400">
                {Math.floor(
                  (Date.now() - new Date(store.user.created_at).getTime()) /
                    (1000 * 60 * 60 * 24 * 365),
                )}
                y
              </p>
              <p class="text-sm text-gray-400">On GitHub</p>
            </div>
          </div>
        </div>
      )}

      <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
        {store.repos.map((repo) => (
          <a
            key={repo.name}
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            class="rounded-lum-2 lum-bg-gray-900/60 hover:lum-bg-gray-800/60 block border border-gray-700/50 p-4 backdrop-blur-sm transition-all duration-200 hover:scale-[1.02] hover:border-gray-600/50"
          >
            <div class="mb-3 flex items-start justify-between">
              <h4 class="truncate font-semibold text-gray-100">{repo.name}</h4>
              <div class="ml-2 flex flex-shrink-0 items-center gap-2 text-sm text-gray-400">
                <div class="flex items-center gap-1">
                  <Star class="h-3 w-3" />
                  <span>{repo.stargazers_count}</span>
                </div>
                <div class="flex items-center gap-1">
                  <GitFork class="h-3 w-3" />
                  <span>{repo.forks_count}</span>
                </div>
              </div>
            </div>

            {repo.description && (
              <p class="mb-3 line-clamp-2 text-sm text-gray-300">
                {repo.description}
              </p>
            )}

            <div class="flex items-center justify-between text-xs text-gray-400">
              {repo.language && (
                <span class="flex items-center gap-1">
                  <div class="h-2 w-2 rounded-full bg-blue-400"></div>
                  {repo.language}
                </span>
              )}
              <span class="flex items-center gap-1">
                <Calendar class="h-3 w-3" />
                {formatDate(repo.updated_at)}
              </span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
});
