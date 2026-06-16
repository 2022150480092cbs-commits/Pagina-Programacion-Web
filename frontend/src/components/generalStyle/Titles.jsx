import React from 'react';
import { Colors, Typography } from './StylesConfig';

/**
 * Componente universal para los encabezados de las tablas.
 * @param {string} title - El nombre del formato
 * @param {string} period - El periodo actual de captura
 * @param {string} tableLabel - El texto dentro de la franja azul de la tabla (opcional)
 */
export const MainHeader = ({ title, period, tableLabel }) => {
    return (
        <div style={styles.contentHeader} translate="no">
            <h2 style={styles.titlePrincipal}>{title}</h2>
            <p style={styles.subtitlePeriodo}>Periodo: {period}</p>
            <div style={styles.divider} />

            {/* Si pasas un tableLabel, genera la franja azul de encabezado de tabla automáticamente */}
            {tableLabel && (
                <div style={styles.tableHeaderBlue}>
                    {tableLabel}
                </div>
            )}
        </div>
    );
};

const styles = {
    contentHeader: {
        textAlign: 'center',
        marginBottom: '20px',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    titlePrincipal: {
        margin: '0',
        fontSize: '1.4rem',
        fontWeight: 'bold',
        fontFamily: Typography.principal,
        textTransform: 'uppercase'
    },
    subtitlePeriodo: {
        margin: '5px 0',
        fontSize: '1rem',
        color: '#333',
        fontFamily: Typography.principal
    },
    divider: {
        height: '3px',
        backgroundColor: Colors.barraTitulo || '#00264D',
        width: '100%',
        marginTop: '10px',
        marginBottom: tableLabel => tableLabel ? '0' : '20px' // Ajuste dinámico
    },
    tableHeaderBlue: {
        backgroundColor: Colors.barraTitulo || '#00264D',
        color: 'white',
        width: '100%',
        padding: '12px',
        fontSize: '0.9rem',
        fontWeight: 'bold',
        textAlign: 'center',
        textTransform: 'uppercase'
    }
};