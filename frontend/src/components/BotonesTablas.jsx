// T:\Planeacion\frontend\src\components\BotonesTablas.jsx

import React from 'react';

const baseStyle = {
    display: 'flex',
    alignItems: 'center',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    fontFamily: 'inherit',
    color: 'white'
};

export const BotonSincronizar = ({ onClick, loading, label = "Guardar Datos" }) => (
    <button onClick={onClick} disabled={loading} style={{ ...baseStyle, backgroundColor: '#1c3170' }}>
        <span style={{ marginRight: '8px' }}>💾</span>
        {loading ? "Sincronizando..." : label}
    </button>
);

export const BotonAgregar = ({ onClick, label = "Agregar Fila" }) => (
    <button onClick={onClick} style={{ ...baseStyle, backgroundColor: '#1c3170' }}>
        <span style={{ marginRight: '8px', fontSize: '18px' }}>➕</span>
        {label}
    </button>
);

// NUEVO BOTÓN GRIS INSTITUCIONAL (#807E82)
export const BotonLimpiar = ({ onClick, label = "Limpiar Tabla" }) => (
    <button
        onClick={onClick}
        style={{ ...baseStyle, backgroundColor: '#1c3170' }}
        onMouseEnter={(e) => e.target.style.backgroundColor = '#1c3170'}
        onMouseLeave={(e) => e.target.style.backgroundColor = '#1c3170'}
    >
        <span style={{ marginRight: '8px' }}>🗑️</span>
        {label}
    </button>
);

export const BotonEliminar = ({ onClick }) => (
    <button
        onClick={onClick}
        className="no_imprimir_botones_ia"
        style={{
            background: '#ff4d4d', color: 'white', border: 'none', borderRadius: '50%',
            width: '24px', height: '24px', cursor: 'pointer', display: 'flex',
            alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold'
        }}
    >✕</button>
);

// T:\Planeacion\frontend\src\components\BotonesTablas.jsx

// ... (otros botones)
export const BotonNuevaColumna = ({ onClick }) => (
    <button
        onClick={onClick}
        style={{ ...baseStyle, backgroundColor: '#1c3170' }}
    >
        <span style={{ marginRight: '8px' }}>📊</span>
        Nueva Columna
    </button>
);