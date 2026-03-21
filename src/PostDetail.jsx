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
        
        <div className="flex items-center gap-4 bg-[#112240]/60 p-3 rounded-lg border border-[#3b5b43]">
          <span className="text-5xl">{post.emoji}</span>
          <div>
            <p className="text-[#f6c253] text-xs font-bold uppercase">Fecha</p>
            <p className="text-blue-200 text-sm">{post.date}</p>
          </div>
        </div>

        <p className="text-blue-50 whitespace-pre-line leading-relaxed bg-[#112240]/30 p-4 rounded-xl">
          {post.content || post.excerpt}
        </p>

        {/* IMÁGENES */}
        {allImages.length > 0 && (
          <div className={`grid gap-4 ${allImages.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
            {allImages.map((img, index) => (
              <div 
                key={index}
                className="group aspect-video overflow-hidden rounded-xl cursor-zoom-in border-4 border-double border-[#f6c253]"
                onClick={() => {
                  clickSound.play();
                  openSound.play(); // 🔊 abrir imagen
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
        )}
      </div>

      {/* MODAL */}
      {selectedImg && (
        <div
          className="absolute inset-0 bg-black/90 z-100 flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => {
            closeSound.play(); // 🔊 cerrar imagen
            setSelectedImg(null);
          }}
        >
          <div 
            className="relative bg-[#f6c253] p-1 rounded-lg border-[6px] border-double border-[#4a2e1b] max-w-[90%] max-h-[85%]"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImg}
              alt="Fullscreen"
              className="max-w-full max-h-[75vh] object-contain"
            />

            <button 
              className="absolute -top-4 -right-4 bg-[#4a2e1b] text-[#f6c253] w-10 h-10 rounded-full border-4 border-double border-[#f6c253]"
              onClick={() => {
                closeSound.play(); // 🔊 cerrar con botón
                setSelectedImg(null);
              }}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}