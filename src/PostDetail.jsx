import { useState, useEffect } from 'react';

export default function PostDetail({ post, onBack, clickSound }) {
  const [isImageOpen, setIsImageOpen] = useState(false);

  // Sonido al abrir la entrada
  useEffect(() => {
    clickSound.play();
  }, [post, clickSound]); // <- Dependencia 'post' asegura que suene al cambiar a otra entrada

  return (
    <div className="flex flex-col px-4 md:px-8"> {/* <- padding lateral agregado */}
      {/* Encabezado: título a la izquierda, botón volver a la derecha */}
      <div className="flex justify-between items-center mb-4 p-2 border-b border-slate-200">
        <h2 className="text-2xl font-black text-slate-900">{post.title}</h2>
        <button
          onClick={onBack}
          className="text-slate-400 hover:text-slate-900 text-sm font-bold px-3 py-1 bg-white border border-slate-200 rounded-full shadow-sm hover:scale-105 active:scale-95"
        >
          ← Volver
        </button>
      </div>

      {/* Contenido */}
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <span className="text-5xl">{post.emoji}</span>
          <p className="text-slate-500 text-sm font-medium">{post.date}</p> {/* estilo corregido */}
        </div>
        <p className="text-sm text-slate-600 whitespace-pre-line">{post.content || post.excerpt}</p>

        {post.image && (
          <div className="w-full h-64 md:h-96 overflow-hidden rounded-xl cursor-pointer">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover hover:scale-105 transition-transform"
              onClick={() => {
                clickSound.play();
                setIsImageOpen(true);
              }}
            />
          </div>
        )}
      </div>

      {/* Modal de imagen */}
      {isImageOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setIsImageOpen(false)}
        >
          <img
            src={post.image}
            alt={post.title}
            className="max-h-full max-w-full rounded-xl shadow-2xl cursor-auto"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}