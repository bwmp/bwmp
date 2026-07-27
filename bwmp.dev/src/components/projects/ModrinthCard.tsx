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

function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
}

function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export default component$<ModrinthCardProps>(({ project }) => {
  const tags = [...project.loaders, ...project.categories].slice(0, 3);

  return (
    <a
      href={`https://modrinth.com/plugin/${project.slug}`}
      target="_blank"
      rel="noopener noreferrer"
      class="lum-card lum-bg-gray-800/30 h-full !gap-0 !p-5 transition-colors hover:border-gray-600/60"
    >
      <div class="flex items-start gap-3">
        <div class="rounded-lum-4 flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden bg-gray-950/40">
          {project.icon_url && (
            <img
              src={project.icon_url}
              alt=""
              width="48"
              height="48"
              class="h-full w-full object-cover"
              loading="lazy"
            />
          )}
        </div>
        <div class="min-w-0">
          <h3 class="mt-0.5 truncate text-base font-semibold text-gray-100">
            {project.title}
          </h3>
          <div class="mt-1 flex items-center gap-3 text-xs text-gray-400">
            <span class="flex items-center gap-1.5">
              <Download class="h-3.5 w-3.5" />
              {formatNumber(project.downloads)}
            </span>
            <span class="flex items-center gap-1.5">
              <Heart class="h-3.5 w-3.5" />
              {formatNumber(project.followers)}
            </span>
          </div>
        </div>
      </div>

      <p class="mt-4 line-clamp-3 text-sm leading-relaxed text-gray-400">
        {project.description}
      </p>

      {tags.length > 0 && (
        <div class="mt-auto flex flex-wrap gap-1.5 pt-5">
          {tags.map((tag) => (
            <span
              key={tag}
              class="rounded-lum-4 lum-bg-gray-700/40 px-2 py-1 text-xs font-medium text-gray-300"
            >
              {capitalizeFirst(tag)}
            </span>
          ))}
        </div>
      )}
    </a>
  );
});
