import { useState, useEffect } from 'react';

export default function PostDetail({ post, onBack, clickSound, openSound, closeSound }) {
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Detectar si es video o imagen
  const isVideo = (src) => {
    const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi', '.mkv'];
    return videoExtensions.some(ext => src.toLowerCase().includes(ext));
  };

  useEffect(() => {
    clickSound.play();
  }, [post, clickSound]);

  // 🚫 BLOQUEAR SCROLL GLOBAL
  useEffect(() => {
    if (selectedMedia) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [selectedMedia]);

  const allImages = post.images 
    ? (Array.isArray(post.images) ? post.images : [post.images]) 
    : (Array.isArray(post.image) ? post.image : post.image ? [post.image] : []);

  const hasImages = allImages.length > 0;

  return (
    <div className="flex flex-col h-full bg-[#1e3a5f] relative overflow-hidden">
      
      {/* HEADER */}
      <div className="flex justify-between items-center px-4 md:px-8 py-4 border-b-4 border-double border-[#f6c253] bg-[#1e3a5f] z-20 shrink-0">
        <div className="flex-1 min-w-0 flex items-center gap-3 mr-1 bg-[#112240]/60 p-3 rounded-lg border border-[#3b5b43]">
          <span className="text-4xl">{post.emoji}</span>
          <div className="min-w-0">
            <p className="text-[#f6c253] text-xs font-bold uppercase">Fecha</p>
            <p className="text-blue-200 text-sm truncate">{post.date}</p>
          </div>
        </div>

        <button
          onClick={() => { closeSound.play(); onBack(); }}
          className="bg-[#f6c253] text-[#4a2e1b] text-xs font-black px-4 py-2 border-[3px] border-double border-[#4a2e1b] rounded-lg shadow active:translate-y-0.5 uppercase cursor-pointer"
        >
          ← Volver
        </button>
      </div>

      {/* CONTENIDO */}
      <div className={`flex-1 px-4 md:px-8 pb-8 pt-4 space-y-6 ${selectedMedia ? 'overflow-hidden' : 'overflow-y-auto'}`}>

        {/* LAYOUT DINÁMICO */}
        <div className={`flex flex-col ${hasImages ? 'lg:flex-row gap-6' : ''}`}>
          
          {/* TEXTO */}
          <div className={`${hasImages ? 'flex-1 lg:max-w-[55%]' : 'w-full'}`}>
            <p className="text-blue-50 whitespace-pre-line leading-relaxed bg-[#112240]/30 p-4 rounded-xl h-full">
              {post.content || post.excerpt}
            </p>
          </div>

          {/* MEDIA (IMÁGENES Y VIDEOS) */}
          {hasImages && (
            <div className="flex-1 lg:max-w-[45%]">
              <div className="flex flex-col gap-4">
                {allImages.map((media, index) => (
                  <div 
                    key={index}
                    className="group aspect-video overflow-hidden rounded-xl cursor-zoom-in border-4 border-double border-[#f6c253] relative"
                    onClick={() => {
                      clickSound.play();
                      openSound.play();
                      setSelectedMedia(media);
                      setSelectedIndex(index);
                    }}
                  >
                    {isVideo(media) ? (
                      <>
                        <video 
                          src={media} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        {/* BOTÓN PLAY */}
                        <div className="absolute inset-0 flex items-center justify-center group-hover:bg-black/10 transition-colors">
                          <button className="w-16 h-16 bg-[#f6c253] rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform group-hover:scale-110">
                            <span className="text-3xl text-[#4a2e1b] ml-1">▶</span>
                          </button>
                        </div>
                      </>
                    ) : (
                      <img 
                        src={media} 
                        alt="" 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* MODAL FULLSCREEN */}
      {selectedMedia && (
        <div
          className="fixed inset-0 z-[999] bg-[#1e3a5f]/95 flex flex-col"
          onClick={() => {
            closeSound.play();
            setSelectedMedia(null);
          }}
        >
          <div
            className="relative flex h-full w-full flex-col overflow-hidden border-[6px] border-double border-[#f6c253] bg-[#112240] shadow-[0_16px_0_0_rgba(0,0,0,0.5)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-4 border-b-4 border-[#f6c253] bg-[#1e3a5f] px-4 py-3">
              <div className="flex items-center gap-2">
                {allImages.length > 1 && (
                  <>
                    <button
                      className="flex h-12 w-12 items-center justify-center rounded-full border-4 border-double border-[#f6c253] bg-[#1e3a5f] text-2xl text-[#f6c253] transition-colors hover:bg-[#f6c253] hover:text-[#1e3a5f] cursor-pointer"
                      onClick={() => {
                        clickSound.play();
                        const prevIndex = (selectedIndex - 1 + allImages.length) % allImages.length;
                        setSelectedIndex(prevIndex);
                        setSelectedMedia(allImages[prevIndex]);
                      }}
                    >
                      ‹
                    </button>
                    <button
                      className="flex h-12 w-12 items-center justify-center rounded-full border-4 border-double border-[#f6c253] bg-[#1e3a5f] text-2xl text-[#f6c253] transition-colors hover:bg-[#f6c253] hover:text-[#1e3a5f] cursor-pointer"
                      onClick={() => {
                        clickSound.play();
                        const nextIndex = (selectedIndex + 1) % allImages.length;
                        setSelectedIndex(nextIndex);
                        setSelectedMedia(allImages[nextIndex]);
                      }}
                    >
                      ›
                    </button>
                  </>
                )}
              </div>

              <button
                onClick={() => {
                  closeSound.play();
                  setSelectedMedia(null);
                }}
                className="rounded-full bg-[#f6c253] px-4 py-2 text-xs font-black uppercase tracking-widest text-[#4a2e1b] border-[3px] border-double border-[#4a2e1b] shadow cursor-pointer transition-colors hover:bg-[#e0b34c]"
              >
                ← Volver
              </button>
            </div>

            <div className="flex-1 bg-[#1e3a5f] flex items-center justify-center overflow-hidden">
              {isVideo(selectedMedia) ? (
                <video
                  src={selectedMedia}
                  alt="Fullscreen Video"
                  className="h-full w-full object-contain"
                  autoPlay
                  controls
                />
              ) : (
                <img
                  src={selectedMedia}
                  alt="Fullscreen"
                  className="h-full w-full object-contain"
                />
              )}
            </div>

            <div className="border-t-4 border-[#f6c253] bg-[#1e3a5f] px-4 py-3 text-right text-xs uppercase tracking-widest text-[#f6c253]">
              {allImages.length > 1 ? `${selectedIndex + 1} / ${allImages.length}` : 'Imagen'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}