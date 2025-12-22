import {
  component$,
  useSignal,
  useTask$,
  PropFunction,
  $,
} from '@builder.io/qwik';
import { Tag } from './Tag';
import { techIconSrc } from '~/data/techIcons';
import timelineData from '~/data/timeline.json';

interface TimelineEntryRaw {
  id: string;
  project: string;
  description: string;
  start: string;
  end: string | null;
  tech?: string[];
  role?: string;
}

interface TimelineEntry extends TimelineEntryRaw {
  startDate: Date;
  endDate: Date | null;
  durationLabel: string;
  durationMonths: number;
}

function formatDate(d: Date) {
  return d.toLocaleDateString(undefined, { month: 'short', year: 'numeric' });
}

function formatDuration(start: Date, end: Date | null): string {
  const effectiveEnd = end ?? new Date();
  let months =
    (effectiveEnd.getFullYear() - start.getFullYear()) * 12 +
    (effectiveEnd.getMonth() - start.getMonth());
  if (months < 0) months = 0;
  const years = Math.floor(months / 12);
  const remMonths = months % 12;
  const parts: string[] = [];
  if (years) parts.push(`${years}y`);
  if (remMonths) parts.push(`${remMonths}m`);
  if (!parts.length) parts.push('0m');
  return parts.join(' ');
}

interface TimelineProps {
  onSelect$?: PropFunction<(id: string) => void>;
}

