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

const Tutorias = () => {
    const { periodoId } = useParams();
    const [datos, setDatos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actualizando, setActualizando] = useState(false);

    // ESTRUCTURA DE COLUMNAS SEGÚN EL REQUERIMIENTO
    const [columnas, setColumnas] = useState([
        { key: 'programa', label: 'PROGRAMA ACADÉMICO' },
        { key: 'docentesFormados', label: 'NÚMERO DE DOCENTES FORMADOS COMO TUTORES' },
        { key: 'profesoresParticipantes', label: 'NÚMERO DE PROFESORES QUE PARTICIPAN EN EL PROYECTO INSTITUCIONAL DE ACOMPAÑAMIENTO Y TUTORÍA DE ESTUDIANTES' },
        { key: 'alumnosParticipantes', label: 'NÚMERO DE ALUMNOS QUE PARTICIPAN EN EL PROYECTO INSTITUCIONAL DE ACOMPAÑAMIENTO Y TUTORÍA A ESTUDIANTES' }
    ]);

    const { exportToPDF, exportToExcel } = useExport();
    const periodoActual = periodoId || "Septiembre 2025 – Febrero 2026";

    // USAMOS EL HOOK CENTRALIZADO PARA NAVEGACIÓN Y AUTOCOMPLETADO
    const { handleKeyDown, handleBlurCell } = useTableLogic(datos, setDatos, columnas.length);

    useEffect(() => {
        const handlePDF = () => exportToPDF('area-oficial-impresion', `Tutorías - ${periodoActual}`);
        const handleExcel = () => exportToExcel(datos, `Tutorías - ${periodoActual}`);
        window.addEventListener('descargar-pdf-global', handlePDF);
        window.addEventListener('descargar-excel-global', handleExcel);
        return () => {
            window.removeEventListener('descargar-pdf-global', handlePDF);
            window.removeEventListener('descargar-excel-global', handleExcel);
        };
    }, [datos, periodoActual]);

    useEffect(() => {
        const cargarDatos = async () => {
            setLoading(true);
            try {
                const idDoc = `tutorias-${periodoActual}`;
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
        if (window.confirm("¿Deseas vaciar todos los campos de la tabla de Tutorías?")) {
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
                id: `tutorias-${periodoActual}`,
                registros: datos,
                periodo: periodoActual,
                tipoFormato: "Tutorías"
            });
            alert("¡Datos de Tutorías sincronizados!");
        } catch (error) { alert("Error al guardar."); }
        finally { setActualizando(false); }
    };

    if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>Cargando Tutorías...</div>;

    return (
        <div className="container" style={styles.mainContainer}>
            <style>
                {`
                @media screen { .solo-pdf-captura { position: absolute; left: -9999px; } }
                .no_imprimir_botones_ia { display: flex; }
                td[contenteditable="true"]:focus { background-color: #fff9c4 !important; outline: none; }
                
                .fila-datos { position: relative; }
                .contenedor-eliminar {
                    position: absolute;
                    right: -35px;
                    top: 50%;
                    transform: translateY(-50%);
                    opacity: 0;
                    transition: opacity 0.2s ease;
                    z-index: 10;
                    display: flex;
                    align-items: center;
                    justify-content: center;
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

            <div id="area-oficial-impresion" style={styles.pageWrapper}>
                <div className="solo-pdf-captura" style={styles.fullImageContainer}>
                    <img src={Assets.header} alt="Header" style={styles.fullWidthImg} />
                </div>

                <div style={styles.marginContent}>
                    <div style={styles.contentHeader}>
                        {/* IDENTIFICACIÓN INSTITUCIONAL RESTAURADA */}
                        <h2 style={styles.titlePrincipal}>TUTORÍAS</h2>
                        <p style={styles.subtitlePeriodo}>Periodo: {periodoActual}</p>
                        <div style={styles.divider} />
                    </div>

                    <div style={styles.tableWrapper}>
                        <div style={styles.tableContainer}>
                            <form autoComplete="off" action="none">
                                <table style={styles.table}>
                                    <thead>
                                        <tr style={{ backgroundColor: Colors.barraTitulo || '#00264D', color: 'white' }}>
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
                                                {/* CELDA TÉCNICA PARA EL BOTÓN ELIMINAR FLOTANTE */}
                                                <td className="no_imprimir_botones_ia" style={{ width: '0', padding: '0', border: 'none', position: 'relative' }}>
                                                    <div className="contenedor-eliminar">
                                                        <BotonEliminar onClick={() => eliminarFila(fila.id)} />
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </form>
                        </div>
                    </div>

                    {/* BOTONERA COMPLETA RESTAURADA */}
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
    pageWrapper: {
        backgroundColor: 'white',
        width: '100%',
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '297mm',
        position: 'relative',
        boxShadow: '0 0 15px rgba(0,0,0,0.1)'
    },
    fullImageContainer: { width: '100%' },
    fullImageContainerFooter: { width: '100%', marginTop: 'auto' },
    marginContent: { padding: '20px 1.5cm', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' },
    fullWidthImg: { width: '100%', display: 'block' },
    contentHeader: { textAlign: 'center', marginBottom: '20px', width: '100%' },
    titlePrincipal: { margin: '0', fontSize: '1.4rem', fontWeight: 'bold', color: '#000' },
    subtitlePeriodo: { margin: '2px 0', fontSize: '1rem', color: '#333' },
    divider: { height: '3px', backgroundColor: '#00264D', width: '100%', marginTop: '10px' },
    tableWrapper: { width: '100%', display: 'flex', justifyContent: 'center' },
    tableContainer: { width: '100%', border: '1px solid #ccc', borderRadius: '4px', overflow: 'visible' },
    table: { width: '100%', borderCollapse: 'collapse', tableLayout: 'auto' },
    th: { padding: '12px', textAlign: 'center', fontSize: '0.6rem', borderRight: '1px solid rgba(255,255,255,0.1)', lineHeight: '1.2' },
    td: { padding: '10px', textAlign: 'center', fontSize: '0.75rem', outline: 'none', borderRight: '1px solid #eee' },
    buttonContainer: { display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '30px', width: '100%' }
};

export default Tutorias;