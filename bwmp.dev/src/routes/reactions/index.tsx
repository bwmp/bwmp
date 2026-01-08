import { component$, useSignal, useVisibleTask$, $ } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';

// Emoji particle for canvas rendering
interface EmojiParticle {
  emoji: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  scale: number;
  lifetime: number;
  maxLifetime: number;
  active: boolean;
}

interface WebSocketResponse {
  success: boolean;
  action?: string;
  data?: {
    emoji?: string;
    username?: string;
    timestamp?: string;
    connectionId?: string;
    message?: string;
    count?: number;
    emojis?: Array<{ emoji: string, username: string, timestamp: string }>;
  };
  error?: {
    code: string;
    message: string;
  };
}

const EMOJIS = ['❤️', '🤩', '😭', '😡', '🥺', '👍', '👎', '🙏', '💫', '🔥', '💯', '🎈', '⚡'];
const WS_URL = 'ws://localhost:5000/ws';
// const WS_URL = 'wss://api.bwmp.dev/ws';

// Configuration for performance tuning
const CONFIG = {
  MAX_PARTICLES: 500,        // Maximum emojis on screen
  POOL_SIZE: 600,            // Pre-allocated particle pool
  EMOJI_SIZE: 48,            // Base emoji size in pixels
  SPAWN_RATE_LIMIT: 10,      // Max emojis to spawn per frame
  FADE_IN_DURATION: 0.1,     // Seconds to fade in
  FADE_OUT_START: 0.8,       // Start fading at 80% of lifetime
  BASE_LIFETIME: 4,          // Base lifetime in seconds
  LIFETIME_VARIANCE: 1.5,    // Random variance in lifetime
  BASE_SPEED: 150,           // Base upward speed (pixels/sec)
  SPEED_VARIANCE: 50,        // Random variance in speed
  HORIZONTAL_DRIFT: 30,      // Max horizontal drift (pixels/sec)
  ROTATION_SPEED: 0.5,       // Base rotation speed (radians/sec)
};

