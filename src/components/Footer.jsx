// src/components/Footer.jsx
import '../index.css';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-slate-50 border-t border-slate-200 mt-20">
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-center">
            <p className="text-slate-400 text-xs text-center">
                © {currentYear} Mi Estancia en Alemania. Todos los derechos reservados.
            </p>
            </div>
        </footer>
    );
};

export default Footer;