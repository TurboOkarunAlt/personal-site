import { type Component } from 'solid-js';

const Footer: Component = () => {
  return (
    <div class="w-full bg-[#0B0B12] border-t border-[#2A2A3A]/40 pb-[calc(env(safe-area-inset-bottom)+100px)] md:pb-8">
      <div class="max-w-6xl mx-auto px-8">
        <footer class="w-full h-24 flex flex-col md:flex-row justify-between items-center py-6 md:py-0">
          <div class="flex items-center gap-3">
            <p class="text-[10px] text-[#7A7A90] uppercase tracking-[0.2em]">
              Designed by <span class="text-white font-bold">Asraye</span> &copy; 2025
            </p>
          </div>
          <div class="flex items-center gap-6">
             <a href="https://github.com/Asraye/personal-site" class="text-[10px] font-bold uppercase tracking-widest text-[#7A7A90] hover:text-white transition-colors">Source</a>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Footer;