export default component$(() => {
  const connectionStatus = useSignal<'connecting' | 'connected' | 'disconnected'>('disconnected');
  const errorMessage = useSignal('');
  const userCount = useSignal(0);
  const canvasRef = useSignal<HTMLCanvasElement>();
  const activeCount = useSignal(0);
  const randomUsername = useSignal(`User${Math.floor(Math.random() * 10000)}`);

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(({ cleanup }) => {
    const canvas = canvasRef.value;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    // High DPI support
    const updateCanvasSize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
    };
    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    // Pre-render emoji textures to offscreen canvases for faster drawing
    const emojiCache = new Map<string, HTMLCanvasElement>();
    const cacheEmoji = (emoji: string): HTMLCanvasElement => {
      if (emojiCache.has(emoji)) return emojiCache.get(emoji)!;

      const size = CONFIG.EMOJI_SIZE * 2; // Extra space for scaling
      const offscreen = document.createElement('canvas');
      offscreen.width = size;
      offscreen.height = size;
      const offCtx = offscreen.getContext('2d')!;
      offCtx.font = `${CONFIG.EMOJI_SIZE}px "Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif`;
      offCtx.textAlign = 'center';
      offCtx.textBaseline = 'middle';
      offCtx.fillText(emoji, size / 2, size / 2);
      emojiCache.set(emoji, offscreen);
      return offscreen;
    };

    // Pre-cache all emojis
    EMOJIS.forEach(cacheEmoji);

    // Object pool for particles
    const particlePool: EmojiParticle[] = [];
    for (let i = 0; i < CONFIG.POOL_SIZE; i++) {
      particlePool.push({
        emoji: '',
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        rotation: 0,
        rotationSpeed: 0,
        opacity: 0,
        scale: 1,
        lifetime: 0,
        maxLifetime: 0,
        active: false,
      });
    }

    // Spawn queue for rate limiting
    const spawnQueue: string[] = [];

    // Get an inactive particle from the pool
    const getParticle = (): EmojiParticle | null => {
      for (const p of particlePool) {
        if (!p.active) return p;
      }
      return null;
    };

    // Count active particles
    const countActive = (): number => {
      let count = 0;
      for (const p of particlePool) {
        if (p.active) count++;
      }
      return count;
    };

    // Spawn a new emoji particle
    const spawnEmoji = (emoji: string) => {
      // Cache the emoji if not already cached
      if (!emojiCache.has(emoji)) {
        cacheEmoji(emoji);
      }

      const particle = getParticle();
      if (!particle) return; // Pool exhausted

      const rect = canvas.getBoundingClientRect();
      particle.emoji = emoji;
      particle.x = Math.random() * (rect.width - 100) + 50;
      particle.y = rect.height + CONFIG.EMOJI_SIZE;
      particle.vx = (Math.random() - 0.5) * CONFIG.HORIZONTAL_DRIFT * 2;
      particle.vy = -(CONFIG.BASE_SPEED + Math.random() * CONFIG.SPEED_VARIANCE);
      particle.rotation = Math.random() * Math.PI * 2;
      particle.rotationSpeed = (Math.random() - 0.5) * CONFIG.ROTATION_SPEED * 2;
      particle.opacity = 0;
      particle.scale = 0.8 + Math.random() * 0.4;
      particle.lifetime = 0;
      particle.maxLifetime = CONFIG.BASE_LIFETIME + Math.random() * CONFIG.LIFETIME_VARIANCE;
      particle.active = true;
    };

    // Add emoji to spawn queue
    const queueEmoji = (emoji: string) => {
      if (spawnQueue.length < 1000) {
        spawnQueue.push(emoji);
      }
    };

    // Animation loop
    let lastTime = performance.now();
    let animationId: number;

    const animate = (currentTime: number) => {
      const deltaTime = (currentTime - lastTime) / 1000; // Convert to seconds
      lastTime = currentTime;

      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);

      // Process spawn queue with rate limiting
      const currentActive = countActive();
      const spawnsThisFrame = Math.min(
        CONFIG.SPAWN_RATE_LIMIT,
        spawnQueue.length,
        CONFIG.MAX_PARTICLES - currentActive,
      );
      for (let i = 0; i < spawnsThisFrame; i++) {
        const emoji = spawnQueue.shift();
        if (emoji) spawnEmoji(emoji);
      }

      // Update and render particles
      let active = 0;
      for (const p of particlePool) {
        if (!p.active) continue;

        // Update lifetime
        p.lifetime += deltaTime;
        if (p.lifetime >= p.maxLifetime || p.y < -CONFIG.EMOJI_SIZE * 2) {
          p.active = false;
          continue;
        }

        active++;

        // Update position
        p.x += p.vx * deltaTime;
        p.y += p.vy * deltaTime;
        p.rotation += p.rotationSpeed * deltaTime;

        // Calculate opacity (fade in and out)
        const lifeProgress = p.lifetime / p.maxLifetime;
        if (lifeProgress < CONFIG.FADE_IN_DURATION) {
          p.opacity = lifeProgress / CONFIG.FADE_IN_DURATION;
        } else if (lifeProgress > CONFIG.FADE_OUT_START) {
          p.opacity = 1 - (lifeProgress - CONFIG.FADE_OUT_START) / (1 - CONFIG.FADE_OUT_START);
        } else {
          p.opacity = 1;
        }

        // Render particle
        const cachedEmoji = emojiCache.get(p.emoji);
        if (cachedEmoji) {
          ctx.save();
          ctx.globalAlpha = p.opacity;
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.scale(p.scale, p.scale);
          ctx.drawImage(
            cachedEmoji,
            -CONFIG.EMOJI_SIZE,
            -CONFIG.EMOJI_SIZE,
            CONFIG.EMOJI_SIZE * 2,
            CONFIG.EMOJI_SIZE * 2,
          );
          ctx.restore();
        }
      }

      activeCount.value = active;
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    // WebSocket connection
    let reconnectAttempts = 0;
    let reconnectTimeout: number | null = null;
    let ws: WebSocket | null = null;
    let isCleaningUp = false;

    const getReconnectDelay = () => {
      return Math.min(1000 * Math.pow(2, reconnectAttempts), 30000) + Math.random() * 1000;
    };

    const connect = () => {
      if (isCleaningUp) return;

      connectionStatus.value = 'connecting';
      errorMessage.value = '';

      ws = new WebSocket(WS_URL);

      ws.onopen = () => {
        if (isCleaningUp) {
          ws?.close();
          return;
        }
        ws?.send(JSON.stringify({ action: 'identify', payload: { username: randomUsername.value } }));
        connectionStatus.value = 'connected';
        reconnectAttempts = 0;
      };

      ws.onmessage = (event) => {
        try {
          const response: WebSocketResponse = JSON.parse(event.data);
          if (!response.success) {
            errorMessage.value = response.error?.message || 'Unknown error';
            return;
          }

          switch (response.action) {
          case 'emojiSent':
          case 'emojiReceived':
            if (response.data?.emoji) queueEmoji(response.data.emoji);
            break;
          case 'emojiBatch':
            response.data?.emojis?.forEach((item) => {
              if (item.emoji && item.username != randomUsername.value) queueEmoji(item.emoji);
            });
            break;
          case 'userCountUpdate':
            if (response.data?.count !== undefined) {
              userCount.value = response.data.count;
            }
            break;
          }
        } catch (error) {
          console.error('WebSocket message error:', error);
        }
      };

      ws.onclose = () => {
        if (isCleaningUp) return;

        connectionStatus.value = 'disconnected';
        reconnectTimeout = window.setTimeout(() => {
          reconnectAttempts++;
          connect();
        }, getReconnectDelay());
      };

      ws.onerror = () => {
        errorMessage.value = 'Connection error';
      };

      // Store reference for sending
      (window as any).__emojiWs = ws;
    };

    connect();

    cleanup(() => {
      isCleaningUp = true;
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', updateCanvasSize);
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.close(1000, 'Component unmounting');
      }
      delete (window as any).__emojiWs;
    });
  });

  const sendEmoji = $((emoji: string) => {
    const ws = (window as any).__emojiWs as WebSocket | undefined;
    if (!ws || connectionStatus.value !== 'connected') {
      errorMessage.value = 'Not connected';
      return;
    }
    try {
      ws.send(JSON.stringify({ action: 'sendEmoji', payload: { emoji, username: randomUsername.value } }));
      errorMessage.value = '';
    } catch {
      errorMessage.value = 'Failed to send emoji';
    }
  });

  const reconnect = $(() => {
    window.location.reload();
  });

  return (
    <div class="relative h-screen w-screen overflow-hidden bg-gray-950">
      {/* Canvas for emoji rendering - GPU accelerated */}
      <canvas
        ref={canvasRef}
        class="pointer-events-none fixed inset-0 h-full w-full"
        style={{ imageRendering: 'auto' }}
      />

      {/* Performance indicator */}
      <div class="fixed top-4 right-4 z-20 rounded-lg bg-gray-900/80 px-3 py-1.5 text-xs text-gray-400 backdrop-blur-sm">
        {activeCount.value} emojis
      </div>

      {/* Bottom Bar with Emoji Picker */}
      <div class="fixed right-0 bottom-0 left-0 z-10 border-t border-gray-800 bg-gray-900/95 backdrop-blur-sm">
        {/* Connection Status */}
        <div class="flex items-center justify-between border-b border-gray-800/50 px-4 py-2">
          <div class="flex items-center gap-2">
            <div
              class={[
                'h-2 w-2 rounded-full',
                connectionStatus.value === 'connected' && 'animate-pulse bg-green-500',
                connectionStatus.value === 'connecting' && 'animate-pulse bg-yellow-500',
                connectionStatus.value === 'disconnected' && 'bg-red-500',
              ]}
            />
            <span class="text-xs font-medium text-gray-400">
              {connectionStatus.value === 'connected'
                ? 'Connected'
                : connectionStatus.value === 'connecting'
                  ? 'Connecting...'
                  : 'Disconnected'}
            </span>
            {userCount.value > 0 && (
              <span class="text-xs text-gray-500">
                · {userCount.value} {userCount.value === 1 ? 'user' : 'users'} online
              </span>
            )}
          </div>
          {connectionStatus.value === 'disconnected' && (
            <button
              onClick$={reconnect}
              class="rounded-lg bg-blue-600 px-3 py-1 text-xs font-medium transition-colors hover:bg-blue-700"
            >
              Reconnect
            </button>
          )}
        </div>

        {/* Emoji Picker */}
        <div class="overflow-x-auto p-4">
          <div class="flex flex-wrap justify-center gap-2">
            {EMOJIS.map((emoji) => (
              <button
                key={emoji}
                onClick$={() => sendEmoji(emoji)}
                disabled={connectionStatus.value !== 'connected'}
                class={[
                  'rounded-xl p-3 text-3xl transition-all duration-200',
                  connectionStatus.value === 'connected'
                    ? 'hover:scale-125 hover:bg-gray-800/50 active:scale-95'
                    : 'cursor-not-allowed opacity-30',
                ]}
                title={connectionStatus.value !== 'connected' ? 'Waiting for connection...' : `Send ${emoji}`}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Error Message */}
      {errorMessage.value && (
        <div class="fixed top-16 left-1/2 z-10 -translate-x-1/2 rounded-lg bg-red-900/90 px-4 py-2 text-sm text-red-200 backdrop-blur-sm">
          {errorMessage.value}
        </div>
      )}
    </div>
  );
});

export const head: DocumentHead = {
  title: 'Emoji Reactions - bwmp.dev',
  meta: [
    {
      name: 'description',
      content:
        'Send emoji reactions in real-time across all connected clients using WebSockets. Watch as emojis float across the screen!',
    },
  ],
};
