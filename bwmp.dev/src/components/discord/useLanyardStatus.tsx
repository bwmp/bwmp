import { useSignal, useVisibleTask$ } from '@builder.io/qwik';
import { connectLanyardSocket, getLanyardData, type LanyardData } from '../../lib/discord';

export function useLanyardStatus(userId: string) {
  const status = useSignal<'online' | 'idle' | 'dnd' | 'offline' | null>(null);
  const connected = useSignal(false);
  const error = useSignal<string | null>(null);

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(async ({ cleanup }) => {
    let wsCleanup: (() => void) | null = null;

    // Initial fetch for immediate data
    try {
      const initialData = await getLanyardData(userId);
      if (initialData.success && initialData.data) {
        status.value = initialData.data.discord_status;
        connected.value = true;
        error.value = null;
      } else {
        error.value = initialData.error || 'Failed to fetch initial data';
      }
    } catch (err) {
      console.error('Failed to fetch initial Lanyard data:', err);
      error.value = 'Failed to fetch initial data';
    }

    // Connect to WebSocket for real-time updates
    wsCleanup = connectLanyardSocket(
      userId,
      (data: LanyardData) => {
        if (data.success && data.data) {
          status.value = data.data.discord_status;
          connected.value = true;
          error.value = null;
        } else {
          error.value = data.error || 'Connection error';
          connected.value = false;
        }
      },
      (errorMessage: string) => {
        error.value = errorMessage;
        connected.value = false;
      },
    );

    cleanup(() => {
      if (wsCleanup) {
        wsCleanup();
      }
    });
  });

  return {
    status,
    connected,
    error,
  };
}
