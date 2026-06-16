import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Colors, Typography } from '../../../../components/generalStyle/StylesConfig';
// Importamos la base de datos desde tu archivo de configuración auth.js
import { db } from "../../../../api/auth";
import { doc, setDoc } from "firebase/firestore";

const PeriodoSelector = ({ tituloFormato, rutaBase }) => {
    const navigate = useNavigate();

    // Persistencia del ciclo en localStorage
    const [ciclo, setCiclo] = useState(localStorage.getItem('cicloEscolarSeleccionado') || "2026-2027");

    useEffect(() => {
        localStorage.setItem('cicloEscolarSeleccionado', ciclo);
    }, [ciclo]);

    // --- FUNCIÓN INTEGRADA PARA FIREBASE ---
    const guardarPeriodo = async (nuevoCiclo) => {
        try {
            // Guarda o actualiza el ciclo actual en la colección "configuracion"
            await setDoc(doc(db, "configuracion", "cicloActual"), {
                periodo: nuevoCiclo,
                ultimaActualizacion: new Date()
            });
            console.log("¡Ciclo guardado en Firebase!");
        } catch (error) {
            console.error("Error al guardar en Firebase:", error);
        }
    };

    const manejarNavegacion = (semestre) => {
        const [anioInicio, anioFin] = ciclo.split('-');
        let textoPeriodo = "";

        if (semestre === "periodo1") {
            textoPeriodo = `Septiembre ${anioInicio} – Febrero ${anioFin}`;
        } else {
            textoPeriodo = `Febrero ${anioFin} – Agosto ${anioFin}`;
        }

        navigate(`${rutaBase}/${encodeURIComponent(textoPeriodo)}`);
    };

    return (
        <div style={mainLayoutStyle}>
            <h2 style={{ color: Colors.institucional, marginBottom: '30px', fontWeight: 'bold' }}>
                {tituloFormato}
            </h2>
            
            <div style={containerCardStyle}>
                <h3 style={{ marginBottom: '20px', fontSize: '1.2rem', color: '#333', fontWeight: 'bold' }}>
                    ELEGIR PERIODO A CAPTURAR
                </h3>

                {/* SELECTOR DE CICLO */}
                <div style={cicloWrapperStyle}>
                    <label style={{ fontWeight: 'bold', color: 'white', marginRight: '10px' }}>Ciclo Escolar:</label>
                    <select 
                        value={ciclo} 
                        onChange={(e) => {
                            const valorSeleccionado = e.target.value;
                            setCiclo(valorSeleccionado);
                            guardarPeriodo(valorSeleccionado); // Ejecuta el guardado en Firebase al cambiar
                        }}
                        style={selectAnioStyle}
                    >
                        {/* Generamos los años dinámicamente desde 1998 hasta 2100 */}
                        {Array.from({ length: 2100 - 1998 + 1 }, (_, i) => {
                            const anioInicio = 1998 + i;
                            const anioFin = anioInicio + 1;
                            const valorCiclo = `${anioInicio}-${anioFin}`;
                            return (
                                <option key={valorCiclo} value={valorCiclo}>
                                    {valorCiclo}
                                </option>
                            );
                        })}
                    </select>
                </div>
                
                <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap', width: '100%' }}>
                    <button 
                        onClick={() => manejarNavegacion("periodo1")}
                        style={periodoButtonStyle}
                        onMouseOver={(e) => e.target.style.backgroundColor = '#0052a3'}
                        onMouseOut={(e) => e.target.style.backgroundColor = '#0066cc'}
                    >
                        Primer Semestre:<br/>Septiembre - Febrero
                    </button>

                    <button 
                        onClick={() => manejarNavegacion("periodo2")}
                        style={periodoButtonStyle}
                        onMouseOver={(e) => e.target.style.backgroundColor = '#0052a3'}
                        onMouseOut={(e) => e.target.style.backgroundColor = '#0066cc'}
                    >
                        Segundo Semestre:<br/>Febrero - Agosto
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- ESTILOS MANTENIDOS ---

const mainLayoutStyle = {
    textAlign: 'center', padding: '40px', fontFamily: Typography.principal, 
    backgroundColor: Colors.fondoGris, minHeight: '60vh',
    display: 'flex', flexDirection: 'column', alignItems: 'center'
};

const containerCardStyle = {
    backgroundColor: 'white', padding: '40px', borderRadius: '15px', 
    boxShadow: '0 8px 20px rgba(0,0,0,0.1)', maxWidth: '650px', width: '100%',
    display: 'flex', flexDirection: 'column', alignItems: 'center'
};

const cicloWrapperStyle = {
    backgroundColor: '#004080', 
    padding: '12px 25px',
    borderRadius: '10px',
    marginBottom: '30px',
    display: 'flex',
    alignItems: 'center',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    width: 'fit-content'
};

const selectAnioStyle = {
    padding: '5px 10px',
    borderRadius: '5px',
    border: 'none',
    fontWeight: 'bold',
    backgroundColor: 'white',
    color: '#004080',
    cursor: 'pointer',
    outline: 'none'
};

const periodoButtonStyle = {
    backgroundColor: '#0066cc',
    color: 'white',
    padding: '20px 30px',
    border: 'none',
    borderRadius: '8px',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'all 0.3s ease',
    lineHeight: '1.5',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    flex: '1',
    minWidth: '240px'
};

export default PeriodoSelector;