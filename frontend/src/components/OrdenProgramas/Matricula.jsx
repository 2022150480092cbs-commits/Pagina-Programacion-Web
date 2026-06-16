import React from 'react';

// LISTA OFICIAL CENTRALIZADA (JOCOTITLÁN + ACULCO)
export const PROGRAMAS_OFICIALES = [
    /* --- JOCOTITLÁN (Escolarizada) --- */
    "INGENIERÍA ELECTROMECÁNICA",
    "INGENIERÍA INDUSTRIAL",
    "INGENIERÍA EN SISTEMAS COMPUTACIONALES",
    "INGENIERÍA MECATRÓNICA",
    "ARQUITECTURA",
    "CONTADOR PÚBLICO",
    "INGENIERÍA EN GESTIÓN EMPRESARIAL",
    "INGENIERÍA QUÍMICA",
    "INGENIERÍA EN MATERIALES",
    "INGENIERÍA EN ANIMACIÓN DIGITAL Y EFECTOS VISUALES",
    "LICENCIATURA EN TURISMO",
    "INGENIERÍA EN LOGÍSTICA",

    /* --- JOCOTITLÁN (No Escolarizada) --- */
    "INGENIERÍA INDUSTRIAL NO ESCOLARIZADA",

    /* --- POSGRADO --- */
    "MAESTRÍA EN INGENIERÍA",
    "MAESTRÍA EN INTELIGENCIA ARTIFICIAL",
    "DOCTORADO EN CIENCIAS DE LA INGENIERÍA",

    /* --- EXTENSIÓN ACULCO --- */
    "CONTADOR PÚBLICO (ACULCO)",
    "INGENIERÍA INDUSTRIAL (ACULCO)",
    "INGENIERÍA EN SISTEMAS COMPUTACIONALES (ACULCO)",
    "LICENCIATURA EN TURISMO (ACULCO)"
];

// Componente reutilizable tipo ComboBox
export const SelectPrograma = ({ value, onChange, programasExtra = [] }) => {
    const listaCompleta = [...PROGRAMAS_OFICIALES, ...programasExtra];

    return (
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            style={styles.select}
        >
            <option value="">Seleccione un Programa Académico...</option>
            {listaCompleta.map((prog, index) => (
                <option key={index} value={prog}>{prog}</option>
            ))}
        </select>
    );
};

const styles = {
    select: {
        width: '100%',
        padding: '5px',
        fontSize: '0.7rem',
        border: 'none',
        backgroundColor: 'transparent',
        cursor: 'pointer',
        outline: 'none',
        textTransform: 'uppercase'
    }
};