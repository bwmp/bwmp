import { component$, useStore, useVisibleTask$ } from '@builder.io/qwik';
import { type DocumentHead } from '@builder.io/qwik-city';

interface Tweet {
  id: string;
  text: string;
  createdAt: string;
  likeCount: number;
  retweetCount: number;
  replyCount: number;
  inReplyToUserId: string | null;
  mediaUrls: string[] | null;
}

interface TwitterUser {
  id: string;
  username: string;
  name: string;
  description: string;
  profileImageUrl: string;
  followersCount: number;
  followingCount: number;
  tweetCount: number;
}

interface TwitterData {
  user: TwitterUser;
  tweets: Tweet[];
  lastFetched: string;
}

export default component$(() => {
  const store = useStore<{
    data: TwitterData | null;
    loading: boolean;
    error: string | null;
    selectedImage: string | null;
  }>({
    data: null,
    loading: true,
    error: null,
    selectedImage: null,
  });

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    const fetchTwitterData = async () => {
      try {
        const response = await fetch('https://api.bwmp.dev/api/twitter');
        if (!response.ok) throw new Error('Failed to fetch X data');

        const result = await response.json();
        store.data = result.data;
        store.loading = false;
      } catch (error) {
        store.error = error instanceof Error ? error.message : 'Unknown error';
        store.loading = false;
      }
    };

    fetchTwitterData();
  });

  if (store.loading) {
    return (
      <div class="mx-auto max-w-7xl px-4 py-24">
        <div class="animate-pulse space-y-4">
          <div class="flex items-start gap-6">
            <div class="h-24 w-24 rounded-full bg-gray-700"></div>
            <div class="flex-1 space-y-3">
              <div class="h-8 w-1/3 rounded bg-gray-700"></div>
              <div class="h-4 w-1/4 rounded bg-gray-700"></div>
              <div class="h-4 w-2/3 rounded bg-gray-700"></div>
            </div>
          </div>
          <div class="h-32 rounded bg-gray-700"></div>
          <div class="h-32 rounded bg-gray-700"></div>
        </div>
      </div>
    );
  }

  if (store.error || !store.data) {
    return (
      <div class="mx-auto max-w-7xl px-4 py-24">
        <div class="text-center">
          <p class="text-lg text-gray-400">Failed to load X data</p>
        </div>
      </div>
    );
  }

  return (
    <div class="mx-auto max-w-7xl px-4 py-24">
      <>
        {/* User Profile Section */}
        <div class="mb-12">
          <div class="mb-6 flex items-start gap-6">
            <img
              src={store.data.user.profileImageUrl}
              alt={store.data.user.name}
              class="h-24 w-24 rounded-full ring-2 ring-gray-700"
              width={96}
              height={96}
            />
            <div class="flex-1">
              <h1 class="mb-2 text-4xl font-bold text-gray-100 sm:text-5xl">
                {store.data.user.name}
              </h1>
              <p class="mb-3 text-lg text-blue-400">
                @{store.data.user.username}
              </p>
              <p class="max-w-3xl whitespace-pre-line text-lg leading-relaxed text-gray-400">
                {store.data.user.description}
              </p>
            </div>
          </div>

          {/* Stats */}
          <div class="flex flex-wrap gap-6 text-sm">
            <div>
              <span class="font-bold text-gray-100">
                {store.data.user.followersCount}
              </span>{' '}
              <span class="text-gray-400">Followers</span>
            </div>
            <div>
              <span class="font-bold text-gray-100">
                {store.data.user.followingCount}
              </span>{' '}
              <span class="text-gray-400">Following</span>
            </div>
            <div>
              <span class="font-bold text-gray-100">
                {store.data.user.tweetCount}
              </span>{' '}
              <span class="text-gray-400">Tweets</span>
            </div>
          </div>
        </div>

        {/* Tweets Section */}
        <div class="mb-8">
          <h2 class="mb-6 text-3xl font-bold text-gray-100">Recent Tweets</h2>
          <div class="space-y-3">
            {store.data.tweets.map((tweet) => (
              <a
                key={tweet.id}
                href={`https://x.com/${store.data!.user.username}/status/${tweet.id}`}
                target="_blank"
                rel="noopener noreferrer"
                class="block rounded-xl border border-gray-700/50 bg-gray-800/30 p-4 backdrop-blur-sm transition-all hover:border-gray-600 hover:bg-gray-800/50"
              >
                {/* Tweet Header */}
                <div class="mb-3 flex items-start gap-3">
                  <img
                    src={store.data!.user.profileImageUrl}
                    alt={store.data!.user.name}
                    class="h-12 w-12 rounded-full ring-1 ring-gray-700"
                    width={48}
                    height={48}
                  />
                  <div class="flex-1 overflow-hidden">
                    <div class="flex items-center gap-2">
                      <span class="truncate font-bold text-gray-100">
                        {store.data!.user.name}
                      </span>
                      <span class="truncate text-sm text-gray-500">
                        @{store.data!.user.username}
                      </span>
                      <span class="text-gray-600">·</span>
                      <span class="text-sm text-gray-500">
                        {new Date(tweet.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Tweet Content */}
                <div class="mb-3 ml-[60px]">
                  <p class="whitespace-pre-wrap text-[15px] leading-relaxed text-gray-200">
                    {tweet.text}
                  </p>
                </div>

                {/* Media */}
                {tweet.mediaUrls && tweet.mediaUrls.length > 0 && (
                  <div class="mb-3 ml-[60px]">
                    <div class={`grid gap-1 ${tweet.mediaUrls.length === 1 ? 'grid-cols-1' : 'grid-cols-2'} overflow-hidden rounded-2xl border border-gray-700`}>
                      {tweet.mediaUrls.map((url, idx) => (
                        <button
                          key={idx}
                          type="button"
                          class="cursor-pointer overflow-hidden"
                          onClick$={(e) => {
                            e.preventDefault();
                            store.selectedImage = url;
                          }}
                          preventdefault:click
                        >
                          <img
                            src={url}
                            alt=""
                            class="h-auto max-h-[300px] w-full object-cover transition-transform hover:scale-105"
                            loading="lazy"
                            width="400"
                            height="300"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tweet Actions */}
                <div class="ml-[60px] flex items-center gap-6 text-sm text-gray-500">
                  <div class="flex items-center gap-2 transition-colors hover:text-blue-400">
                    <svg
                      class="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                    <span>{tweet.replyCount}</span>
                  </div>
                  <div class="flex items-center gap-2 transition-colors hover:text-green-400">
                    <svg
                      class="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                    <span>{tweet.retweetCount}</span>
                  </div>
                  <div class="flex items-center gap-2 transition-colors hover:text-red-400">
                    <svg
                      class="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                    <span>{tweet.likeCount}</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Last Updated */}
        <p class="text-center text-sm text-gray-500">
          Last updated: {new Date(store.data.lastFetched).toLocaleString()}
        </p>

        {/* Image Modal */}
        {store.selectedImage && (
          <div
            class="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
            onClick$={() => {
              store.selectedImage = null;
            }}
          >
            <button
              type="button"
              class="absolute right-4 top-4 rounded-full bg-gray-800/80 p-2 text-white transition-colors hover:bg-gray-700"
              onClick$={() => {
                store.selectedImage = null;
              }}
            >
              <svg
                class="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <img
              src={store.selectedImage}
              alt="Full size"
              class="max-h-[90vh] max-w-[90vw] rounded-lg object-contain"
              onClick$={(e) => {
                e.stopPropagation();
              }}
              width={800}
              height={600}
            />
          </div>
        )}
      </>
    </div>
  );
});

export const head: DocumentHead = {
  title: 'X - bwmp',
  meta: [
    {
      name: 'description',
      content: 'Check out my recent tweets and X activity',
    },
    {
      property: 'og:title',
      content: 'X - bwmp',
    },
    {
      property: 'og:description',
      content: 'Check out my recent tweets and X activity',
    },
  ],
};
