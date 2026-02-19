import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Typography, Colors } from '../../../../components/generalStyle/StylesConfig';

const CentroComputoLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isCollapsed, setIsCollapsed] = useState(false);

    // Detectamos si estamos en una vista de captura (tabla o selector de periodo)
    useEffect(() => {
        const esVistaCaptura = location.pathname.includes('Septiembre') ||
            location.pathname.includes('Febrero') ||
            location.pathname.includes('periodo');
        setIsCollapsed(esVistaCaptura);
    }, [location]);

    const isActive = (path) => location.pathname.includes(path);

    const menuItems = [
        { nombre: "Líneas y aparatos Teléfonicos.", ruta: "aparatos-telefonicos" },
        { nombre: "Educación Especial", ruta: "educacion-especial" },
        { nombre: "Recursos Informáticos", ruta: "recursos-informaticos" },
        { nombre: "Telecomunicaciones Hardware", ruta: "telecomunicaciones-hardware" },
        { nombre: "Telecomunicaciones Software", ruta: "telecomunicaciones-software" }
    ];

    return (
        <div className="layout-container" style={{ display: 'flex', minHeight: '100vh', width: '100%' }}>

            {/* 🟦 SIDEBAR FLOTANTE (No empuja la tabla) */}
            <aside
                onMouseEnter={() => setIsCollapsed(false)}
                onMouseLeave={() => {
                    const esVistaCaptura = location.pathname.includes('Septiembre') || location.pathname.includes('Febrero');
                    if (esVistaCaptura) setIsCollapsed(true);
                }}
                style={{
                    ...sidebarBaseStyle,
                    width: isCollapsed ? '15px' : '280px', // Un poco más ancho para los nombres largos
                    padding: isCollapsed ? '0' : '25px 15px',
                    position: 'fixed', // Clave: Se queda fijo a la izquierda
                    transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
            >
                {isCollapsed && (
                    <div style={smallHandleStyle}>
                        <div style={{ width: '4px', height: '20px', backgroundColor: 'rgba(255,255,255,0.5)', borderRadius: '2px' }} />
                    </div>
                )}

                <div style={{
                    opacity: isCollapsed ? 0 : 1,
                    visibility: isCollapsed ? 'hidden' : 'visible',
                    transition: 'opacity 0.2s ease',
                    whiteSpace: 'nowrap'
                }}>
                    <h3 style={sidebarTitleStyle}>CENTRO DE CÓMPUTO</h3>
                    <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {menuItems.map((item, index) => (
                            <button
                                key={index}
                                onClick={() => navigate(item.ruta)}
                                style={{
                                    ...linkStyle,
                                    backgroundColor: isActive(item.ruta) ? 'rgba(255,255,255,0.15)' : 'transparent',
                                    borderLeft: isActive(item.ruta) ? `4px solid ${Colors.periodoActivo}` : '4px solid transparent'
                                }}
                            >
                                <span style={{ ...bulletStyle, backgroundColor: Colors.periodoActivo }}></span>
                                {item.nombre}
                            </button>
                        ))}
                    </nav>
                </div>
            </aside>

            {/* 📄 ÁREA PRINCIPAL CENTRADA (Como en tu imagen 124e5d) */}
            <main style={{
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center', // Centra horizontalmente el selector y la tabla
                justifyContent: 'flex-start',
                padding: '40px 20px',
                backgroundColor: '#f4f7f9',
                width: '100%',
                // Quitamos el marginLeft dinámico para que el centro sea el centro real de la pantalla
                marginLeft: '0'
            }}>
                <div style={{ width: '100%', maxWidth: '1200px', display: 'flex', justifyContent: 'center' }}>
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

// --- ESTILOS MEJORADOS ---
const sidebarBaseStyle = {
    top: '250px', // Bajamos un poco el inicio según image_124e04
    left: 0,
    backgroundColor: '#00264D',
    borderRadius: '0 12px 12px 0',
    zIndex: 9999, // Siempre por encima de todo
    boxShadow: '4px 0 10px rgba(0,0,0,0.1)',
    overflow: 'hidden'
};

const smallHandleStyle = {
    position: 'absolute',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer'
};

const sidebarTitleStyle = {
    color: 'rgba(255,255,255,0.5)',
    fontFamily: Typography.principal,
    fontSize: '0.75rem',
    fontWeight: '800',
    marginBottom: '20px',
    paddingLeft: '10px',
    letterSpacing: '1.5px'
};

const linkStyle = {
    color: 'white',
    fontFamily: Typography.principal,
    border: 'none',
    cursor: 'pointer',
    padding: '12px 15px',
    textAlign: 'left',
    borderRadius: '0 8px 8px 0',
    fontSize: '0.85rem',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    transition: 'all 0.2s ease'
};

const bulletStyle = { width: '8px', height: '14px', borderRadius: '2px', flexShrink: 0 };

export default CentroComputoLayout;