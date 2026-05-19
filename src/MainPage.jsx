import { useState, useEffect, useRef } from 'react';
import './index.css';
import Window from './components/Window.jsx';
import posts from './data/entries.json';
import about from './data/about.json';
import company from './data/company.json';
import PostDetail from './PostDetail.jsx';
import { Howl } from 'howler';

function MainPage() {
  const [windows, setWindows] = useState([]);
  const [isMuted, setIsMuted] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const clickSound = new Howl({ src: ['./sounds/click.mp3'], volume: 0.06 });
  const openSound = new Howl({ src: ['./sounds/open.mp3'], volume: 0.06 });
  const closeSound = new Howl({ src: ['./sounds/close.mp3'], volume: 0.06 });

  const musicRef = useRef(null);

  useEffect(() => {
    musicRef.current = new Howl({
      src: ['./sounds/boba date.mp3'],
      loop: true,
      volume: 0.06,
    });
    return () => musicRef.current.stop();
  }, []);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSound = () => {
    if (!musicRef.current) return;
    isMuted ? musicRef.current.play() : musicRef.current.pause();
    setIsMuted(!isMuted);
  };

  const openWindow = (type, data = null) => {
    clickSound.play();
    openSound.play();

    const newWindow = {
      id: Date.now(),
      type,
      data,
    };

    setWindows((prev) => [...prev, newWindow]);
  };

  const closeWindow = (id) => {
    closeSound.play();
    setWindows((prev) => prev.filter((w) => w.id !== id));
  };

  const pmdMainButton = "flex flex-col items-center justify-center gap-1 p-2 rounded-xl w-24 h-24 min-w-[6rem] min-h-[6rem] transition-transform transform hover:scale-105 hover:brightness-110 bg-[#1e3a5f] border-[4px] border-double border-[#f6c253] shadow-[0_4px_0_0_rgba(0,0,0,0.5)] active:translate-y-1 active:shadow-none cursor-pointer";
  const pmdGridItem = "flex flex-col items-center gap-2 p-4 rounded-xl bg-[#1e3a5f] border-[4px] border-double border-[#f6c253] hover:bg-[#2b4c7e] hover:scale-105 transition shadow-[2px_4px_0_0_rgba(0,0,0,0.4)] w-full text-center cursor-pointer";

  return (
    <div
      className="h-screen w-full relative overflow-hidden"
      style={{
        backgroundColor: '#3b5b43',
        backgroundImage: 'radial-gradient(#2c4432 2px, transparent 2px)',
        backgroundSize: '24px 24px',
      }}
    >
      {/* 🎵 CONTROLES (Ahora con z-10 para que las ventanas z-50 queden arriba) */}
      <div className={`absolute top-4 left-4 z-10 bg-[#1e3a5f] border-4 border-double border-[#f6c253] rounded-xl shadow-[0_4px_0_0_rgba(0,0,0,0.4)] p-2 flex items-center justify-center transition-all duration-300 ${isMuted ? 'hover:shadow-[0_6px_0_0_rgba(0,0,0,0.6)]' : 'shadow-[0_4px_0_0_rgba(246,194,83,0.5)] hover:shadow-[0_6px_0_0_rgba(246,194,83,0.7)]'}`}>
        <button onClick={toggleSound} className={`text-2xl relative w-9 h-9 flex items-center justify-center transition-all duration-300 cursor-pointer ${isMuted ? 'opacity-60' : 'opacity-100 scale-110'}`}>
          <span className="transition-transform duration-300 inline-block">🎵</span>
          {isMuted && <span className="absolute text-3xl animate-pulse">🚫</span>}
        </button>
      </div>

      {/* 📜 PANEL CENTRAL */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-sm md:w-[55%] md:max-w-2xl lg:w-[48%] lg:max-w-xl xl:w-[42%] bg-[#8b5e3c] border-[6px] border-double border-[#4a2e1b] rounded-3xl shadow-[0_12px_0_0_rgba(0,0,0,0.5)] overflow-hidden md:top-auto md:left-1/2 md:translate-y-0 md:mt-20 md:mb-20">
        <div className="bg-[#4a2e1b] px-6 py-3 border-b-4 border-[#331f12] font-black text-center tracking-widest"></div>
        <div className="p-8 flex flex-col items-center gap-8 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')]">
          <h1 className="text-4xl md:text-5xl font-black text-[#fef6e4] uppercase tracking-wider text-center drop-shadow-[2px_3px_0_rgba(0,0,0,0.8)]">
            Erasmus 2026
          </h1>
          <div className="flex flex-col sm:flex-row md:flex-row items-center justify-center gap-4 md:gap-6 w-full">
            <button onClick={() => openWindow('posts')} className={pmdMainButton}>
              <span className="text-5xl drop-shadow-md">🎒</span>
              <span className="text-[11px] font-bold text-[#f6c253] uppercase drop-shadow-[1px_1px_0_rgba(0,0,0,1)] text-center leading-tight mt-1">Viaje</span>
            </button>
            <button onClick={() => openWindow('about')} className={pmdMainButton}>
              <span className="text-5xl drop-shadow-md">📜</span>
              <span className="text-[11px] font-bold text-[#f6c253] uppercase drop-shadow-[1px_1px_0_rgba(0,0,0,1)] text-center leading-tight mt-1">Sobre mi</span>
            </button>
            <button onClick={() => openWindow('company')} className={pmdMainButton}>
              <span className="text-5xl drop-shadow-md">🏕️</span>
              <span className="text-[11px] font-bold text-[#f6c253] uppercase drop-shadow-[1px_1px_0_rgba(0,0,0,1)] text-center leading-tight mt-1">Sobre la empresa</span>
            </button>
          </div>
        </div>
      </div>

      {/* 🪟 RENDER DE MÚLTIPLES VENTANAS */}
      {windows.map((win) => (
        <Window
          key={win.id}
          isOpen={true}
          onClose={() => closeWindow(win.id)}
          title={
            win.type === 'posts' ? 'Viaje' :
            win.type === 'about' ? 'Sobre mi' :
            win.type === 'company' ? 'Sobre la empresa' :
            win.data?.title // Título del post individual si es 'detail'
          }
        >
          <div className="min-h-50">
            {win.type === 'posts' && (
              <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                {posts.map((post) => (
                  <button
                    key={post.id}
                    onClick={() => openWindow('detail', post)}
                    className={pmdGridItem}
                  >
                    <span className="text-4xl">{post.emoji}</span>
                    <span className="text-sm font-black text-[#f6c253] uppercase tracking-wide drop-shadow-[1px_1px_0_rgba(0,0,0,1)]">{post.title}</span>
                    {/* 📅 FECHA AÑADIDA AQUÍ */}
                    <span className="text-[10px] font-bold text-blue-300 mt-1 uppercase tracking-tighter opacity-80">
                      {post.date}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {win.type === 'about' && (
              <div className="p-4 text-blue-50">
                <h2 className="text-2xl font-black text-[#f6c253] mb-4 drop-shadow-[1px_1px_0_rgba(0,0,0,0.8)] text-center">{about.name}</h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-[1.7fr_1.3fr]">
                  <div className="bg-[#1e3a5f] border-[4px] border-double border-[#f6c253] rounded-3xl shadow-[2px_4px_0_0_rgba(0,0,0,0.4)] p-5 flex flex-col gap-4">
                    <p className="text-sm leading-relaxed">{about.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {about.interests?.map((interest, index) => (
                        <span key={index} className="text-[11px] font-black uppercase tracking-[0.16em] text-[#f6c253] bg-[#112240] px-3 py-1 rounded-full border border-[#3b5b43] shadow-[0_2px_0_0_rgba(0,0,0,0.35)]">
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="bg-[#1e3a5f] border-[4px] border-double border-[#f6c253] rounded-3xl shadow-[2px_4px_0_0_rgba(0,0,0,0.4)] overflow-hidden">
                    {about.photo ? (
                      <img src={about.photo} alt={`${about.name} photo`} className="w-full h-96 object-cover" />
                    ) : (
                      <div className="w-full h-96 bg-[#2b4c7e] flex items-center justify-center text-base">Foto</div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {win.type === 'company' && (
              <div className="p-4 text-blue-50">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-[1.25fr_0.95fr]">
                  <div className="bg-[#1e3a5f] border-[4px] border-double border-[#f6c253] rounded-3xl shadow-[2px_4px_0_0_rgba(0,0,0,0.4)] p-5">
                    <div className="flex items-center justify-center mb-4">
                      {company.logo ? (
                        <img src={company.logo} alt="Company logo" className="max-h-28 object-contain" />
                      ) : (
                        <h2 className="text-2xl font-black text-[#f6c253] drop-shadow-[1px_1px_0_rgba(0,0,0,0.8)] text-center">{company.name}</h2>
                      )}
                    </div>
                    <p className="text-green-300 font-bold uppercase text-xs mb-2 tracking-widest">{company.role}</p>
                    <p className="mb-4 text-sm leading-relaxed">{company.description}</p>
                  </div>
                  <div className="bg-[#1e3a5f] border-[4px] border-double border-[#f6c253] rounded-3xl shadow-[2px_4px_0_0_rgba(0,0,0,0.4)] p-5">
                    <h3 className="font-black text-[#f6c253] text-sm mb-3 uppercase tracking-[0.2em]">Misiones actuales</h3>
                    <ul className="space-y-3">
                      {company.tasks?.map((t, i) => (
                        <li key={i} className="text-sm text-blue-50 bg-[#112240]/80 rounded-2xl px-3 py-3 border border-[#3b5b43] shadow-[0_3px_0_0_rgba(0,0,0,0.25)]">
                          <span className="text-[#f6c253] mr-2">•</span>{t}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {win.type === 'detail' && (
              <PostDetail
                post={win.data}
                onBack={() => closeWindow(win.id)}
                clickSound={clickSound}
                openSound={openSound}   
                closeSound={closeSound}
              />
            )}
          </div>
        </Window>
      ))}
    </div>
  );
}

export default MainPage;