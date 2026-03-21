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
            <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 transition-opacity duration-200 ${isAnimatingOut ? 'opacity-0' : 'opacity-100'}`}>
            
            {/* Contenedor Estilo PMD (Azul oscuro con borde doble dorado) */}
            <div className={`w-full h-full max-w-md max-h-[90vh] bg-[#1e3a5f] rounded-xl shadow-[0_8px_0_0_rgba(0,0,0,0.5)] border-[6px] border-double border-[#f6c253] flex flex-col overflow-hidden transform transition-all duration-200 ${isAnimatingOut ? 'scale-95 opacity-0' : 'scale-100 opacity-100'}`}>
                
                {/* Header Estilo Menú RPG */}
                <div className="bg-[#112240] px-4 py-3 flex justify-between items-center border-b-4 border-[#f6c253]">
                <span className="text-sm font-black text-[#f6c253] uppercase tracking-widest drop-shadow-[1px_1px_0_rgba(0,0,0,1)]">
                    {title}
                </span>

                <button 
                    onClick={handleClose} 
                    className="text-[#f6c253] hover:text-[#ff5f56] text-xl font-black drop-shadow-[1px_1px_0_rgba(0,0,0,1)] transition-colors"
                >
                    ✕
                </button>
                </div>

                {/* Contenido */}
                <div className="flex-1 overflow-y-auto text-blue-50">
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
            className={`absolute z-50 min-w-88 max-w-136 w-full bg-[#1e3a5f] rounded-xl shadow-[0_8px_0_0_rgba(0,0,0,0.4)] border-[6px] border-double border-[#f6c253] overflow-hidden flex flex-col transform ${
                isAnimatingOut ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
            }`}
            style={{
                transition: isDragging 
                ? 'none' 
                : 'transform 0.18s ease, opacity 0.18s ease'
            }}
            >
            {/* Header Arrastrable Estilo RPG */}
            <div className="window-header bg-[#112240] px-4 py-3 flex justify-between items-center cursor-grab active:cursor-grabbing border-b-4 border-[#f6c253] select-none">
                
                <span className="text-sm font-black text-[#f6c253] uppercase tracking-widest drop-shadow-[1px_1px_0_rgba(0,0,0,1)]">
                {title}
                </span>

                <button 
                onClick={handleClose} 
                className="text-[#f6c253] hover:text-[#ff5f56] text-xl font-black px-1 drop-shadow-[1px_1px_0_rgba(0,0,0,1)] transition-colors"
                >
                ✕
                </button>
            </div>

            <div className="p-0 max-h-[70vh] overflow-y-auto bg-[#1e3a5f] text-blue-50">
                {children}
            </div>
            </div>
        </Draggable>
    );
};

export default Window;