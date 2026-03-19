import { useState, useEffect } from 'react';
import './index.css';
import Window from './components/Window.jsx';
import posts from './data/entries.json';
import about from './data/about.json';
import PostDetail from './PostDetail.jsx';
import { Howl } from 'howler';

function MainPage() {
  const [isWindowOpen, setIsWindowOpen] = useState(false);
  const [currentView, setCurrentView] = useState('grid'); // 'grid' | 'detail' | 'about'
  const [activePost, setActivePost] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Sonidos
  const clickSound = new Howl({ src: ['/sounds/click.mp3'], volume: 0.5 });
  const openSound = new Howl({ src: ['/sounds/open.mp3'], volume: 0.5 });
  const closeSound = new Howl({ src: ['/sounds/close.mp3'], volume: 0.5 });

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const openFolder = () => {
    clickSound.play();
    if (isWindowOpen && currentView === 'grid') {
      closeSound.play();
      setIsWindowOpen(false);
    } else {
      openSound.play();
      setCurrentView('grid');
      setIsWindowOpen(true);
    }
  };

  const openAbout = () => {
    clickSound.play();
    if (isWindowOpen && currentView === 'about') {
      closeSound.play();
      setIsWindowOpen(false);
    } else {
      openSound.play();
      setCurrentView('about');
      setIsWindowOpen(true);
    }
  };

  const showDetail = (post) => {
    clickSound.play(); // <--- SONIDO directo al hacer click en la entrada
    setActivePost(post);
    setCurrentView('detail');
  };

  return (
    <div
      className="h-screen w-full bg-slate-100 relative overflow-hidden"
      style={{
        backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)',
        backgroundSize: '24px 24px',
      }}
    >
      {/* Rectángulo blanco central */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-xl bg-white rounded-3xl shadow-2xl">
        {/* Barra negra superior */}
        <div className="bg-black rounded-t-3xl px-6 py-3 text-white flex justify-start items-center select-none font-bold text-sm">
          Home
        </div>

        {/* Contenido del rectángulo */}
        <div className="p-6 md:p-10 flex flex-col items-center gap-6">
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 uppercase italic text-center">
            ERASMUS 2026
          </h1>

          <div
            className={`grid gap-6 w-full ${
              isMobile ? 'grid-cols-2' : 'grid-cols-2 md:grid-cols-2'
            } justify-center`}
          >
            {/* 📂 Erasmus */}
            <button
              onClick={() => { clickSound.play(); openFolder(); }}
              className="flex flex-col items-center gap-2 p-4 rounded-2xl transform transition-transform hover:scale-105 select-none"
            >
              <span className="text-5xl md:text-7xl">📂</span>
              <span className="text-xs font-bold text-slate-700 bg-white/90 px-3 py-1 rounded-full border border-slate-200">
                Erasmus 2026
              </span>
            </button>

            {/* 👤 Sobre mí */}
            <button
              onClick={() => { clickSound.play(); openAbout(); }}
              className="flex flex-col items-center gap-2 p-4 rounded-2xl transform transition-transform hover:scale-105 select-none"
            >
              <span className="text-5xl md:text-7xl">👤</span>
              <span className="text-xs font-bold text-slate-700 bg-white/90 px-3 py-1 rounded-full border border-slate-200">
                Sobre mí
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Ventana */}
      <Window
        isOpen={isWindowOpen}
        onClose={() => {
          closeSound.play();
          setIsWindowOpen(false);
        }}
        title={
          currentView === 'grid'
            ? 'Explorador de Archivos'
            : currentView === 'about'
            ? 'Sobre mí'
            : `Visualizador: ${activePost?.city}`
        }
      >
        <div className="min-h-75 relative">
          {currentView === 'grid' && (
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              {posts.map((post) => (
                <button
                  key={post.id}
                  onClick={() => {
                    showDetail(post);
                    openSound.play();
                  }}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl transform transition-transform hover:scale-110"
                >
                  <span className="text-5xl">{post.emoji}</span>
                  <span className="text-sm font-bold text-slate-700">{post.title}</span>
                  <span className="text-xs text-slate-500">{post.date}</span>
                </button>
              ))}
            </div>
          )}

          {currentView === 'about' && (
            <div className="p-6 md:p-8 space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-5xl">👤</span>
                <div>
                  <h2 className="text-2xl md:text-3xl font-black text-slate-900">{about.name}</h2>
                  <p className="text-slate-500 text-sm">{about.role}</p>
                </div>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed pt-4 border-t border-slate-100">
                {about.description}
              </p>
              <div className="pt-4">
                <p className="text-xs font-bold text-slate-400 uppercase mb-2">Intereses</p>
                <div className="flex flex-wrap gap-2">
                  {about.interests.map((item, index) => (
                    <span
                      key={index}
                      className="text-xs px-3 py-1 bg-slate-100 rounded-full border border-slate-200"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
              <p className="text-xs text-slate-400 pt-4 border-t border-slate-100">📍 {about.location}</p>
            </div>
          )}

          {currentView === 'detail' && activePost && (
            <PostDetail
              post={activePost}
              onBack={() => { closeSound.play(); setCurrentView('grid'); }}
              clickSound={clickSound}
            />
          )}
        </div>
      </Window>
    </div>
  );
}

export default MainPage;