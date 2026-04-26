import { useState, useEffect } from 'react';

export default function PostDetail({ post, onBack, clickSound, openSound, closeSound }) {
  const [selectedImg, setSelectedImg] = useState(null);

  useEffect(() => {
    clickSound.play();
  }, [post, clickSound]);

  // 🚫 BLOQUEAR SCROLL GLOBAL
  useEffect(() => {
    if (selectedImg) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [selectedImg]);

  const allImages = post.images 
    ? (Array.isArray(post.images) ? post.images : [post.images]) 
    : (Array.isArray(post.image) ? post.image : post.image ? [post.image] : []);

  const hasImages = allImages.length > 0;

  return (
    <div className="flex flex-col h-full bg-[#1e3a5f] relative overflow-hidden">
      
      {/* HEADER */}
      <div className="flex justify-between items-center px-4 md:px-8 py-4 border-b-4 border-double border-[#f6c253] bg-[#1e3a5f] z-20 shrink-0">
        <h2 className="text-xl md:text-2xl font-black text-[#f6c253] uppercase tracking-wide truncate mr-4">
          {post.title}
        </h2>

        <button
          onClick={() => { closeSound.play(); onBack(); }}
          className="bg-[#f6c253] text-[#4a2e1b] text-xs font-black px-4 py-2 border-[3px] border-double border-[#4a2e1b] rounded-lg shadow active:translate-y-0.5 uppercase"
        >
          ← Volver
        </button>
      </div>

      {/* CONTENIDO */}
      <div className={`flex-1 px-4 md:px-8 pb-8 pt-4 space-y-6 ${selectedImg ? 'overflow-hidden' : 'overflow-y-auto'}`}>
        
        {/* INFO */}
        <div className="flex items-center gap-4 bg-[#112240]/60 p-3 rounded-lg border border-[#3b5b43]">
          <span className="text-5xl">{post.emoji}</span>
          <div>
            <p className="text-[#f6c253] text-xs font-bold uppercase">Fecha</p>
            <p className="text-blue-200 text-sm">{post.date}</p>
          </div>
        </div>

        {/* LAYOUT DINÁMICO */}
        <div className={`flex flex-col ${hasImages ? 'lg:flex-row gap-6' : ''}`}>
          
          {/* TEXTO */}
          <div className={`${hasImages ? 'flex-1 lg:max-w-[55%]' : 'w-full'}`}>
            <p className="text-blue-50 whitespace-pre-line leading-relaxed bg-[#112240]/30 p-4 rounded-xl h-full">
              {post.content || post.excerpt}
            </p>
          </div>

          {/* IMÁGENES */}
          {hasImages && (
            <div className="flex-1 lg:max-w-[45%]">
              <div className="flex flex-col gap-4">
                {allImages.map((img, index) => (
                  <div 
                    key={index}
                    className="group aspect-video overflow-hidden rounded-xl cursor-zoom-in border-4 border-double border-[#f6c253]"
                    onClick={() => {
                      clickSound.play();
                      openSound.play();
                      setSelectedImg(img);
                    }}
                  >
                    <img 
                      src={img} 
                      alt="" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* MODAL FULLSCREEN */}
      {selectedImg && (
        <div
          className="fixed inset-0 bg-black z-[999] flex items-center justify-center cursor-zoom-out"
          onClick={() => {
            closeSound.play();
            setSelectedImg(null);
          }}
        >
          <img
            src={selectedImg}
            alt="Fullscreen"
            className="w-full h-full object-contain"
          />

          {/* BOTÓN CERRAR */}
          <button 
            className="absolute top-6 right-6 bg-[#4a2e1b] text-[#f6c253] w-12 h-12 rounded-full border-4 border-double border-[#f6c253] text-xl"
            onClick={(e) => {
              e.stopPropagation();
              closeSound.play();
              setSelectedImg(null);
            }}
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}