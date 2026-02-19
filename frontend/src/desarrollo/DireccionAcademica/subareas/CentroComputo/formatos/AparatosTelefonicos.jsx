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

const AparatosTelefonicos = () => {
    const { periodoId } = useParams();
    const [datos, setDatos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actualizando, setActualizando] = useState(false);

    // ESTRUCTURA DE COLUMNAS SEGÚN TU DISEÑO
    const [columnas, setColumnas] = useState([
        { key: 'numero', label: 'Número' },
        { key: 'cantidad', label: 'Cantidad' },
        { key: 'areaAsignada', label: 'Area Asignada' }
    ]);

    const { exportToPDF, exportToExcel } = useExport();
    const periodoActual = periodoId || "Septiembre 2025 – Febrero 2026";

    // LÓGICA DE NAVEGACIÓN DE CELDAS (Cruceta)
    const { handleKeyDown, handleBlurCell } = useTableLogic(datos, setDatos, columnas.length);

    useEffect(() => {
        const handlePDF = () => exportToPDF('area-oficial-impresion', `Líneas y Aparatos Telefónicos - ${periodoActual}`);
        const handleExcel = () => exportToExcel(datos, `Líneas y Aparatos Telefónicos - ${periodoActual}`);
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
                const idDoc = `centro-computo-aparatos-telefonicos-${periodoActual}`;
                const registros = await fetchEvaluaciones(idDoc);
                if (registros && registros.registros) {
                    setDatos(registros.registros);
                } else {
                    // Fila inicial con IDs únicos para evitar fallos en el render
                    setDatos([{ id: Date.now(), numero: '1', cantidad: '', areaAsignada: '' }]);
                }
            } catch (error) { console.error("Error al cargar:", error); }
            finally { setLoading(false); }
        };
        cargarDatos();
    }, [periodoActual]);

    const totalEquipos = datos.reduce((acc, curr) => acc + (Number(curr.cantidad) || 0), 0);

    const agregarFila = () => {
        setDatos([...datos, { id: Date.now(), cantidad: '', areaAsignada: '' }]);
    };

    const eliminarFila = (id) => {
        if (datos.length > 1) setDatos(datos.filter(f => f.id !== id));
    };

    const handleLimpiarTabla = () => {
        if (window.confirm("¿Deseas vaciar los datos de Líneas y Aparatos Telefónicos?")) {
            setDatos([{ id: Date.now(), cantidad: '', areaAsignada: '' }]);
        }
    };

    const handleSincronizar = async () => {
        setActualizando(true);
        try {
            await saveEvaluacion({
                id: `centro-computo-aparatos-telefonicos-${periodoActual}`,
                registros: datos,
                area: "Centro de Cómputo",
                subarea: "Líneas y aparatos Telefónicos",
                periodo: periodoActual,
                totalEquipos: totalEquipos
            });
            alert("¡Datos sincronizados con éxito!");
        } catch (error) { alert("Error al guardar."); }
        finally { setActualizando(false); }
    };

    if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>Cargando formato...</div>;

    return (
        <div className="container" style={styles.mainContainer}>
            <style>
                {`
          @media screen { .solo-pdf-captura { position: absolute; left: -9999px; } }
          .no_imprimir_botones_ia { display: flex; }
          td[contenteditable="true"]:focus { background-color: #fff9c4 !important; outline: none; }
          .fila-datos { position: relative; }
          /* Tachecita (X) con la misma lógica de AlumnosEventos */
          .contenedor-eliminar {
            position: absolute;
            right: -35px;
            top: 50%;
            transform: translateY(-50%);
            opacity: 0;
            transition: opacity 0.2s ease;
            z-index: 10;
          }
          .fila-datos:hover .contenedor-eliminar { opacity: 1; }
          td[contenteditable="true"] {
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
                        <h2 style={styles.titlePrincipal}>LÍNEAS Y APARATOS TELEFÓNICOS</h2>
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
                                                <td style={styles.tdNumero}>{index + 1}</td>

                                                {/* Celda Cantidad */}
                                                <td
                                                    style={styles.td}
                                                    contentEditable="true"
                                                    suppressContentEditableWarning
                                                    onKeyDown={(e) => handleKeyDown(e, index, 1)}
                                                    onBlur={(e) => handleBlurCell(index, 'cantidad', e.target.innerText)}
                                                >
                                                    {fila.cantidad}
                                                </td>

                                                {/* Celda Área Asignada */}
                                                <td
                                                    style={styles.td}
                                                    contentEditable="true"
                                                    suppressContentEditableWarning
                                                    onKeyDown={(e) => handleKeyDown(e, index, 2)}
                                                    onBlur={(e) => handleBlurCell(index, 'areaAsignada', e.target.innerText)}
                                                >
                                                    {fila.areaAsignada}
                                                </td>

                                                {/* Tachecita flotante reutilizada */}
                                                <td className="no_imprimir_botones_ia" style={{ width: '0', padding: '0', border: 'none', position: 'relative' }}>
                                                    <div className="contenedor-eliminar">
                                                        <BotonEliminar onClick={() => eliminarFila(fila.id)} />
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                        <tr style={{ backgroundColor: Colors.barraTitulo || '#00264D', color: 'white', fontWeight: 'bold' }}>
                                            <td style={styles.tdTotal}>TOTAL EQUIPOS</td>
                                            <td style={styles.td}>{totalEquipos}</td>
                                            <td style={styles.td}></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </form>
                        </div>
                    </div>

                    <div className="no_imprimir_botones_ia" style={styles.buttonContainer}>
                        <BotonLimpiar onClick={handleLimpiarTabla} />
                        <BotonNuevaColumna onClick={() => alert("Función para nuevas especificaciones técnica")} />
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
    pageWrapper: { backgroundColor: 'white', width: '100%', maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', position: 'relative', boxShadow: '0 0 15px rgba(0,0,0,0.1)' },
    fullImageContainer: { width: '100%' },
    fullImageContainerFooter: { width: '100%', marginTop: 'auto' },
    marginContent: { padding: '20px 1.5cm', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' },
    fullWidthImg: { width: '100%', display: 'block' },
    contentHeader: { width: '100%', textAlign: 'center', marginBottom: '20px' },
    titlePrincipal: { margin: '0', fontSize: '1.4rem', fontWeight: 'bold', color: '#000' },
    subtitlePeriodo: { margin: '2px 0', fontSize: '1rem', color: '#333' },
    divider: { height: '3px', backgroundColor: '#00264D', width: '100%', marginTop: '10px' },
    tableWrapper: { width: '100%', display: 'flex', justifyContent: 'center' },
    tableContainer: { width: '100%', border: '1px solid #ccc', borderRadius: '4px', overflow: 'visible' },
    table: { width: '100%', borderCollapse: 'collapse' },
    th: { padding: '12px', textAlign: 'center', fontSize: '0.85rem', borderRight: '1px solid rgba(255,255,255,0.1)' },
    tdNumero: { padding: '10px', fontSize: '0.8rem', textAlign: 'center', fontWeight: 'bold', borderRight: '1px solid #eee', backgroundColor: '#f9f9f9', width: '80px' },
    tdTotal: { padding: '10px', fontSize: '0.85rem', textAlign: 'center' },
    td: { padding: '10px', textAlign: 'center', fontSize: '0.85rem', outline: 'none', borderRight: '1px solid #eee' },
    buttonContainer: { display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '30px', width: '100%' }
};

export default AparatosTelefonicos;