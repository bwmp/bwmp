import { component$, useSignal, useVisibleTask$ } from '@builder.io/qwik';
import { Gamepad, Play, Music } from 'lucide-icons-qwik';

// Types
export type Activity = {
  id: string;
  name: string;
  type: number;
  state?: string;
  details?: string;
  emoji?: { id: string | null; name: string; animated?: boolean };
  created_at: number;
  application_id?: string;
  assets?: {
    large_image?: string;
    small_image?: string;
    large_text?: string;
    small_text?: string;
  };
  timestamps?: {
    start?: number;
    end?: number;
  };
  [key: string]: unknown;
};

export type LanyardData = {
  kv: Record<string, string>;
  spotify: unknown | null;
  discord_user: {
    id: string;
    username: string;
    avatar: string | null;
    discriminator: string;
    bot: boolean;
    clan: unknown | null;
    global_name: string | null;
    avatar_decoration_data: unknown | null;
    display_name: string | null;
    public_flags: number;
  };
  activities: Activity[];
  discord_status: 'online' | 'idle' | 'dnd' | 'offline';
  active_on_discord_web: boolean;
  active_on_discord_desktop: boolean;
  active_on_discord_mobile: boolean;
  listening_to_spotify: boolean;
};

export type LanyardWSMessage = {
  op: number;
  d?: LanyardData;
  t?: string;
};

type LanyardActivitiesProps = {
  userId: string;
  isSafari?: boolean;
};

// Utility functions
function convertTime(duration: number): string {
  let seconds: number | string = Math.floor((duration / 1000) % 60);
  let minutes: number | string = Math.floor((duration / (1000 * 60)) % 60);
  const hours: number | string = Math.floor((duration / (1000 * 60 * 60)) % 24);

  // pad seconds
  seconds = seconds < 10 ? '0' + seconds : seconds;

  // if less than 1 hour, don't show hours
  if (duration < 3600000) return minutes + ':' + seconds;

  // pad minutes
  minutes = minutes < 10 ? '0' + minutes : minutes;

  return hours + ':' + minutes + ':' + seconds;
}

function processActivityAssets(activity: Activity, isSafari = false): void {
  if (!activity.assets) return;

  const app_id = activity.application_id;
  const large_image_id = activity.assets.large_image;

  if (large_image_id && app_id) {
    const large_image = large_image_id.startsWith('mp:')
      ? large_image_id.replace('mp:', 'https://media.discordapp.net/')
      : `https://cdn.discordapp.com/app-assets/${app_id}/${large_image_id}`;
    activity.assets.large_image = large_image;
  } else if (large_image_id?.startsWith('spotify:')) {
    const spotify_image = large_image_id.replace(
      'spotify:',
      'https://i.scdn.co/image/',
    );
    activity.assets.large_image = spotify_image;
  } else {
    activity.assets.large_image = undefined;
  }

  const small_image_id = activity.assets.small_image;
  if (small_image_id && app_id) {
    const small_image = small_image_id.startsWith('mp:')
      ? small_image_id.replace('mp:', 'https://media.discordapp.net/')
      : `https://cdn.discordapp.com/app-assets/${app_id}/${small_image_id}`;
    activity.assets.small_image = small_image;
  }

  // Handle Safari issues with rise images
  if (isSafari && activity.assets.large_image?.includes('rise.cider.sh')) {
    if (activity.assets.small_image) {
      activity.assets.large_image = activity.assets.small_image;
      activity.assets.small_image = undefined;
    } else {
      activity.assets.large_image = undefined;
    }
  }
}

const activityType = {
  0: 'Playing',
  1: 'Streaming',
  2: 'Listening to',
  3: 'Watching',
  4: '',
  5: 'Competing In',
};

const activityTypeIcons = {
  0: <Gamepad size={20} />,
  1: <Play size={20} />,
  2: <Music size={20} />,
  3: <Play size={20} />,
  4: '',
  5: <Gamepad size={20} />,
};

