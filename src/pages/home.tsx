import { createSignal, onMount, onCleanup, createMemo, For, Show } from 'solid-js';
import { useStatus } from '../api/status';
import MetaTitle from "../components/metaTitle";

interface BadgeProps {
  icon: string;
  label: string;
  value: string | number;
  color?: string;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

interface SocialLinkProps {
  icon: string;
  title: string;
  value: string;
  href: string;
  highlight?: boolean;
}


const ElapsedTimer = (props: { start: number | null }) => {
  const [elapsed, setElapsed] = createSignal("");

  const update = () => {
    if (!props.start) return;
    const diff = Math.floor((Date.now() - props.start) / 1000);
    const h = Math.floor(diff / 3600);
    const m = Math.floor((diff % 3600) / 60);
    const s = diff % 60;
    setElapsed(`${h > 0 ? h + ':' : ''}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`);
  };

  onMount(() => {
    update();
    const interval = setInterval(update, 1000);
    onCleanup(() => clearInterval(interval));
  });

  return <span>{elapsed()}</span>;
};

const InfoBadge = (props: BadgeProps) => (
  <div 
    onClick={props.onClick}
    onMouseEnter={props.onMouseEnter}
    onMouseLeave={props.onMouseLeave}
    class="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-[#12121A] border border-[#2A2A3A] hover:border-[#6A00FF]/50 transition-all duration-300 group cursor-default shadow-sm"
  >
    <div class="w-8 h-8 rounded-lg flex items-center justify-center bg-[#0B0B12] border border-[#2A2A3A] group-hover:border-[#6A00FF]/30 group-hover:bg-[#6A00FF]/5 transition-all">
      <span class={`material-icons text-[18px] ${props.color || 'text-[#7A7A90] group-hover:text-[#6A00FF]'}`}>
        {props.icon}
      </span>
    </div>
    <div class="flex flex-col leading-tight">
      <span class="text-[8px] font-black uppercase tracking-[0.15em] text-[#5A5A70]">{props.label}</span>
      <span class="text-[11px] font-bold text-white uppercase tracking-wider">{props.value}</span>
    </div>
  </div>
);

const SocialLink = (props: SocialLinkProps) => (
  <a 
    href={props.href} 
    target="_blank" 
    class={`group flex items-center p-5 rounded-3xl border transition-all duration-300 active:scale-[0.98] ${
      props.highlight 
        ? "bg-[#6A00FF]/5 border-[#6A00FF]/30 hover:border-[#6A00FF] hover:bg-[#6A00FF]/10" 
        : "bg-[#12121A]/40 border-[#2A2A3A] hover:border-[#7A7A90]/50 hover:bg-[#12121A]/60"
    }`}
  >
    <div class={`w-12 h-12 rounded-2xl flex items-center justify-center mr-4 transition-colors ${
      props.highlight ? "bg-[#6A00FF] text-white" : "bg-[#0B0B12] text-[#7A7A90] group-hover:text-white"
    }`}>
      <span class="material-icons text-xl">{props.icon}</span>
    </div>
    <div class="flex flex-col min-w-0">
      <span class="text-[9px] font-black uppercase tracking-widest text-[#7A7A90] group-hover:text-[#6A00FF] transition-colors">
        {props.title}
      </span>
      <span class="text-sm font-bold truncate text-white/90 group-hover:text-white">
        {props.value}
      </span>
    </div>
    <div class="ml-auto opacity-0 group-hover:opacity-100 transition-opacity pr-2">
      <span class="material-icons text-sm text-[#7A7A90]">north_east</span>
    </div>
  </a>
);

export default function Home() {
  const { status } = useStatus();  
  const [showBtt, setShowBtt] = createSignal(false);
  const [showBirthDate, setShowBirthDate] = createSignal(false);

  const BIRTH_DATE = '2007-07-22';
  const DISPLAY_DATE = '22/07/2007';

  const age = createMemo(() => {
    const birthDate = new Date(BIRTH_DATE);
    const today = new Date();
    let calculatedAge = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) calculatedAge--;
    return calculatedAge;
  });

  const statusTheme = createMemo(() => {
    const map = {
      online: { color: '#22c55e', class: 'animate-pulse shadow-green-500/20' },
      dnd:    { color: '#ef4444', class: 'shadow-red-500/20' },
      idle:   { color: '#eab308', class: 'shadow-yellow-500/20' },
      offline: { color: '#6b7280', class: 'opacity-50' }
    };
    return map[status().discord_status as keyof typeof map] || map.offline;
  });

