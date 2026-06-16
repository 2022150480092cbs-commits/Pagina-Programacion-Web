// /frontend/src/components/Layout.jsx

import React from 'react';
import GlobalStyles from './GlobalStyles';  // ✅ Estilos globales
import Header from './Header';              // ✅ Encabezado general
import Footer from './Footer';              // ✅ Pie de página

// Puedes definir aquí rutas de imágenes globales si las usa tu Header/Footer
const LOGO_IMG_SRC = "/assets/tesjo-logo.png";

/**
 * Componente Layout general.
 * Se utiliza para envolver las páginas principales del sistema (Home, Dashboard, Registro, etc.)
 * Incluye Header, Footer y los estilos globales.
 */
const Layout = ({ children }) => {
    return (
        <div className="app-container" style={{ position: 'relative' }}>
            <GlobalStyles />

            {/* Header con prioridad de capa controlada */}
            <Header logoSrc={LOGO_IMG_SRC} />

            <main
                className="main-content-area full-width-page app-main-content"
                style={{ 
                    minHeight: 'calc(100vh - 150px)', 
                    paddingBottom: '70px',
                    position: 'relative', 
                    zIndex: 1 // Asegura que esté en un plano inferior al Header pero accesible
                }}
            >
                {children}
            </main>

            <Footer />
        </div>
    );
};

export default Layout;
