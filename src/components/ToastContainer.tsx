import { For, Show } from 'solid-js';
import { useStatus } from '../api/status';

export default function ToastContainer() {
  const { toasts } = useStatus();

  return (
    <div class="fixed top-8 right-8 z-[100] flex flex-col gap-3 pointer-events-none w-80">
      <For each={toasts()}>
        {(toast) => (
          <div class="pointer-events-auto animate-toast-in bg-[#12121A]/90 backdrop-blur-xl border border-[#2A2A3A] p-4 rounded-2xl shadow-2xl flex items-center gap-4 group">
            <Show when={toast.image} fallback={
              <div class={`w-12 h-12 rounded-xl flex items-center justify-center ${
                toast.type === 'donation' ? 'bg-pink-500/10' : 'bg-[#6A00FF]/10'
              }`}>
                <span class={`material-icons ${
                  toast.type === 'donation' ? 'text-pink-500' : 'text-[#6A00FF]'
                }`}>
                  {toast.type === 'music' ? 'music_note' : 
                   toast.type === 'donation' ? 'favorite' : 'sports_esports'}
                </span>
              </div>
            }>
              <img src={toast.image} class="w-12 h-12 rounded-xl object-cover border border-[#2A2A3A]" />
            </Show>
            
            <div class="flex-1 min-w-0">
              <div class={`text-[10px] font-black uppercase tracking-widest mb-0.5 ${
                toast.type === 'donation' ? 'text-pink-500' : 'text-[#6A00FF]'
              }`}>
                {toast.title}
              </div>
              <div class="text-xs font-bold text-white truncate">{toast.message}</div>
            </div>

            <style>{`
              @keyframes toast-in {
                from { transform: translateX(100%) scale(0.9); opacity: 0; }
                to { transform: translateX(0) scale(1); opacity: 1; }
              }
              .animate-toast-in {
                animation: toast-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
              }
            `}</style>
          </div>
        )}
      </For>
    </div>
  );
}