  onMount(() => {
    const handleScroll = () => setShowBtt(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll, { passive: true });
    onCleanup(() => window.removeEventListener('scroll', handleScroll));
  });

  return (
    <div class="relative w-full text-white selection:bg-[#6A00FF] selection:text-white bg-[#0B0B12] min-h-screen">
      <MetaTitle title="Asraye | Home" />

      <button 
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        class={`fixed bottom-12 right-8 w-14 h-14 rounded-full bg-[#12121A]/80 backdrop-blur-xl border border-[#2A2A3A] items-center justify-center z-50 hover:border-[#6A00FF] transition-all duration-500 shadow-2xl hidden md:flex ${
          showBtt() ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'
        } group`}
      >
        <span class="material-icons text-[#7A7A90] group-hover:text-white group-hover:-translate-y-1 transition-transform">expand_less</span>
      </button>

      <div class="max-w-6xl mx-auto px-6 space-y-24 md:space-y-40 py-20">
        
        <section id="home" class="grid md:grid-cols-12 gap-8 md:gap-16 items-center">
          <div class="md:col-span-5 flex justify-center md:justify-start">
            <div class="relative w-52 h-52 md:w-72 md:h-72 flex items-center justify-center group">
              <svg class="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="48" fill="none" stroke="#1A1A24" stroke-width="2" />
                <circle 
                  cx="50" cy="50" r="48" fill="none" 
                  stroke={statusTheme().color} stroke-width="2.5" stroke-linecap="round"
                  class={`transition-all duration-1000 ${statusTheme().class}`}
                  style={{ 
                    "stroke-dasharray": "301.59", 
                    "stroke-dashoffset": status().discord_status === 'offline' ? "301.59" : "0",
                    "filter": `drop-shadow(0 0 8px ${statusTheme().color}66)` 
                  }}
                />
              </svg>

              <div class="relative w-[86%] h-[86%] rounded-full bg-[#0B0B12] p-1.5 border border-[#2A2A3A] overflow-hidden z-10 shadow-2xl">
                <div class="w-full h-full rounded-full overflow-hidden relative">
                    <img 
                      src="/assets/avatar.png" 
                      alt="Asraye" 
                      class="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                    />
                    <div class="absolute inset-0 bg-[#6A00FF]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              </div>

              <div class="absolute -bottom-2 px-3 py-1 bg-[#12121A] border border-[#2A2A3A] rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 z-20 shadow-2xl">
                 <span class="text-[9px] font-black uppercase tracking-[0.2em]" style={{ color: statusTheme().color }}>
                    {status().discord_status}
                 </span>
              </div>
            </div>
          </div>

          <div class="md:col-span-7 text-center md:text-left">
            <div class="inline-flex items-center gap-3 mb-6">
              <span class="px-3 py-1 rounded-full bg-[#6A00FF]/10 border border-[#6A00FF]/20 text-[9px] font-black tracking-[0.3em] text-[#6A00FF] uppercase">
                Certified Femboy
              </span>
            </div>
            
            <h1 class="text-6xl md:text-8xl font-black tracking-tighter mb-10 italic uppercase leading-[0.8]">
              Asraye<span class="text-[#6A00FF]">.</span>
            </h1>
            
            <div class="flex flex-wrap justify-center md:justify-start gap-3">
              <InfoBadge 
                icon="cake" label="Age" 
                value={showBirthDate() ? DISPLAY_DATE : `Age: ${age()}`}
                onMouseEnter={() => setShowBirthDate(true)}
                onMouseLeave={() => setShowBirthDate(false)}
                onClick={() => setShowBirthDate(!showBirthDate())}
              />
              
              <div class="group/flag flex items-center bg-[#12121A] border border-[#2A2A3A] rounded-2xl px-4 py-2.5 transition-all duration-300 hover:border-[#6A00FF]/50 shadow-sm">
                <img src="https://flagcdn.com/au.svg" class="w-5 h-3.5 object-cover rounded-sm mr-3 shadow-sm" alt="AU Flag" />
                <div class="flex flex-col leading-tight pr-1">
                  <span class="text-[8px] font-black uppercase tracking-[0.15em] text-[#5A5A70]">Region</span>
                  <span class="text-[11px] font-bold text-white uppercase tracking-wider group-hover/flag:text-[#6A00FF] transition-colors">Australia</span>
                </div>
              </div>

              <InfoBadge icon="male" label="Sex" value="Male" color="text-blue-400" />
              <InfoBadge icon="favorite" label="Sexuality" value="Bisexual" color="text-pink-400" />
              <InfoBadge icon="face" label="Pronouns" value="He / They" />
            </div>
          </div>
        </section>

        <section id="bio" class="grid lg:grid-cols-5 gap-16 md:gap-24">
          <div class="lg:col-span-3">
            <h2 class="text-[10px] uppercase tracking-[0.5em] font-black text-[#6A00FF] mb-10 flex items-center gap-4">
              Description <div class="h-[1px] w-12 bg-[#6A00FF]/30"></div>
            </h2>
            <p class="text-xl md:text-2xl text-[#7A7A90] leading-relaxed font-medium">
              Femboy and certified stupid.
            </p>
          </div>
          
          <div class="lg:col-span-2 space-y-6">
            <Show when={status().is_listening || status().is_gaming}>
               <h2 class="text-[10px] uppercase tracking-[0.5em] font-black text-[#7A7A90] mb-4">Presence</h2>
            </Show>
            
            <Show when={status().is_listening}>
                <div class="flex items-start gap-4 p-4 rounded-3xl bg-[#12121A]/40 border border-[#6A00FF]/30 shadow-lg group">
                  <div class="w-16 h-16 rounded-2xl bg-[#0B0B12] border border-[#2A2A3A] flex items-center justify-center flex-shrink-0 overflow-hidden relative shadow-2xl">
                      <img src={status().music_image} class="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-500" referrerpolicy="no-referrer" />
                  </div>
                  <div class="min-w-0 flex-1">
                      <div class="flex items-center justify-between mb-1">
                        <div class="text-[9px] font-black uppercase tracking-widest text-[#6A00FF]">Now Playing</div>
                        <div class="flex gap-0.5 items-end h-2">
                            <div class="w-0.5 h-full bg-[#6A00FF] animate-[bounce_1s_infinite]" />
                            <div class="w-0.5 h-2/3 bg-[#6A00FF] animate-[bounce_1.2s_infinite]" />
                            <div class="w-0.5 h-full bg-[#6A00FF] animate-[bounce_0.8s_infinite]" />
                        </div>
                      </div>
                      <div class="text-sm font-bold text-white truncate leading-tight">{status().track_name}</div>
                      <div class="text-[11px] text-[#7A7A90] font-medium truncate italic mt-0.5">{status().artist_name}</div>
                  </div>
                </div>
            </Show>

            <Show when={status().is_gaming}>
                <div class="flex items-center gap-4 p-4 rounded-3xl bg-[#12121A] border border-[#2A2A3A] hover:border-[#6A00FF]/40 transition-all group shadow-lg">
                    <div class="w-12 h-12 rounded-xl overflow-hidden border border-[#2A2A3A] shadow-inner">
                        <img src={status().game_image || ''} class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div class="min-w-0 flex-1">
                        <div class="flex items-center gap-2 mb-0.5">
                            <div class="text-[9px] font-black text-[#6A00FF] uppercase tracking-[0.2em]">Playing Now</div>
                            <span class="w-1 h-1 rounded-full bg-green-500 animate-pulse" />
                        </div>
                        <div class="text-sm font-bold text-white uppercase italic tracking-tighter leading-tight truncate">{status().game_name}</div>
                        <div class="text-[10px] text-[#7A7A90] mt-1 font-mono uppercase tracking-tighter">
                            for <ElapsedTimer start={status().game_start} />
                        </div>
                    </div>
                </div>
            </Show>
          </div>
        </section>

        <section id="links" class="pb-32">
          <div class="flex items-center gap-4 mb-10">
            <h2 class="text-[10px] uppercase tracking-[0.5em] font-black text-[#7A7A90]">Links</h2>
            <div class="h-[1px] flex-1 bg-gradient-to-r from-[#2A2A3A] to-transparent"></div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SocialLink icon="forum" title="Nerimity" value="Join Solace" href="https://nerimity.com/i/solace" highlight={true} />
            <SocialLink icon="code" title="GitHub" value="@Asraye" href="https://github.com/Asraye" />
            <SocialLink icon="play_circle" title="YouTube" value="@Asrayee" href="https://www.youtube.com/@Asrayee" />
            <SocialLink icon="speaker_notes" title="BlueSky" value="asraye.bsky.social" href="https://bsky.app/profile/asraye.bsky.social" />
          </div>
        </section>
      </div>
    </div>
  );
}