export default component$<LanyardActivitiesProps>(
  ({ userId, isSafari = false }) => {
    const activities = useSignal<Activity[]>([]);
    const now = useSignal(Date.now());
    const connected = useSignal(false);
    const error = useSignal<string | null>(null);

    // WebSocket connection and real-time updates
    // eslint-disable-next-line qwik/no-use-visible-task
    useVisibleTask$(({ cleanup }) => {
      let ws: WebSocket | null = null;
      let heartbeatInterval: NodeJS.Timeout | null = null;
      let nowUpdateInterval: NodeJS.Timeout | null = null;
      let reconnectTimeout: NodeJS.Timeout | null = null;
      let reconnectAttempts = 0;
      let isCleaningUp = false;

      const clearHeartbeat = () => {
        if (heartbeatInterval) {
          clearInterval(heartbeatInterval);
          heartbeatInterval = null;
        }
      };

      const clearReconnectTimeout = () => {
        if (reconnectTimeout) {
          clearTimeout(reconnectTimeout);
          reconnectTimeout = null;
        }
      };

      const getReconnectDelay = () => {
        // Exponential backoff with jitter: 1s, 2s, 4s, 8s, max 30s
        const baseDelay = Math.min(
          1000 * Math.pow(2, reconnectAttempts),
          30000,
        );
        return baseDelay + Math.random() * 1000; // Add jitter
      };

      const connect = () => {
        if (isCleaningUp) return;

        // Clean up existing connection
        if (ws) {
          ws.close();
          ws = null;
        }
        clearHeartbeat();
        clearReconnectTimeout();

        try {
          console.log(
            `Attempting to connect to Lanyard Activities (attempt ${reconnectAttempts + 1})`,
          );
          ws = new WebSocket('wss://api.lanyard.rest/socket');

          const currentWs = ws; // Capture reference for closure

          ws.onopen = () => {
            if (currentWs !== ws || isCleaningUp) return;
            console.log('Lanyard WebSocket connected');
            connected.value = true;
            error.value = null;
            reconnectAttempts = 0; // Reset on successful connection
          };

          ws.onmessage = (event) => {
            if (currentWs !== ws || isCleaningUp) return;

            try {
              const message: LanyardWSMessage = JSON.parse(event.data);

              if (message.op === 1) {
                // Hello - start heartbeat
                const heartbeatData = message.d as any;

                // Clear existing heartbeat before setting new one
                clearHeartbeat();

                heartbeatInterval = setInterval(() => {
                  if (
                    currentWs === ws &&
                    ws?.readyState === WebSocket.OPEN &&
                    !isCleaningUp
                  ) {
                    try {
                      ws.send(JSON.stringify({ op: 3 }));
                    } catch (err) {
                      console.error('Failed to send heartbeat:', err);
                    }
                  }
                }, heartbeatData.heartbeat_interval);

                // Subscribe to user
                if (ws?.readyState === WebSocket.OPEN) {
                  try {
                    ws.send(
                      JSON.stringify({
                        op: 2,
                        d: {
                          subscribe_to_id: userId,
                        },
                      }),
                    );
                  } catch (err) {
                    console.error('Failed to subscribe to user:', err);
                  }
                }
              } else if (message.op === 0 && message.d) {
                // Presence update
                const data = message.d;
                // Process activity assets
                data.activities.forEach((activity) =>
                  processActivityAssets(activity, isSafari),
                );
                activities.value = data.activities;
              }
            } catch (err) {
              console.error('Error parsing Lanyard message:', err);
            }
          };

          ws.onclose = (event) => {
            if (currentWs !== ws || isCleaningUp) return;

            console.log(
              `Lanyard WebSocket disconnected: ${event.code} ${event.reason || '(no reason)'}`,
            );
            connected.value = false;
            clearHeartbeat();

            // Handle different close codes
            const shouldReconnect = !event.wasClean && !isCleaningUp;

            if (shouldReconnect) {
              const delay = getReconnectDelay();
              console.log(
                `Activities reconnecting in ${Math.round(delay / 1000)}s...`,
              );

              reconnectTimeout = setTimeout(() => {
                if (!isCleaningUp) {
                  reconnectAttempts++;
                  connect();
                }
              }, delay);
            }
          };

          ws.onerror = (err) => {
            if (currentWs !== ws || isCleaningUp) return;

            console.error('Lanyard WebSocket error:', err);
            error.value = 'Connection error';
            connected.value = false;
          };
        } catch (err) {
          console.error('Failed to create WebSocket connection:', err);
          error.value = 'Failed to connect';
          connected.value = false;

          if (!isCleaningUp) {
            reconnectTimeout = setTimeout(() => {
              if (!isCleaningUp) {
                reconnectAttempts++;
                connect();
              }
            }, getReconnectDelay());
          }
        }
      };

      // Update timestamp every second
      nowUpdateInterval = setInterval(() => {
        if (!isCleaningUp) {
          now.value = Date.now();
        }
      }, 1000);

      connect();

      cleanup(() => {
        isCleaningUp = true;
        clearHeartbeat();
        clearReconnectTimeout();

        if (nowUpdateInterval) {
          clearInterval(nowUpdateInterval);
        }

        if (ws) {
          ws.close(1000, 'Component cleanup');
          ws = null;
        }
      });
    });

    if (error.value) {
      return (
        <div class="flex items-center justify-center p-4 text-red-400">
          <p>Failed to load activities: {error.value}</p>
        </div>
      );
    }

    if (!connected.value) {
      return (
        <div class="flex items-center justify-center p-4 text-gray-400">
          <div class="h-6 w-6 animate-spin rounded-full border-b-2 border-gray-400"></div>
          <span class="ml-2">Connecting to Discord...</span>
        </div>
      );
    }

    if (!activities.value?.length) {
      return (
        <div class="flex items-center justify-center p-4 text-gray-400">
          <p>No activities to display</p>
        </div>
      );
    }

    return (
      <div class="flex flex-row flex-wrap justify-evenly gap-2">
        {activities.value.map((activity: Activity) => {
          if (activity.type === 4) return null;
          return (
            <div
              key={activity.id}
              class="lum-card lum-bg-black/70 rounded-lum-2 relative min-w-full flex-1 border border-gray-900 p-4 transition-all duration-300 md:max-w-1/3 md:min-w-1/3"
            >
              <img
                src={activity.assets?.large_image}
                alt={activity.assets?.large_text}
                width={400}
                height={400}
                class="absolute inset-0 -z-2 h-full w-full object-cover blur-xl saturate-200"
                style={{ clipPath: 'inset(0 round var(--radius-3xl))' }}
              />
              <h3 class="flex items-center gap-2 text-xs font-bold">
                {(activityTypeIcons as any)[activity.type]}
                {(activityType as any)[activity.type]} {activity.name}
              </h3>
              <div class="my-auto flex flex-row gap-4">
                <div class="relative mb-auto">
                  {activity.assets?.large_image && (
                    <>
                      <img
                        src={activity.assets.large_image}
                        alt={activity.assets.large_text}
                        width={75}
                        height={75}
                        class="rounded-lum-6 border-lum-border/20 border blur-md"
                      />
                      <img
                        src={activity.assets.large_image}
                        alt={activity.assets.large_text}
                        width={75}
                        height={75}
                        class="rounded-lum-6 border-lum-border/20 absolute top-0 border"
                      />
                    </>
                  )}
                  {activity.assets?.small_image && (
                    <img
                      src={activity.assets.small_image}
                      alt={activity.assets.small_text}
                      width={25}
                      height={25}
                      class="rounded-lum-6 border-lum-border/20 absolute -right-2 -bottom-2 border"
                    />
                  )}
                </div>
                <div class="flex flex-1 flex-col text-xs">
                  {activity.details && (
                    <p class="font-semibold">{activity.details}</p>
                  )}
                  {activity.state && (
                    <p class="overflow-hidden text-ellipsis text-gray-400">
                      {activity.state}
                    </p>
                  )}
                  {activity.assets?.large_text && (
                    <p class="text-gray-400">{activity.assets.large_text}</p>
                  )}
                  {activity.timestamps?.start && !activity.timestamps?.end && (
                    <p class="text-luminescent-400">
                      {convertTime(now.value - activity.timestamps.start)}{' '}
                      elapsed
                    </p>
                  )}
                  {activity.timestamps?.end && !activity.timestamps?.start && (
                    <p class="text-luminescent-400">
                      {convertTime(activity.timestamps.end - now.value)} left
                    </p>
                  )}
                  {activity.timestamps?.start && activity.timestamps?.end && (
                    <div class="mt-1 text-xs text-white">
                      <div class="lum-bg-gray-950/10 rounded-lum-6 relative overflow-x-clip">
                        <div class="flex items-center justify-between px-1.5 py-0.5">
                          <span>
                            {convertTime(now.value - activity.timestamps.start)}
                          </span>
                          <span>
                            {convertTime(
                              activity.timestamps.end -
                                activity.timestamps.start,
                            )}
                          </span>
                        </div>
                        <div
                          class="absolute inset-0 rounded-[7px] brightness-200 backdrop-saturate-200"
                          style={{
                            width: `${((now.value - activity.timestamps.start) / (activity.timestamps.end - activity.timestamps.start)) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  },
);
