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
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(6);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const clickSound = new Howl({ src: ['./sounds/click.mp3'], volume: 0.06 });
  const openSound = new Howl({ src: ['./sounds/open.mp3'], volume: 0.06 });
  const closeSound = new Howl({ src: ['./sounds/close.mp3'], volume: 0.06 });

  const musicRef = useRef(null);

  useEffect(() => {
    musicRef.current = new Howl({
      src: ['./sounds/boba date.mp3'],
      loop: true,
      volume: volume / 100,
    });
    musicRef.current.play();
    return () => musicRef.current.stop();
  }, []);

  useEffect(() => {
    if (musicRef.current) musicRef.current.volume(volume / 100);
  }, [volume]);

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

  const pmdMainButton = "flex flex-col items-center gap-3 p-4 rounded-xl transition transform hover:scale-105 bg-[#1e3a5f] border-[4px] border-double border-[#f6c253] shadow-[0_4px_0_0_rgba(0,0,0,0.5)] active:translate-y-1 active:shadow-none";
  const pmdGridItem = "flex flex-col items-center gap-2 p-4 rounded-xl bg-[#1e3a5f] border-[4px] border-double border-[#f6c253] hover:bg-[#2b4c7e] hover:scale-105 transition shadow-[2px_4px_0_0_rgba(0,0,0,0.4)] w-full text-center";

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
      <div className="absolute top-4 left-4 z-10 bg-[#1e3a5f] border-4 border-double border-[#f6c253] rounded-xl shadow-[0_4px_0_0_rgba(0,0,0,0.4)] p-3 flex items-center gap-4">
        <button onClick={toggleSound} className="text-xl">{isMuted ? '🔇' : '🔊'}</button>
        <input 
          type="range" min="0" max="100" value={volume} 
          onChange={(e) => setVolume(e.target.value)} 
          className="w-20 md:w-24 accent-[#f6c253] cursor-pointer" 
        />
      </div>

      {/* 📜 PANEL CENTRAL */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-2xl bg-[#8b5e3c] border-[6px] border-double border-[#4a2e1b] rounded-3xl shadow-[0_12px_0_0_rgba(0,0,0,0.5)] overflow-hidden">
        <div className="bg-[#4a2e1b] px-6 py-3 border-b-4 border-[#331f12] font-black text-center tracking-widest"></div>
        <div className="p-8 flex flex-col items-center gap-8 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')]">
          <h1 className="text-4xl md:text-5xl font-black text-[#fef6e4] uppercase tracking-wider text-center drop-shadow-[2px_3px_0_rgba(0,0,0,0.8)]">
            Erasmus 2026
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
            <button onClick={() => openWindow('posts')} className={pmdMainButton}>
              <span className="text-5xl drop-shadow-md">🎒</span>
              <span className="text-xs font-bold text-[#f6c253] uppercase drop-shadow-[1px_1px_0_rgba(0,0,0,1)] text-center">Viaje</span>
            </button>
            <button onClick={() => openWindow('about')} className={pmdMainButton}>
              <span className="text-5xl drop-shadow-md">📜</span>
              <span className="text-xs font-bold text-[#f6c253] uppercase drop-shadow-[1px_1px_0_rgba(0,0,0,1)] text-center">Sobre mi</span>
            </button>
            <button onClick={() => openWindow('company')} className={pmdMainButton}>
              <span className="text-5xl drop-shadow-md">🏕️</span>
              <span className="text-xs font-bold text-[#f6c253] uppercase drop-shadow-[1px_1px_0_rgba(0,0,0,1)] text-center">Sobre la empresa</span>
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
              <div className="p-6 text-blue-50">
                <h2 className="text-2xl font-black text-[#f6c253] mb-4 drop-shadow-[1px_1px_0_rgba(0,0,0,1)] text-center">{about.name}</h2>
                <div className="bg-[#112240]/50 p-4 rounded-lg border border-[#3b5b43] italic leading-relaxed">
                  {about.description}
                </div>
              </div>
            )}

            {win.type === 'company' && (
              <div className="p-6 text-blue-50 space-y-4">
                <h2 className="text-2xl font-black text-[#f6c253] drop-shadow-[1px_1px_0_rgba(0,0,0,1)] text-center">{company.name}</h2>
                <div className="bg-[#112240]/50 p-4 rounded-lg border border-[#3b5b43]">
                  <p className="text-green-300 font-bold uppercase text-xs mb-2 tracking-widest">{company.role}</p>
                  <p className="mb-4 text-sm">{company.description}</p>
                  <h3 className="font-bold text-[#f6c253] text-sm mb-2">Misiones actuales:</h3>
                  <ul className="space-y-1">
                    {company.tasks?.map((t, i) => (
                      <li key={i} className="text-xs flex items-center gap-2">
                        <span className="text-[#f6c253]">•</span> {t}
                      </li>
                    ))}
                  </ul>
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