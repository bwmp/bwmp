import { component$ } from '@builder.io/qwik';
import { Download, Heart } from 'lucide-icons-qwik';

export type ModrinthProject = {
  id: string;
  slug: string;
  title: string;
  description: string;
  downloads: number;
  followers: number;
  categories: string[];
  loaders: string[];
  icon_url?: string;
};

type ModrinthCardProps = {
  project: ModrinthProject;
};

export default component$<ModrinthCardProps>(({ project }) => {
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  const capitalizeFirst = (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  return (
    <a
      href={`https://modrinth.com/plugin/${project.slug}`}
      target="_blank"
      rel="noopener noreferrer"
      class="lum-card lum-bg-gray-800/30 group relative block h-full w-full overflow-hidden transition-all duration-300 hover:scale-105"
    >
      <div class="flex h-full flex-col">
        {project.icon_url && (
          <div class="mb-3 flex items-center justify-center pt-3 sm:mb-4 sm:pt-4">
            <img
              src={project.icon_url}
              alt={`${project.title} icon`}
              width={120}
              height={120}
              class="h-24 w-24 rounded-lg object-cover sm:h-30 sm:w-30"
              loading="lazy"
            />
          </div>
        )}

        <div class="flex flex-grow flex-col px-4 pb-4 sm:px-6 sm:pb-6">
          <h3 class="mb-2 line-clamp-1 text-center text-lg font-bold text-gray-100 sm:mb-3 sm:text-xl">
            {project.title}
          </h3>

          <div class="mb-3 flex items-center justify-center gap-4 text-xs text-gray-400 sm:mb-4 sm:text-sm">
            <div class="flex items-center gap-2">
              <Download class="h-3 w-3 sm:h-4 sm:w-4" />
              <span>{formatNumber(project.downloads)} downloads</span>
            </div>
            <div class="flex items-center gap-2">
              <Heart class="h-3 w-3 sm:h-4 sm:w-4" />
              <span>{formatNumber(project.followers)} follows</span>
            </div>
          </div>

          <p class="mb-3 line-clamp-2 flex-grow text-xs leading-relaxed text-gray-300 sm:mb-4 sm:line-clamp-3 sm:text-sm">
            {project.description}
          </p>

          {project.categories.length > 0 && (
            <div class="mb-3 sm:mb-4">
              <div class="flex flex-wrap justify-center gap-1 sm:gap-2">
                {project.categories.slice(0, 2).map((category) => (
                  <span
                    key={category}
                    class="rounded-md bg-blue-500/20 px-2 py-1 text-xs text-blue-300"
                  >
                    {capitalizeFirst(category)}
                  </span>
                ))}
                {project.categories.length > 2 && (
                  <span class="rounded-md bg-gray-600/50 px-2 py-1 text-xs text-gray-400">
                    +{project.categories.length - 2} more
                  </span>
                )}
              </div>
            </div>
          )}

          {project.loaders.length > 0 && (
            <div class="flex flex-wrap justify-center gap-1 sm:gap-2">
              {project.loaders.slice(0, 2).map((loader) => (
                <span
                  key={loader}
                  class="rounded-md bg-green-500/20 px-2 py-1 text-xs text-green-300"
                >
                  {capitalizeFirst(loader)}
                </span>
              ))}
              {project.loaders.length > 2 && (
                <span class="rounded-md bg-gray-600/50 px-2 py-1 text-xs text-gray-400">
                  +{project.loaders.length - 2} more
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </a>
  );
});
