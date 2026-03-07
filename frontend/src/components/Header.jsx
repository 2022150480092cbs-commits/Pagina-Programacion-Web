// frontend/src/components/Header.jsx

import React from 'react';

// Las rutas de las imágenes deben apuntar a la carpeta 'public'
const HEADER_IMG_SRC = "/assets/header-bg.png"; // Imagen principal del encabezado
const LOGO_MINI_SRC = "/assets/tesjo-logo.png";  // Logo pequeño de la esquina
const FOOTER_IMG_SRC = "/assets/pagg.png";
/**
 * Componente Header reutilizable que se inserta en Layout.jsx.
 * Hereda los estilos globales definidos en GlobalStyles.jsx.
 */
const Header = () => {
    return (
        <header className="top-bar" style={{ position: 'relative', zIndex: 1000 }}>
            {/* Imagen de fondo base */}
            <img src={HEADER_IMG_SRC} alt="Fondo del Encabezado" className="encabezado-img" style={{ width: '100%', display: 'block' }} />

            {/* Contenido superpuesto */}
            <div
                className="header-content-overlay"
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0 20px',
                    boxSizing: 'border-box',
                    pointerEvents: 'none' // IMPORTANTE: Esto permite que los clics pasen a través del overlay hacia los inputs
                }}
            >

            </div>
        </header>
    );
};

export default Header;