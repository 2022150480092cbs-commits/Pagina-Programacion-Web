import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Colors, Assets, Typography } from '../components/generalStyle/StylesConfig';
import ChatIA from '../components/generalStyle/ChatIA';

const MainLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [showMenu, setShowMenu] = useState(false);
    const [showDownloads, setShowDownloads] = useState(false);
    const [showChatIA, setShowChatIA] = useState(false);

    const esVistaDeTabla = location.pathname.includes('Septiembre') ||
        location.pathname.includes('Febrero') ||
        location.pathname.includes('periodo');

    const esPaginaPrincipal = location.pathname === '/' || location.pathname === '/inicio';
    const mostrarNavegacionFija = !esPaginaPrincipal;

    const procesarConsultaIA = (texto) => {
        const consulta = texto.toLowerCase();
        if (consulta.includes('evaluación docente') || consulta.includes('docente')) {
            const periodo = "Septiembre 2025 – Febrero 2026";
            setShowChatIA(false);
            const rutaDestino = `/dashboard/direccion-academica/desarrollo-academico/evaluacion-docente/${encodeURIComponent(periodo)}`;
            navigate(rutaDestino);
        } else {
            alert("🤖 Lo siento, Cris. Aún estoy aprendiendo a buscar ese formato.");
        }
    };

    return (
        <div style={{
            display: 'flex', flexDirection: 'column', minHeight: '335mm',
            fontFamily: Typography.principal, backgroundColor: Colors.fondoGris,
            position: 'relative'
        }}>
            
            {/* 💡 ESTE BLOQUE ES LA SOLUCIÓN DEFINITIVA 💡 */}
            <style>
                {`
                    @media print {
                        /* Escondemos el header y el título del Layout solo al imprimir */
                        .header-layout-oficial, 
                        .titulo-layout-oficial,
                        footer {
                            display: none !important;
                        }
                    }
                `}
            </style>

            {/* Agregamos la clase 'header-layout-oficial' */}
            <header className="header-layout-oficial" style={{ width: '100%', margin: 0, padding: 0, backgroundColor: Colors.institucional }}>
                <img src={Assets.header} alt="Encabezado TESJO" style={{ width: '100%', display: 'block', objectFit: 'cover' }} />
            </header>

            <div style={{
                width: '100%', backgroundColor: Colors.secundario || '#00264D',
                height: '60px', display: 'flex', alignItems: 'center',
                justifyContent: 'center', padding: '0 30px',
                color: Colors.textoBlanco, boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                position: 'relative', zIndex: 1000
            }}>
                {/* Agregamos la clase 'titulo-layout-oficial' */}
                <h1 className="titulo-layout-oficial" style={{ fontSize: '1.2rem', fontWeight: 'bold', margin: 0, textAlign: 'center', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    Tecnológico de Estudios Superiores de Jocotitlán
                </h1>

                <div style={{ position: 'absolute', right: '40px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                    {esVistaDeTabla && (
                        <div
                            style={{ position: 'relative' }}
                            onMouseEnter={() => setShowDownloads(true)}
                            onMouseLeave={() => setShowDownloads(false)}
                        >
                            <div style={actionButtonStyle} title="Descargar Formatos">
                                <svg width="22" height="22" fill="white" viewBox="0 0 16 16">
                                    <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z" />
                                    <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z" />
                                </svg>
                            </div>
                            {showDownloads && (
                                <div style={dropdownMenuStyle}>
                                    <button style={menuOptionStyle} onClick={() => window.dispatchEvent(new Event('descargar-pdf-global'))}>📄 Descargar PDF</button>
                                    <button style={menuOptionStyle} onClick={() => window.dispatchEvent(new Event('descargar-excel-global'))}>📊 Descargar Excel</button>
                                </div>
                            )}
                        </div>
                    )}

                    <div
                        onClick={() => setShowChatIA(!showChatIA)}
                        style={{ ...actionButtonStyle, background: 'linear-gradient(135deg, #1c3170 0%, #2d88ff 100%)', position: 'relative' }}
                        title="Asistente IA"
                    >
                        <img src={Assets.iconIA} alt="IA" style={{ width: '22px', height: '22px' }} />

                        {showChatIA && (
                            <ChatIA
                                onClose={(e) => {
                                    if (e) e.stopPropagation();
                                    setShowChatIA(false);
                                }}
                                onQuery={procesarConsultaIA}
                            />
                        )}
                    </div>

                    <div
                        style={{ position: 'relative' }}
                        onMouseEnter={() => setShowMenu(true)}
                        onMouseLeave={() => setShowMenu(false)}
                    >
                        <div style={profileCircleStyle}>
                            <img src={Assets.avatarDefault} alt="User" style={{ width: '100%', borderRadius: '50%' }} />
                            <div style={onlineStatusStyle} />
                        </div>
                        {showMenu && (
                            <div style={dropdownMenuStyle}>
                                <strong style={{ color: Colors.institucional, fontSize: '14px', display: 'block', marginBottom: '5px' }}>
                                    Cristian Bautista
                                </strong>
                                <button style={menuOptionStyle}>⚙️ Configuración</button>
                                <button onClick={() => navigate('/')} style={{ ...menuOptionStyle, color: 'red' }}>↪️ Cerrar Sesión</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <main style={{ flexGrow: 1, padding: '40px 20px', display: 'flex', justifyContent: 'center' }}>
                <div style={{ width: '100%', maxWidth: '1100px' }}>
                    <Outlet />
                </div>
            </main>

            {mostrarNavegacionFija && (
                <div style={fixedNavContainerStyle}>
                    <button onClick={() => navigate(-1)} style={navButtonStyle} title="Regresar">
                        <svg width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z" />
                        </svg>
                    </button>
                    <button onClick={() => navigate(1)} style={navButtonStyle} title="Siguiente">
                        <svg width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z" />
                        </svg>
                    </button>
                </div>
            )}

            <footer style={{ width: '100%', marginTop: 'auto' }}>
                <div style={{ backgroundColor: Colors.institucional, color: 'white', textAlign: 'center', padding: '10px 0', fontSize: '0.8rem' }}>
                    © Copyright 2025 TecNM - Todos los Derechos Reservados
                </div>
                <img src={Assets.footer} alt="Footer" style={{ width: '100%', display: 'block' }} />
            </footer>
        </div>
    );
};

const actionButtonStyle = { width: '40px', height: '40px', backgroundColor: '#1c3170', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: '2px solid white', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' };
const profileCircleStyle = { width: '40px', height: '40px', cursor: 'pointer', position: 'relative', backgroundColor: 'white', borderRadius: '50%', border: '2px solid #1c3170' };
const onlineStatusStyle = { position: 'absolute', bottom: '1px', right: '1px', width: '11px', height: '11px', backgroundColor: '#31a24c', border: '2px solid white', borderRadius: '50%' };
const dropdownMenuStyle = { position: 'absolute', top: '40px', right: '0', width: '200px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 8px 24px rgba(0,0,0,0.15)', padding: '15px', zIndex: 3000 };
const menuOptionStyle = { width: '100%', padding: '10px', textAlign: 'left', border: 'none', backgroundColor: 'transparent', cursor: 'pointer', borderRadius: '6px', fontSize: '14px' };
const fixedNavContainerStyle = { position: 'fixed', bottom: '90px', right: '40px', display: 'flex', gap: '15px', zIndex: 2000 };
const navButtonStyle = { backgroundColor: 'white', border: '1px solid #ddd', borderRadius: '8px', width: '45px', height: '45px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.15)', color: '#00264D', transition: 'all 0.2s ease' };

export default MainLayout;