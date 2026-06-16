<<<<<<< HEAD
import React, { useState } from 'react';
import { auth } from '../api/firebaseService';
import { useAuth } from '../context/AuthContext';
import { Assets } from './generalStyle/StylesConfig';

const HEADER_IMG_SRC = "/assets/header-bg.png";

const Header = () => {
    // Escuchamos el estado global del AuthContext
    const { user: globalUser } = useAuth();
    const [showMenu, setShowMenu] = useState(false);

    // Definimos qué mostrar basándonos en el usuario global
    const displayName = globalUser ? (globalUser.displayName || globalUser.email.split('@')[0]) : 'Invitado';
    const photoURL = globalUser?.photoURL || Assets.avatarDefault;

    const handleAIClick = () => {
        window.dispatchEvent(new CustomEvent('extraer-ia-global'));
    };

    const handleDownloadClick = () => {
        window.dispatchEvent(new CustomEvent('descargar-pdf-global'));
    };

    const handleLogout = () => {
        auth.signOut();
    };

    return (
        <header style={{ position: 'relative', width: '100%', zIndex: 1000 }}>
            {/* Imagen de fondo institucional */}
            <img
                src={HEADER_IMG_SRC}
                alt="Fondo Institucional"
                style={{ width: '100%', display: 'block' }}
            />

            {/* Contenedor de Botones y Perfil */}
            <div style={{
                position: 'absolute',
                top: '50%',
                right: '20px',
                transform: 'translateY(-50%)',
                display: 'flex',
                gap: '15px',
                alignItems: 'center',
                zIndex: 1005
            }}>

                {/* BOTÓN ASISTENTE IA */}
                <div
                    title="Asistente IA"
                    onClick={handleAIClick}
                    style={buttonStyle('linear-gradient(135deg, #1c3170 0%, #2d88ff 100%)')}
                >
                    <svg width="20" height="20" fill="white" viewBox="0 0 16 16">
                        <path d="M9.5 2.672a.5.5 0 1 0 1 0V.843a.5.5 0 0 0-1 0v1.829Zm4.5.035a.5.5 0 0 0-.853-.354l-1.293 1.293a.5.5 0 0 0 .707.707l1.293-1.293a.5.5 0 0 0 .146-.353Zm-7 1.15a.5.5 0 0 0-.707 0L5.001 5.15a.5.5 0 0 0 .707.707l1.293-1.292a.5.5 0 0 0 0-.708ZM13.293 11.293a.5.5 0 0 1 .707.707l-1.293 1.293a.5.5 0 0 1-.707-.707l1.293-1.293ZM2.672 9.5a.5.5 0 0 1 0 1h-1.83a.5.5 0 0 1 0-1h1.83Zm.035-4.5a.5.5 0 0 1 .354.853l-1.293 1.293a.5.5 0 0 1-.707-.707l1.293-1.293a.5.5 0 0 1 .353-.146Z" />
                        <path d="M8 12.25A4.25 4.25 0 1 0 8 3.75a4.25 4.25 0 0 0 0 8.5Z" />
                    </svg>
                </div>

                {/* BOTÓN DESCARGA */}
                <div
                    title="Descargar Formatos"
                    onClick={handleDownloadClick}
                    style={buttonStyle('#1c3170')}
                >
                    <svg width="20" height="20" fill="white" viewBox="0 0 16 16">
                        <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"></path>
                        <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"></path>
                    </svg>
                </div>

                {/* PERFIL DE USUARIO ENLAZADO Y DINÁMICO */}
                <div
                    onClick={() => setShowMenu(!showMenu)}
                    style={{ position: 'relative', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}
                >
                    <div style={{ textAlign: 'right', color: 'white', lineHeight: '1' }}>
                        {/* Muestra "Hola [Nombre]" si está logueado, o "Invitado" */}
                        <span style={{ fontSize: '12px', fontWeight: 'bold', display: 'block' }}>
                            {globalUser ? `Hola, ${displayName}` : displayName}
                        </span>
                        <span style={{ fontSize: '10px', opacity: '0.8' }}>
                            {globalUser ? 'En línea' : 'Desconectado'}
                        </span>
                    </div>
                    <img
                        src={photoURL}
                        alt="Avatar"
                        style={{ width: '40px', height: '40px', borderRadius: '50%', border: '2px solid white', objectFit: 'cover' }}
                    />

                    {/* Menú Desplegable */}
                    {showMenu && (
                        <div style={menuStyle}>
                            <div style={{ padding: '10px', borderBottom: '1px solid #eee', fontWeight: 'bold', color: '#1c3170' }}>
                                {displayName}
                            </div>
                            <div style={menuItemStyle}>⚙️ Configuración</div>
                            {globalUser && (
                                <div onClick={handleLogout} style={{ ...menuItemStyle, color: 'red' }}>🚪 Cerrar Sesión</div>
                            )}
                        </div>
                    )}
                </div>

            </div>
        </header>
    );
};

// Estilos estáticos se quedan exactamente igual abajo...
const buttonStyle = (bg) => ({
    width: '38px',
    height: '38px',
    background: bg,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    border: '2px solid white',
    boxShadow: '0px 2px 6px rgba(0,0,0,0.3)',
    pointerEvents: 'auto'
});

const menuStyle = {
    position: 'absolute',
    top: '50px',
    right: '0',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0px 4px 12px rgba(0,0,0,0.15)',
    width: '180px',
    overflow: 'hidden',
    zIndex: 1010
};

const menuItemStyle = {
    padding: '10px',
    fontSize: '14px',
    color: '#333',
    cursor: 'pointer',
    transition: 'background 0.2s',
};

=======
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

>>>>>>> 7f1ff6d3021cbcb1e9200bb55217ff084971735e
export default Header;