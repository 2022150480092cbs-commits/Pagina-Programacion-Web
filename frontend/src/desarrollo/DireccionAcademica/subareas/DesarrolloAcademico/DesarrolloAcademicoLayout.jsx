import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Typography, Colors } from '../../../../components/generalStyle/StylesConfig';

const DesarrolloAcademicoLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isCollapsed, setIsCollapsed] = useState(false);

    // Efecto para colapsar automáticamente en rutas de tablas/periodos
    useEffect(() => {
        const esTabla = location.pathname.includes('Septiembre') ||
            location.pathname.includes('Febrero') ||
            location.pathname.includes('periodo');
        setIsCollapsed(esTabla);
    }, [location]);

    const isActive = (path) => location.pathname.includes(path);

    return (
        <div className="layout-container" style={{ display: 'flex', minHeight: '335mm' }}>

            {/* 🟦 SIDEBAR INTELIGENTE (Fixed) */}
            <aside
                onMouseEnter={() => setIsCollapsed(false)}
                onMouseLeave={() => {
                    const esTabla = location.pathname.includes('Septiembre') || location.pathname.includes('Febrero');
                    if (esTabla) setIsCollapsed(true);
                }}
                style={{
                    ...sidebarBaseStyle,
                    left: 0,
                    width: isCollapsed ? '12px' : '260px',
                    padding: isCollapsed ? '0' : '20px 15px',
                    position: 'fixed',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
            >
                {/* TIRADOR VISUAL CUANDO ESTÁ COLAPSADO */}
                {isCollapsed && (
                    <div style={smallHandleStyle}>
                        <svg width="10" height="10" fill="white" viewBox="0 0 16 16">
                            <path d="M6 12.796V3.204L11.481 8 6 12.796zm.659.753 5.48-4.796a1 1 0 0 0 0-1.506L6.66 2.451C6.011 1.885 5 2.345 5 3.204v9.592a1 1 0 0 0 1.659.753z" />
                        </svg>
                    </div>
                )}

                {/* CONTENIDO DEL SIDEBAR */}
                <div style={{
                    opacity: isCollapsed ? 0 : 1,
                    visibility: isCollapsed ? 'hidden' : 'visible',
                    whiteSpace: 'nowrap',
                    transition: 'opacity 0.3s ease'
                }}>
                    <h3 style={sidebarTitleStyle}>FORMATOS DE CAPTURA</h3>
                    <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>

                        {/* 1. Evaluación Docente (Marcada como terminada) */}
                        <button
                            onClick={() => navigate('evaluacion-docente')}
                            style={{
                                ...linkStyle,
                                backgroundColor: isActive('evaluacion-docente') ? 'rgba(255,255,255,0.2)' : 'transparent'
                            }}
                        >
                            <span style={bulletStyle}></span>
                            Evaluación Docente.
                        </button>

                        {/* 2. Alumnos en Eventos Académicos */}
                        <button
                            onClick={() => navigate('alumnos-eventos-academicos')}
                            style={{
                                ...linkStyle,
                                backgroundColor: isActive('alumnos-eventos-academicos') ? 'rgba(255,255,255,0.2)' : 'transparent'
                            }}
                        >
                            <span style={bulletStyle}></span>
                            Estudiantes Eventos Académicos.
                        </button>

                        {/* 3. Capacitación Personal Docente */}
                        <button
                            onClick={() => navigate('capacitacion-personal-docente')}
                            style={{
                                ...linkStyle,
                                backgroundColor: isActive('capacitacion-personal-docente') ? 'rgba(255,255,255,0.2)' : 'transparent'
                            }}
                        >
                            <span style={bulletStyle}></span>
                            Capacitación Personal Docente.
                        </button>

                        {/* 4. Personal Docente que Estudia */}
                        <button
                            onClick={() => navigate('personal-docente-estudia')}
                            style={{
                                ...linkStyle,
                                backgroundColor: isActive('personal-docente-estudia') ? 'rgba(255,255,255,0.2)' : 'transparent'
                            }}
                        >
                            <span style={bulletStyle}></span>
                            Personal Docente que Estudia.
                        </button>

                        {/* 5. Estímulo al Desempeño Docente */}
                        <button
                            onClick={() => navigate('estimulo-desempeno-docente')} // <--- Quitamos el periodo de aquí
                            style={{
                                ...linkStyle,
                                backgroundColor: isActive('estimulo-desempeno-docente') ? 'rgba(255,255,255,0.2)' : 'transparent'
                            }}
                        >
                            <span style={bulletStyle}></span>
                            Estímulo al Desempeño Docente.
                        </button>

                        {/* 6. Tutorías */}
                        <button
                            onClick={() => navigate('tutorias')}
                            style={{
                                ...linkStyle,
                                backgroundColor: isActive('tutorias') ? 'rgba(255,255,255,0.2)' : 'transparent'
                            }}
                        >
                            <span style={bulletStyle}></span>
                            Tutorías.
                        </button>
                    </nav>
                </div>
            </aside>

            {/* 📄 ÁREA PRINCIPAL */}
            <main style={{
                flexGrow: 1,
                display: 'flex',
                justifyContent: 'center',
                padding: '40px 20px',
                width: '100%',
                backgroundColor: '#f4f7f9'
            }}>
                <div style={{ width: '100%', maxWidth: '1150px' }}>
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

// --- ESTILOS ---
const sidebarBaseStyle = {
    top: '250px',
    backgroundColor: '#00264D',
    borderRadius: '0 15px 15px 0',
    zIndex: 3000,
    boxShadow: '4px 0 15px rgba(0,0,0,0.2)',
    overflow: 'hidden'
};

const smallHandleStyle = {
    position: 'absolute',
    top: '50%',
    right: '0px',
    transform: 'translateY(-50%)',
    width: '12px',
    height: '60px',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: '10px 0 0 10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer'
};

const sidebarTitleStyle = {
    color: 'rgba(255,255,255,0.6)',
    fontSize: '0.7rem',
    fontWeight: 'bold',
    marginBottom: '20px',
    letterSpacing: '1px',
    textTransform: 'uppercase'
};

const linkStyle = {
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    padding: '12px 10px',
    textAlign: 'left',
    borderRadius: '10px',
    fontSize: '0.85rem',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    transition: 'background 0.2s ease'
};

const bulletStyle = {
    backgroundColor: '#ff66aa',
    width: '8px',
    height: '14px',
    borderRadius: '2px',
    flexShrink: 0
};

export default DesarrolloAcademicoLayout;