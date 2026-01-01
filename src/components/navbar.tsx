import { type Component } from 'solid-js';
import { A } from '@solidjs/router';

const Navbar: Component = () => {
  return (
    <>
      <nav class="hidden md:flex fixed top-0 z-[60] w-full justify-center pt-8 px-6 pointer-events-none">
        <div class="bg-[#12121A]/80 backdrop-blur-2xl border border-[#2A2A3A] px-4 py-3 rounded-[32px] flex items-center gap-2 shadow-2xl shadow-black/50 pointer-events-auto">
          
          <A href="/" class="group relative flex items-center justify-center ml-2 mr-4">
            <div class="relative w-10 h-10 rounded-2xl overflow-hidden border-2 border-[#2A2A3A] group-hover:border-[#6A00FF] transition-all duration-500 shadow-lg">
              <img 
                src="/assets/avatar.png" 
                alt="Home" 
                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
              />
            </div>
            <div class="absolute inset-0 rounded-2xl bg-[#6A00FF]/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
          </A>

          <ul class="flex items-center gap-2 pr-2">
            <li><NavLink href="/">Home</NavLink></li>
            <li><NavLink href="/support">Support</NavLink></li>
          </ul>
        </div>
      </nav>

      <nav class="md:hidden fixed bottom-6 left-6 right-6 h-20 bg-[#12121A]/90 backdrop-blur-xl border border-[#2A2A3A] z-[100] rounded-[2.5rem] flex items-center justify-around px-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        <MobileNavLink href="/" icon="home" label="Home" />
        <MobileNavLink href="/support" icon="favorite" label="Support" />
      </nav>
    </>
  );
};

const NavLink = (props: { href: string, children: any }) => (
  <A 
    href={props.href} 
    activeClass="text-white bg-[#6A00FF]/20 border-[#6A00FF]/40 shadow-[0_0_30px_rgba(106,0,255,0.15)]"
    inactiveClass="text-[#7A7A90] border-transparent hover:text-white hover:bg-white/5"
    class="px-6 py-2.5 rounded-2xl text-[12px] font-black uppercase tracking-widest border transition-all duration-300 no-underline block"
    end={true}
  >
    {props.children}
  </A>
);

const MobileNavLink = (props: { href: string, icon: string, label: string }) => (
  <A 
    href={props.href} 
    activeClass="text-[#6A00FF]" 
    inactiveClass="text-[#7A7A90]"
    class="flex flex-col items-center justify-center transition-all duration-300 no-underline px-4 h-full"
    end={true}
  >
    <span class="material-icons" style={{ "font-size": "24px" }}>
      {props.icon}
    </span>
    <span class="text-[9px] uppercase font-black tracking-widest mt-1">{props.label}</span>
  </A>
);

export default Navbar;