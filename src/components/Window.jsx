import { useRef, useState, useEffect } from 'react';
import Draggable from 'react-draggable';

const Window = ({ title, children, onClose, isOpen }) => {
    const nodeRef = useRef(null);

    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [shouldRender, setShouldRender] = useState(isOpen);
    const [isAnimatingOut, setIsAnimatingOut] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    // Responsive
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Control mount/unmount con animación
    useEffect(() => {
        if (isOpen) {
            setShouldRender(true);
            setIsAnimatingOut(false);
        } else if (shouldRender) {
            setIsAnimatingOut(true);
            setTimeout(() => setShouldRender(false), 180);
        }
    }, [isOpen]);

    if (!shouldRender) return null;

    const handleClose = () => onClose();

    // 📱 MÓVIL (animación OK aquí siempre)
    if (isMobile) {
        return (
            <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4 transition-opacity duration-200 ${isAnimatingOut ? 'opacity-0' : 'opacity-100'}`}>
            
            <div className={`w-full h-full max-w-md max-h-[90vh] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden transform transition-all duration-200 ${isAnimatingOut ? 'scale-95 opacity-0' : 'scale-100 opacity-100'}`}>
                
                <div className="bg-slate-100 px-4 py-3 flex justify-between items-center border-b border-slate-200">
                <span className="text-xs font-bold text-slate-500 uppercase">
                    {title}
                </span>

                <button 
                    onClick={handleClose} 
                    className="text-slate-400 hover:text-red-500 text-lg font-bold"
                >
                    ✕
                </button>
                </div>

                <div className="flex-1 overflow-y-auto">
                {children}
                </div>

            </div>
            </div>
        );
    }

    // 🖥️ DESKTOP (drag limpio + animaciones controladas)
    return (
        <Draggable 
            handle=".window-header"
            bounds="parent"
            nodeRef={nodeRef}
            defaultPosition={{ x: 200, y: 80 }}
            onStart={() => setIsDragging(true)}
            onStop={() => setIsDragging(false)}
        >
            <div 
            ref={nodeRef}
            className={`absolute z-50 min-w-87.5 max-w-137.5 w-full bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col transform ${
                isAnimatingOut ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
            }`}
            style={{
                transition: isDragging 
                ? 'none' // 🔥 CLAVE: sin animación al arrastrar
                : 'transform 0.18s ease, opacity 0.18s ease'
            }}
            >
            <div className="window-header bg-slate-100 px-4 py-2 flex justify-between items-center cursor-grab active:cursor-grabbing border-b border-slate-200 select-none">
                
                <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
                <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
                <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
                </div>

                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                {title}
                </span>

                <button 
                onClick={handleClose} 
                className="text-slate-400 hover:text-red-500 font-bold px-1"
                >
                ✕
                </button>
            </div>

            <div className="p-0 max-h-[70vh] overflow-y-auto bg-white">
                {children}
            </div>
            </div>
        </Draggable>
    );
};

export default Window;