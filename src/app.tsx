import { type Component } from 'solid-js';
import Navbar from './components/navbar';
import Footer from './components/footer';
import ToastContainer from './components/ToastContainer';

const App: Component<{ children: any }> = (props) => {
  return (
    <div class="min-h-screen flex flex-col bg-[#0B0B12] text-white selection:bg-[#6A00FF]/40 font-['Inter',_sans-serif] relative overflow-x-hidden">
      <Navbar />
      <ToastContainer />
      <main class="flex-grow w-full max-w-6xl mx-auto px-8 pt-24 md:pt-44 pb-32 md:pb-20">
        {props.children}
      </main>
      <Footer />

      <div class="fixed top-[-5%] left-[-5%] w-[50%] h-[50%] bg-[#6A00FF]/10 blur-[150px] -z-10 pointer-events-none animate-pulse" />
      <div class="fixed bottom-[-5%] right-[-5%] w-[50%] h-[50%] bg-[#C3003C]/5 blur-[150px] -z-10 pointer-events-none" />
    </div>
  );
};

export default App;