import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useExport from '../../../../../hooks/useExport';
import { Colors, Assets, Typography } from '../../../../../components/generalStyle/StylesConfig';
import { fetchEvaluaciones, saveEvaluacion } from '../../../../../api/firebaseService';
import { useTableLogic } from '../../../../../hooks/useTableLogic';

// HEREDAMOS LOS COMPONENTES REUTILIZABLES CENTRALIZADOS
import {
    BotonSincronizar,
    BotonAgregar,
    BotonLimpiar,
    BotonEliminar,
    BotonNuevaColumna
} from '../../../../../components/BotonesTablas';

const PersonalDocente = () => {
    const { periodoId } = useParams();
    const [datos, setDatos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actualizando, setActualizando] = useState(false);

    // ESTRUCTURA SEGÚN TU DISEÑO DE 11 COLUMNAS
    const [columnas, setColumnas] = useState([
        { key: 'nombre', label: 'NOMBRE' },
        { key: 'sexo', label: 'SEXO' },
        { key: 'nivel', label: 'NIVEL QUE ESTUDIA (ESPECIALIDAD, MAESTRÍA, DOCTORADO)' },
        { key: 'lugar', label: 'LUGAR DONDE ESTUDIA MÉXICO (ENTIDAD FEDERATIVA), PAÍS' },
        { key: 'beca', label: 'BECA' },
        { key: 'duracion', label: 'DURACIÓN' },
        { key: 'periodo', label: 'PERIODO (INICIO - TERMINO)' },
        { key: 'tipo_curso', label: 'TIPO DE CURSO (FORMACIÓN, SUPERACIÓN, ACTUALIZACIÓN)' },
        { key: 'discapacidad', label: 'CON DISCAPACIDAD' },
        { key: 'hablantes', label: 'HABLANTES DE LENGUAJES INDÍGENAS' },
        { key: 'programa', label: 'PROGRAMA ACADÉMICO' }
    ]);

    const { exportToPDF, exportToExcel } = useExport();
    const periodoActual = periodoId || "Septiembre 2025 – Febrero 2026";

    // ACTIVACIÓN AUTOMÁTICA DE FORMATO HORIZONTAL
    const esHorizontal = columnas.length > 8;

    const { handleKeyDown, handleBlurCell } = useTableLogic(datos, setDatos, columnas.length);

    useEffect(() => {
        // ENLAZADO AL FORMATO DE IMPRESIÓN PDF HORIZONTAL
        const handlePDF = () => exportToPDF(
            'area-oficial-impresion',
            `Personal Docente que Estudia - ${periodoActual}`,
            'l' // Forzamos 'Landscape' en el hook
        );

        const handleExcel = () => exportToExcel(datos, `Personal Docente que Estudia - ${periodoActual}`);
        window.addEventListener('descargar-pdf-global', handlePDF);
        window.addEventListener('descargar-excel-global', handleExcel);
        return () => {
            window.removeEventListener('descargar-pdf-global', handlePDF);
            window.removeEventListener('descargar-excel-global', handleExcel);
        };
    }, [datos, periodoActual, esHorizontal]);

    useEffect(() => {
        const cargarDatos = async () => {
            setLoading(true);
            try {
                const idDoc = `personal-docente-estudia-${periodoActual}`;
                const registros = await fetchEvaluaciones(idDoc);
                if (registros && registros.registros) {
                    setDatos(registros.registros);
                } else {
                    const filaInicial = { id: Date.now() };
                    columnas.forEach(col => filaInicial[col.key] = '');
                    setDatos([filaInicial]);
                }
            } catch (error) { console.error(error); }
            finally { setLoading(false); }
        };
        cargarDatos();
    }, [periodoActual]);

    // --- ACCIONES REUTILIZABLES ---
    const agregarFila = () => {
        const nuevaFila = { id: Date.now() };
        columnas.forEach(col => nuevaFila[col.key] = '');
        setDatos([...datos, nuevaFila]);
    };

    const eliminarFila = (id) => {
        if (datos.length > 1) setDatos(datos.filter(f => f.id !== id));
    };

    const handleLimpiarTabla = () => {
        if (window.confirm("¿Deseas vaciar la tabla de personal docente?")) {
            const filaLimpia = { id: Date.now() };
            columnas.forEach(col => filaLimpia[col.key] = '');
            setDatos([filaLimpia]);
        }
    };

    const handleAgregarColumna = () => {
        const nombre = prompt("Ingrese el nombre de la nueva columna:");
        if (nombre) {
            const keyNueva = nombre.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '_');
            setColumnas([...columnas, { key: keyNueva, label: nombre.toUpperCase() }]);
            setDatos(datos.map(fila => ({ ...fila, [keyNueva]: '' })));
        }
    };

    const handleSincronizar = async () => {
        setActualizando(true);
        try {
            await saveEvaluacion({
                id: `personal-docente-estudia-${periodoActual}`,
                registros: datos,
                periodo: periodoActual,
                tipoFormato: "Personal Docente que Estudia"
            });
            alert("¡Registro guardado con éxito!");
        } catch (error) { alert("Error al guardar."); }
        finally { setActualizando(false); }
    };

    if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>Cargando datos...</div>;

    return (
        <div className="container" style={styles.mainContainer}>
            <style>
                {`
          @media print {
            @page { size: landscape; margin: 0.5cm; }
            body { -webkit-print-color-adjust: exact; }
          }
          @media screen { .solo-pdf-captura { position: absolute; left: -9999px; } }
          .no_imprimir_botones_ia { display: flex; }
          td[contenteditable="true"]:focus { background-color: #fff9c4 !important; outline: none; }
          .fila-datos { position: relative; }
          .contenedor-eliminar {
            position: absolute;
            right: -30px;
            top: 50%;
            transform: translateY(-50%);
            opacity: 0;
            transition: opacity 0.2s ease;
            z-index: 10;
          }
          .fila-datos:hover .contenedor-eliminar { opacity: 1; }
          td[contenteditable="true"] {
            user-select: text;
            -webkit-user-modify: read-write-plaintext-only;
            word-break: break-word;
            white-space: normal;
          }
        `}
            </style>

            <div id="area-oficial-impresion" style={{
                ...styles.pageWrapper,
                maxWidth: esHorizontal ? '1600px' : '1100px' // Se expande simétricamente
            }}>

                <div className="solo-pdf-captura" style={styles.fullImageContainer}>
                    <img src={Assets.header} alt="Header" style={styles.fullWidthImg} />
                </div>

                <div style={styles.marginContent}>
                    <div style={styles.contentHeader}>
                        <h2 style={styles.titlePrincipal}>PERSONAL DOCENTE QUE ESTUDIA</h2>
                        <p style={styles.subtitlePeriodo}>Periodo: {periodoActual}</p>
                        <div style={styles.divider} />
                    </div>

                    <div style={styles.tableWrapper}>
                        <div style={styles.tableContainer}>
                            <form autoComplete="off" action="none">
                                <table style={styles.table}>
                                    <thead>
                                        <tr style={{ backgroundColor: Colors.barraTitulo || '#00264D', color: 'white' }}>
                                            <th colSpan={columnas.length} style={styles.thMain}>PERSONAL DOCENTE</th>
                                        </tr>
                                        <tr style={{ backgroundColor: Colors.barraTitulo || '#00264D', color: 'white', borderTop: '1px solid rgba(255,255,255,0.2)' }}>
                                            {columnas.map((col) => (
                                                <th key={col.key} style={styles.th}>{col.label}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {datos.map((fila, index) => (
                                            <tr key={fila.id} className="fila-datos" style={{ borderBottom: '1px solid #eee' }}>
                                                {columnas.map((col, colIdx) => (
                                                    <td
                                                        key={`${fila.id}-${col.key}`}
                                                        style={styles.td}
                                                        contentEditable="true"
                                                        suppressContentEditableWarning
                                                        onKeyDown={(e) => handleKeyDown(e, index, colIdx)}
                                                        onBlur={(e) => handleBlurCell(index, col.key, e.target.innerText)}
                                                        autoComplete="off"
                                                        spellCheck="false"
                                                    >
                                                        {fila[col.key]}
                                                    </td>
                                                ))}
                                                <div className="contenedor-eliminar no_imprimir_botones_ia">
                                                    <BotonEliminar onClick={() => eliminarFila(fila.id)} />
                                                </div>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </form>
                        </div>
                    </div>

                    <div className="no_imprimir_botones_ia" style={styles.buttonContainer}>
                        <BotonLimpiar onClick={handleLimpiarTabla} />
                        <BotonNuevaColumna onClick={handleAgregarColumna} />
                        <BotonAgregar onClick={agregarFila} />
                        <BotonSincronizar onClick={handleSincronizar} loading={actualizando} />
                    </div>
                </div>

                <div className="solo-pdf-captura" style={styles.fullImageContainerFooter}>
                    <img src={Assets.footer} alt="Footer" style={styles.fullWidthImg} />
                </div>
            </div>
        </div>
    );
};

const styles = {
    mainContainer: { width: '100%', display: 'flex', justifyContent: 'center', backgroundColor: '#f5f5f5', padding: '20px 0' },
    pageWrapper: { backgroundColor: 'white', width: '98%', margin: '0 auto', display: 'flex', flexDirection: 'column', position: 'relative', boxShadow: '0 0 15px rgba(0,0,0,0.1)' },
    fullImageContainer: { width: '100%' },
    fullImageContainerFooter: { width: '100%', marginTop: 'auto' },
    marginContent: { padding: '20px 2%', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' },
    fullWidthImg: { width: '100%', display: 'block' },
    contentHeader: { width: '100%', textAlign: 'center', marginBottom: '20px' },
    titlePrincipal: { margin: '0', fontSize: '1.2rem', fontWeight: 'bold', color: '#000' },
    subtitlePeriodo: { margin: '2px 0', fontSize: '1rem', color: '#333' },
    divider: { height: '3px', backgroundColor: '#00264D', width: '100%', marginTop: '10px' },
    tableWrapper: { width: '100%', display: 'flex', justifyContent: 'center' },
    tableContainer: { width: '100%', border: '1px solid #ccc', borderRadius: '4px', overflow: 'visible' },
    table: { width: '100%', borderCollapse: 'collapse', tableLayout: 'auto' },
    thMain: { padding: '10px', fontSize: '0.8rem', fontWeight: 'bold' },
    th: { padding: '6px', textAlign: 'center', fontSize: '0.55rem', borderRight: '1px solid rgba(255,255,255,0.1)', wordWrap: 'break-word' },
    td: { padding: '6px', textAlign: 'center', fontSize: '0.6rem', outline: 'none', borderRight: '1px solid #eee' },
    buttonContainer: { display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '25px', width: '100%' }
};

export default PersonalDocente;