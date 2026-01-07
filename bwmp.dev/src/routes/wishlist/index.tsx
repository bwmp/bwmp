import { component$ } from '@builder.io/qwik';
import { routeLoader$ } from '@builder.io/qwik-city';
import type { DocumentHead } from '@builder.io/qwik-city';

interface WishlistItem {
  id: string;
  name: string;
  description: string;
  price: number;
  shipping: number;
  currency: string;
  imgLink: string;
  link: string;
  itemLink: string;
  emoji: string;
  emojiBackgroundColor: string;
  quantity: number;
  isAvailable: boolean;
  notInStock: boolean;
  isHidden: boolean;
  tax: number;
  fee: number;
  totalContributionPrice: number;
  fundingPercentage: number;
  paymentConfiguration: {
    type: string;
  };
  extraImgLinks: string[];
  previewImgLink: string;
}

interface ThroneData {
  displayName: string;
  username: string;
  bio: string;
  pictureUrl: string;
  socialLinks: Array<{
    id: string;
    type: string;
    name: string;
    url: string;
    isPrioritized: boolean;
  }>;
  creatorPageCustomization: {
    colorScheme: string;
  };
  wishlistItems: WishlistItem[];
}

interface ThroneResponse {
  data: ThroneData;
  success: boolean;
}

export const useThroneData = routeLoader$<ThroneResponse>(async () => {
  const response = await fetch('https://api.bwmp.dev/api/throne');
  const data = (await response.json()) as ThroneResponse;
  return data;
});

export default component$(() => {
  const throneData = useThroneData();

  return (
    <div class="mx-auto max-w-6xl px-4 py-8">
      <div class="mb-8 text-center">
        <h1 class="mb-4 text-4xl font-bold">Wishlist</h1>
        {throneData.value.success && (
          <div class="flex flex-col items-center gap-4">
            <img
              src={throneData.value.data.pictureUrl}
              alt={throneData.value.data.displayName}
              class="h-24 w-24 rounded-full"
              width={96}
              height={96}
            />
            <div>
              <h2 class="text-2xl font-semibold">
                {throneData.value.data.displayName}
              </h2>
              <p class="text-lum-text-secondary mt-2">
                {throneData.value.data.bio}
              </p>
            </div>
          </div>
        )}
      </div>

      {throneData.value.success && (
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {throneData.value.data.wishlistItems
            .filter((item) => !item.isHidden && item.isAvailable)
            .map((item) => (
              <a
                key={item.id}
                href={item.itemLink}
                target="_blank"
                rel="noopener noreferrer"
                class="rounded-lum-3 lum-bg-lum-input-bg border-lum-border hover:border-lum-brand-primary flex cursor-pointer flex-col overflow-hidden border transition-colors"
              >
                <div class="relative aspect-square overflow-hidden">
                  <img
                    src={item.imgLink}
                    alt={item.name}
                    class="h-full w-full object-cover"
                    width={256}
                    height={256}
                  />
                  {item.notInStock && (
                    <div class="lum-bg-black/50 absolute inset-0 flex items-center justify-center">
                      <span class="text-xl font-bold text-white">
                        Out of Stock
                      </span>
                    </div>
                  )}
                  {item.fundingPercentage > 0 && (
                    <div class="lum-bg-black/70 absolute right-0 bottom-0 left-0 p-2">
                      <div class="lum-bg-gray-700 h-2 w-full overflow-hidden rounded-full">
                        <div
                          class="lum-bg-green-500 h-full"
                          style={`width: ${item.fundingPercentage}%`}
                        />
                      </div>
                      <p class="mt-1 text-xs text-white">
                        {item.fundingPercentage}% funded
                      </p>
                    </div>
                  )}
                </div>

                <div class="flex flex-1 flex-col p-4">
                  <h3 class="mb-2 text-lg font-semibold">{item.name}</h3>
                  <p class="text-lum-text-secondary mb-4 flex-1 text-sm">
                    {item.description}
                  </p>

                  <div>
                    <p class="text-2xl font-bold">
                      ${(item.price / 100).toFixed(2)}
                    </p>
                    {item.shipping > 0 && (
                      <p class="text-lum-text-secondary text-xs">
                        +${(item.shipping / 100).toFixed(2)} shipping
                      </p>
                    )}
                  </div>

                  {item.paymentConfiguration.type === 'crowdfunding' && (
                    <div class="mt-3">
                      <div class="mb-2 flex items-center justify-between">
                        <span class="text-xs font-medium text-blue-400">
                          Crowdfunding
                        </span>
                        <span class="text-xs font-semibold text-blue-400">
                          {item.fundingPercentage}%
                        </span>
                      </div>
                      <div class="lum-bg-gray-700 h-2 w-full overflow-hidden rounded-full">
                        <div
                          class="lum-bg-blue-500 h-full transition-all"
                          style={`width: ${item.fundingPercentage}%`}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </a>
            ))}
        </div>
      )}

      {throneData.value.success &&
        throneData.value.data.wishlistItems.length === 0 && (
        <div class="py-12 text-center">
          <p class="text-lum-text-secondary text-xl">
              No items in the wishlist yet!
          </p>
        </div>
      )}

      {!throneData.value.success && (
        <div class="py-12 text-center">
          <p class="text-xl text-red-500">Failed to load wishlist data.</p>
        </div>
      )}
    </div>
  );
});

export const head: DocumentHead = {
  title: 'Wishlist - bwmp',
  meta: [
    {
      name: 'description',
      content: 'Check out bwmp\'s wishlist on Throne',
    },
  ],
};
