// frontend/src/components/Footer.jsx

import React from 'react';

// La ruta debe incluir la carpeta /assets/ y el nombre real del archivo
const FOOTER_IMG_SRC = "/assets/pagg.png";

const Footer = () => {
    return (
        <footer className="footer" style={{ position: 'relative', width: '100%', zIndex: 10 }}>
            <div className="copyright-text" style={{ backgroundColor: '#1D2C57', color: 'white', textAlign: 'center', padding: '5px 0', fontSize: '0.8rem' }}>
                © Copyright 2025 TecNM - Todos los Derechos Reservados
            </div>
            <img src={FOOTER_IMG_SRC} alt="Pie de Página TESJO" className="footer-img" style={{ width: '100%', display: 'block' }} />
        </footer>
    );
};

export default Footer;