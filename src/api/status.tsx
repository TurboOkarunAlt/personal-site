import { createSignal, onMount, onCleanup } from "solid-js";
import { fetchDonations } from "../pages/support";

export interface PresenceData {
  discord_status: "online" | "idle" | "dnd" | "offline";
  track_name: string;
  artist_name: string;
  music_image: string;
  is_listening: boolean;
  music_start: number | null;
  game_name: string | null;
  game_image: string | null;
  is_gaming: boolean;
  game_start: number | null;
}

export interface Toast {
  id: number;
  title: string;
  message: string;
  image?: string;
  type: "music" | "game" | "status" | "donation";
}

const [status, setStatus] = createSignal<PresenceData>({
  discord_status: "offline",
  track_name: "Nothing playing",
  artist_name: "---",
  music_image: "",
  is_listening: false,
  music_start: null,
  game_name: null,
  game_image: null,
  is_gaming: false,
  game_start: null,
});

const [toasts, setToasts] = createSignal<Toast[]>([]);
const [lastDonationId, setLastDonationId] = createSignal<string | null>(null);

export const addToast = (toast: Omit<Toast, "id">) => {
  const id = Date.now();
  setToasts((prev) => [...prev, { ...toast, id }]);
  setTimeout(() => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, 5000);
};

export const useStatus = () => {
  onMount(() => {
    let socket: WebSocket;
    let isFirstPresenceLoad = true;

    const connect = () => {
      socket = new WebSocket(
        "wss://supertiger.nerimity.com/trackdispresence/1369228144325824593"
      );

      socket.onmessage = (event) => {
        try {
          const raw = JSON.parse(event.data);
          const activities = raw.activities || [];
          const music = activities.find((a: any) => a.type === 2);
          const game = activities.find((a: any) => a.type === 0);

          const current = status();

          if (!isFirstPresenceLoad) {
            if (
              music &&
              music.details !== current.track_name &&
              current.track_name !== "Nothing playing"
            ) {
              addToast({
                title: "Now Playing",
                message: `${music.details} — ${music.state}`,
                image: music.assets?.largeImageUrl,
                type: "music",
              });
            }

            if (game && game.name !== current.game_name) {
              addToast({
                title: "Started Playing",
                message: game.name,
                image: game.assets?.largeImageUrl,
                type: "game",
              });
            }
          }
          setStatus({
            discord_status: raw.status || "offline",
            track_name: music?.details || "Nothing playing",
            artist_name: music?.state || "---",
            music_image: music?.assets?.largeImageUrl || "",
            is_listening: !!music,
            music_start: music?.timestamps?.start || null,
            game_name: game?.name || null,
            game_image: game?.assets?.largeImageUrl || null,
            is_gaming: !!game,
            game_start: game?.timestamps?.start || null,
          });
          isFirstPresenceLoad = false;
        } catch (e) {
          console.error("Sync Error:", e);
        }
      };

      socket.onclose = () => {
        isFirstPresenceLoad = true;
        setTimeout(connect, 5000);
      };
    };

    connect();

    const checkDonations = async () => {
      const data = await fetchDonations();
      if (!data) return;

      if (data?.donations?.length > 0) {
        const latest = data.donations[0];
        const id = latest.createdAt;

        if (!lastDonationId()) {
          setLastDonationId(id);
          return;
        }

        if (id !== lastDonationId()) {
          setLastDonationId(id);
          addToast({
            title: "New Supporter",
            message: `${latest.username || "Anonymous"} just donated!`,
            type: "donation",
          });
        }
      }
    };

    const pollInterval = setInterval(checkDonations, 30000);
    checkDonations();

    onCleanup(() => {
      if (socket) socket.close();
      clearInterval(pollInterval);
    });
  });

  return { status, toasts };
};