export const Timeline = component$<TimelineProps>(({ onSelect$ }) => {
  const entriesSig = useSignal<TimelineEntry[]>([]);
  const expandedId = useSignal<string | null>(null);
  const earliestStartSig = useSignal<Date | null>(null);
  const latestEndSig = useSignal<Date | null>(null);
  const collapsedAll = useSignal<boolean>(true);
  const toggleExpand = $((id: string) => {
    expandedId.value = expandedId.value === id ? null : id;
  });

  useTask$(() => {
    const mapped: TimelineEntry[] = (timelineData as TimelineEntryRaw[]).map(
      (e) => {
        const startDate = new Date(e.start);
        const endDate = e.end ? new Date(e.end) : null;
        return {
          ...e,
          startDate,
          endDate,
          durationMonths: Math.max(
            0,
            ((endDate ?? new Date()).getFullYear() - startDate.getFullYear()) *
              12 +
              ((endDate ?? new Date()).getMonth() - startDate.getMonth()),
          ),
          durationLabel: `${formatDate(startDate)} – ${endDate ? formatDate(endDate) : 'Present'} (${formatDuration(
            startDate,
            endDate,
          )})`,
        };
      },
    );
    mapped.sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
    entriesSig.value = mapped;
    if (mapped.length) {
      earliestStartSig.value = mapped[0].startDate;
      const latest = mapped.reduce<Date>((acc, cur) => {
        const d = cur.endDate ?? new Date();
        return d > acc ? d : acc;
      }, mapped[0].endDate ?? new Date());
      latestEndSig.value = latest;
    }
  });

  const cardPadding = 'p-3 md:p-4';
  const titleSize = 'text-[13px] md:text-sm';
  const techGap = 'gap-1.5';

  return (
    <div>
      <div class="mb-4 flex items-center justify-between">
        <button
          type="button"
          class="group relative overflow-hidden rounded-lum-2 border border-blue-500/40 bg-gradient-to-r from-blue-600/20 to-blue-500/20 px-4 py-2.5 text-sm font-semibold text-blue-100 shadow-lg shadow-blue-500/10 transition-all hover:border-blue-400/60 hover:from-blue-600/30 hover:to-blue-500/30 hover:shadow-blue-500/20 focus:ring-2 focus:ring-blue-500/60 focus:outline-none active:scale-[0.98]"
          aria-expanded={!collapsedAll.value}
          onClick$={() => (collapsedAll.value = !collapsedAll.value)}
        >
          <span class="relative z-10 flex items-center gap-2">
            <svg
              class="h-4 w-4 transition-transform duration-300"
              style={{
                transform: collapsedAll.value ? 'rotate(0deg)' : 'rotate(180deg)',
              }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
            {collapsedAll.value ? 'Show timeline' : 'Hide timeline'}
          </span>
          <div class="absolute inset-0 -z-10 bg-gradient-to-r from-blue-600/0 via-blue-500/30 to-blue-600/0 opacity-0 transition-opacity group-hover:opacity-100" />
        </button>
      </div>
      <div
        class={{
          'overflow-hidden transition-[max-height,opacity] duration-500 ease-in-out':
            true,
          'pointer-events-none opacity-0': collapsedAll.value,
          'opacity-100': !collapsedAll.value,
        }}
        style={{ maxHeight: collapsedAll.value ? '0px' : '4000px' }}
      >
        <ul class="space-y-6">
          {entriesSig.value.map((item, idx) => {
            const ongoing = !item.endDate;
            const expanded = expandedId.value === item.id;
            const earliest = earliestStartSig.value;
            const latest = latestEndSig.value;
            let startOffsetPercent = 0;
            let durationPercentGlobal = 1;
            if (earliest && latest) {
              const monthsBetween = (a: Date, b: Date) =>
                (b.getFullYear() - a.getFullYear()) * 12 +
                (b.getMonth() - a.getMonth());
              const totalSpan = Math.max(1, monthsBetween(earliest, latest));
              const startOffsetMonths = Math.max(
                0,
                monthsBetween(earliest, item.startDate),
              );
              const effectiveEnd = item.endDate ?? latest;
              const durationMonths = Math.max(
                0,
                monthsBetween(item.startDate, effectiveEnd),
              );
              startOffsetPercent = startOffsetMonths / totalSpan;
              durationPercentGlobal = durationMonths / totalSpan;
              if (durationPercentGlobal < 0.04) durationPercentGlobal = 0.04;
              if (startOffsetPercent + durationPercentGlobal > 1)
                durationPercentGlobal = 1 - startOffsetPercent;
            }
            const collapsedWidth = 220;
            const transitionSpec =
              'margin-left 420ms cubic-bezier(.4,0,.2,1), width 420ms cubic-bezier(.4,0,.2,1), background-color 240ms ease';
            const cardStyle = expanded
              ? { width: '100%', marginLeft: '0', transition: transitionSpec }
              : {
                width: `${collapsedWidth}px`,
                marginLeft: `clamp(0px, ${(startOffsetPercent * 100).toFixed(2)}%, calc(100% - ${collapsedWidth}px))`,
                transition: transitionSpec,
              };
            return (
              <li key={item.id} class="relative pl-8 md:pl-12">
                <div class="md:absolute md:top-1.5 md:left-0 md:flex md:w-10 md:justify-center">
                  <button
                    type="button"
                    onClick$={() => onSelect$ && onSelect$(item.id)}
                    class={{
                      'relative z-10 rounded-full shadow-lg transition outline-none focus:ring-2 focus:ring-blue-400/60':
                        true,
                      'h-3 w-3 ring-2 ring-gray-800': true,
                      'animate-pulse bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600':
                        ongoing,
                      'bg-gradient-to-br from-gray-500 to-gray-700': !ongoing,
                    }}
                    aria-label={`Select ${item.project}`}
                  />
                </div>
                <div class="w-full">
                  <div class="relative mb-2 h-3">
                    <div
                      class={{
                        'absolute top-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r shadow-sm transition-all':
                          true,
                        'from-blue-500 via-blue-600 to-blue-700': ongoing,
                        'from-gray-500 to-gray-700': !ongoing,
                      }}
                      style={{
                        left: `${(startOffsetPercent * 100).toFixed(2)}%`,
                        width: `${(durationPercentGlobal * 100).toFixed(2)}%`,
                        height: '6px',
                      }}
                    />
                  </div>
                  <div
                    class={`group rounded-lum-2 cursor-pointer border border-gray-700/40 bg-gray-800/40 hover:bg-gray-800/60 ${cardPadding} relative backdrop-blur-sm transition`}
                    role="button"
                    tabIndex={0}
                    aria-expanded={expanded}
                    aria-controls={`timeline-panel-${item.id}`}
                    onClick$={() => toggleExpand(item.id)}
                    style={cardStyle}
                  >
                    <div class="space-y-2">
                      <div class="flex flex-wrap items-center gap-1.5">
                        <h3 class={`font-semibold text-gray-100 ${titleSize}`}>
                          {item.project}
                        </h3>
                        {item.role && (
                          <span class="rounded-lum bg-blue-900/40 px-1.5 py-px text-[9px] font-medium text-blue-200">
                            {item.role}
                          </span>
                        )}
                      </div>
                      <p class="text-[10px] font-medium tracking-wide text-gray-400 md:text-xs">
                        {item.durationLabel}
                      </p>
                      <div
                        id={`timeline-panel-${item.id}`}
                        class={{
                          'space-y-3 overflow-hidden pt-1 text-gray-300': true,
                          'max-h-[900px] opacity-100 transition-all delay-[140ms] duration-300 ease-in-out':
                            expanded,
                          'pointer-events-none max-h-0 opacity-0 duration-140':
                            !expanded,
                        }}
                        aria-hidden={!expanded}
                      >
                        <p class="text-xs leading-relaxed text-gray-300 md:text-[13px]">
                          {item.description}
                        </p>
                        <div class="flex flex-wrap items-center gap-2 text-[10px] text-gray-400 md:text-xs">
                          <span class="rounded-lum bg-gray-700/40 px-2 py-1">
                            Started {formatDate(item.startDate)}
                          </span>
                          <span class="rounded-lum bg-gray-700/30 px-2 py-1">
                            Elapsed {formatDuration(item.startDate, null)}
                          </span>
                          {item.endDate && (
                            <span class="rounded-lum bg-gray-700/30 px-2 py-1">
                              Paused {formatDate(item.endDate)}
                            </span>
                          )}
                        </div>
                        {item.tech && item.tech.length > 0 && (
                          <div class={`flex flex-wrap ${techGap}`}>
                            {item.tech.map((t) => (
                              <Tag key={t} name={t} iconSrc={techIconSrc[t]} />
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                {idx !== entriesSig.value.length - 1 && (
                  <div class="md:absolute md:top-6 md:bottom-0 md:left-5 md:w-px md:bg-gradient-to-b md:from-gray-600/40 md:via-gray-700/30 md:to-gray-800/0" />
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
});

export default Timeline;
