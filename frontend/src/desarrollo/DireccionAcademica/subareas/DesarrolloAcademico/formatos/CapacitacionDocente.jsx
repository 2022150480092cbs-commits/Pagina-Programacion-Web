import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useExport from '../../../../../hooks/useExport';
import { Typography } from '../../../../../components/generalStyle/StylesConfig';
import { fetchEvaluaciones, saveEvaluacion } from '../../../../../api/firebaseService';
import { useTableLogic } from '../../../../../hooks/useTableLogic';

import {
    BotonSincronizar,
    BotonAgregar,
    BotonLimpiar,
    BotonNuevaColumna
} from '../../../../../components/BotonesTablas';

const RecursosInformaticos = () => {
    const { periodoId } = useParams();
    const [datosServidores, setDatosServidores] = useState([]);
    const [datosConectividad, setDatosConectividad] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actualizando, setActualizando] = useState(false);

    const periodoActual = periodoId || "Septiembre 2025 – Febrero 2026";
    const { exportToPDF } = useExport();

    const colServidores = [
        { key: 'marca', label: 'MARCA' },
        { key: 'modelo', label: 'MODELO' },
        { key: 'plataforma', label: 'PLATAFORMA' },
        { key: 'arquitectura', label: 'ARQUITECTURA' },
        { key: 'procesador', label: 'PROCESADOR' },
        { key: 'memoria', label: 'CAPACIDAD MEMORIA' },
        { key: 'disco', label: 'CAPACIDAD DISCO' },
        { key: 'tipo', label: 'TIPO SERVIDOR' },
        { key: 'monitor', label: 'MONITOR' },
        { key: 'cache', label: 'CACHE' }
    ];

    const colConectividad = [
        { key: 'tipo', label: 'TIPO' },
        { key: 'marca', label: 'MARCA' },
        { key: 'modelo', label: 'MODELO' },
        { key: 'caracteristicas', label: 'CARACTERÍSTICAS' },
        { key: 'cantidad', label: 'CANTIDAD' }
    ];

    const generarEstructuraBase = () => {
        const serv = [
            { id: 'serv-h-joco', marca: 'TES JOCOTITLÁN', esSeparador: true },
            { id: 'serv-j-1', marca: '', modelo: '', plataforma: '', arquitectura: '', procesador: '', memoria: '', disco: '', tipo: '', monitor: '', cache: '' },
            { id: 'serv-h-acul', marca: 'EXTENSIÓN ACULCO', esSeparador: true },
            { id: 'serv-a-1', marca: '', modelo: '', plataforma: '', arquitectura: '', procesador: '', memoria: '', disco: '', tipo: '', monitor: '', cache: '' }
        ];
        const conect = [
            { id: 'con-h-joco', tipo: 'TES JOCOTITLÁN', esSeparador: true },
            { id: 'con-j-1', tipo: '', marca: '', modelo: '', caracteristicas: '', cantidad: '' },
            { id: 'con-h-acul', tipo: 'EXTENSIÓN ACULCO', esSeparador: true },
            { id: 'con-a-1', tipo: '', marca: '', modelo: '', caracteristicas: '', cantidad: '' }
        ];
        return { serv, conect };
    };

    // NAVEGACIÓN ENTRE CELDAS: Extraemos handleKeyDown para cada tabla
    const { handleKeyDown: navServ, handleBlurCell: blurServ } = useTableLogic(datosServidores, setDatosServidores, colServidores.length);
    const { handleKeyDown: navConect, handleBlurCell: blurConect } = useTableLogic(datosConectividad, setDatosConectividad, colConectividad.length);

    useEffect(() => {
        const cargarDatos = async () => {
            setLoading(true);
            try {
                const idDoc = `recursos-informaticos-${periodoActual}`;
                const res = await fetchEvaluaciones(idDoc, "centroComputo");
                const { serv, conect } = generarEstructuraBase();
                if (res && res.servidores) {
                    setDatosServidores(res.servidores);
                    setDatosConectividad(res.conectividad);
                } else {
                    setDatosServidores(serv);
                    setDatosConectividad(conect);
                }
            } catch (error) { console.error(error); }
            finally { setLoading(false); }
        };
        cargarDatos();
    }, [periodoActual]);

    const handleSincronizar = async () => {
        setActualizando(true);
        try {
            await saveEvaluacion({
                id: `recursos-informaticos-${periodoActual}`,
                servidores: datosServidores,
                conectividad: datosConectividad,
                periodo: periodoActual,
                subarea: "Recursos Informáticos"
            }, "centroComputo");
            alert("¡Sincronización exitosa!");
        } catch (e) { alert("Error al guardar."); }
        finally { setActualizando(false); }
    };

    if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>Cargando Recursos Informáticos...</div>;

    return (
        <div className="container" style={styles.mainContainer}>
            <style>{`
        @media print {
          @page { size: landscape; margin: 0.5cm; }
          .no-print { display: none !important; }
          #area-impresion { box-shadow: none !important; width: 100% !important; margin: 0 !important; }
          tr { page-break-inside: avoid; }
        }
        /* Estilo para resaltar la celda activa */
        td[contenteditable="true"]:focus { background-color: #fff9c4 !important; outline: 2px solid #00264D; }
        
        td[contenteditable="true"] {
          user-select: text;
          -webkit-user-modify: read-write-plaintext-only;
          word-break: break-word;
          white-space: normal;
        }
      `}</style>

            <div id="area-impresion" style={styles.pageWrapper}>
                <div style={styles.marginContent}>

                    <div style={styles.headerSection}>
                        <h2 style={styles.titlePrincipal}>LISTADO DE SERVIDORES</h2>
                        <p style={styles.subtitlePeriodo}>Periodo: {periodoActual}</p>
                        <div style={styles.divider} />
                    </div>

                    <div style={styles.tableContainer}>
                        <table style={styles.table}>
                            <thead>
                                <tr style={styles.trHeader}>
                                    {colServidores.map(col => <th key={col.key} style={styles.th}>{col.label}</th>)}
                                </tr>
                            </thead>
                            <tbody>
                                {datosServidores.map((fila, idx) => (
                                    <tr key={fila.id} style={{ backgroundColor: fila.esSeparador ? '#f2f2f2' : 'white' }}>
                                        {colServidores.map((col, colIdx) => (
                                            <td
                                                key={col.key}
                                                style={fila.esSeparador ? styles.tdSeparador : styles.td}
                                                contentEditable={!fila.esSeparador}
                                                suppressContentEditableWarning
                                                onKeyDown={(e) => !fila.esSeparador && navServ(e, idx, colIdx)} // Navegación activada
                                                onBlur={(e) => !fila.esSeparador && blurServ(idx, col.key, e.target.innerText.trim())}
                                                spellCheck="false"
                                            >
                                                {fila[col.key]}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div style={{ ...styles.headerSection, marginTop: '50px' }}>
                        <h2 style={styles.titlePrincipal}>DISPOSITIVOS DE CONECTIVIDAD</h2>
                        <div style={styles.divider} />
                    </div>

                    <div style={styles.tableContainer}>
                        <table style={styles.table}>
                            <thead>
                                <tr style={styles.trHeader}>
                                    {colConectividad.map(col => <th key={col.key} style={styles.th}>{col.label}</th>)}
                                </tr>
                            </thead>
                            <tbody>
                                {datosConectividad.map((fila, idx) => (
                                    <tr key={fila.id} style={{ backgroundColor: fila.esSeparador ? '#f2f2f2' : 'white' }}>
                                        {colConectividad.map((col, colIdx) => (
                                            <td
                                                key={col.key}
                                                style={fila.esSeparador ? styles.tdSeparador : styles.td}
                                                contentEditable={!fila.esSeparador}
                                                suppressContentEditableWarning
                                                onKeyDown={(e) => !fila.esSeparador && navConect(e, idx, colIdx)} // Navegación activada
                                                onBlur={(e) => !fila.esSeparador && blurConect(idx, col.key, e.target.innerText.trim())}
                                                spellCheck="false"
                                            >
                                                {fila[col.key]}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="no-print" style={styles.buttonContainer}>
                        <BotonLimpiar onClick={() => { if (window.confirm("¿Deseas limpiar las tablas?")) { const { serv, conect } = generarEstructuraBase(); setDatosServidores(serv); setDatosConectividad(conect); } }} />
                        <BotonNuevaColumna onClick={() => alert("Función para columnas adicionales")} />
                        <BotonAgregar onClick={() => setDatosConectividad([...datosConectividad, { id: Date.now(), tipo: '', marca: '', modelo: '', caracteristicas: '', cantidad: '' }])} />
                        <BotonSincronizar onClick={handleSincronizar} loading={actualizando} />
                    </div>

                </div>
            </div>
        </div>
    );
};

const styles = {
    mainContainer: { width: '100%', display: 'flex', justifyContent: 'center', backgroundColor: '#f5f5f5', padding: '20px 0' },
    pageWrapper: { backgroundColor: 'white', width: '98%', maxWidth: '1450px', margin: '0 auto', boxShadow: '0 0 15px rgba(0,0,0,0.1)' },
    marginContent: { padding: '30px 2%' },
    headerSection: { textAlign: 'center', marginBottom: '20px' },
    titlePrincipal: { fontSize: '1.4rem', fontWeight: 'bold', fontFamily: Typography.principal, color: '#000' },
    subtitlePeriodo: { fontSize: '1rem', color: '#333', marginTop: '5px' },
    divider: { height: '3px', backgroundColor: '#00264D', width: '100%', marginTop: '10px' },
    tableContainer: { border: '1px solid #ccc', borderRadius: '4px', overflow: 'hidden', width: '100%' },
    table: { width: '100%', borderCollapse: 'collapse' },
    trHeader: { backgroundColor: '#00264D', color: 'white' },
    th: { padding: '8px 4px', textAlign: 'center', fontSize: '0.6rem', border: '1px solid rgba(255,255,255,0.1)' },
    td: { padding: '8px', textAlign: 'center', fontSize: '0.7rem', border: '1px solid #eee', minWidth: '70px', outline: 'none' },
    tdSeparador: { padding: '10px', fontSize: '0.8rem', fontWeight: 'bold', textAlign: 'left', border: '1px solid #ccc' },
    buttonContainer: { display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '40px' }
};

export default RecursosInformaticos;