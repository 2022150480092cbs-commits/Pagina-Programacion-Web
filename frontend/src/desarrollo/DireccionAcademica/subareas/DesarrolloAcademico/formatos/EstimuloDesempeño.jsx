import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useExport from '../../../../../hooks/useExport';
import { Colors, Assets, Typography } from '../../../../../components/generalStyle/StylesConfig';
import { fetchEvaluaciones, saveEvaluacion } from '../../../../../api/firebaseService';
import { useTableLogic } from '../../../../../hooks/useTableLogic';

import {
    BotonSincronizar,
    BotonAgregar,
    BotonLimpiar,
    BotonEliminar,
    BotonNuevaColumna
} from '../../../../../components/BotonesTablas';

const ProyectosInvestigacion = () => {
    const { periodoId } = useParams();
    const [datos, setDatos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actualizando, setActualizando] = useState(false);

    const [columnas, setColumnas] = useState([
        { key: 'categoria', label: 'PROYECTOS DE INVESTIGACIÓN' },
        { key: 'sector', label: 'SECTOR' },
        { key: 'numAlumnos', label: 'NÚMERO DE ALUMNOS' },
        { key: 'nombreProyecto', label: 'NOMBRE DEL PROYECTO' }
    ]);

    const { exportToPDF, exportToExcel } = useExport();
    const periodoActual = periodoId || "Septiembre 2025 – Febrero 2026";

    const { handleKeyDown, handleBlurCell } = useTableLogic(datos, setDatos, columnas.length);

    useEffect(() => {
        const handlePDF = () => exportToPDF('area-oficial-impresion', `Estímulo Desempeño Docente - ${periodoActual}`);
        const handleExcel = () => exportToExcel(datos, `Estímulo Desempeño Docente - ${periodoActual}`);
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
                const idDoc = `estimulo-desempeno-docente-${periodoActual}`;
                const registros = await fetchEvaluaciones(idDoc);

                if (registros && registros.registros) {
                    setDatos(registros.registros);
                } else {
                    const categoriasBase = [
                        "INVESTIGACIÓN Y DESARROLLO", "ASESORÍAS TÉCNICAS",
                        "PRÁCTICAS PROFESIONALES", "EDUCACIÓN CONTINUA",
                        "SERVICIO SOCIAL", "OTROS"
                    ];
                    setDatos(categoriasBase.map(cat => ({
                        id: Date.now() + Math.random(), categoria: cat, sector: '', numAlumnos: '', nombreProyecto: ''
                    })));
                }
            } catch (error) { console.error(error); }
            finally { setLoading(false); }
        };
        cargarDatos();
    }, [periodoActual]);

    const totalSector = datos.reduce((acc, curr) => acc + (Number(curr.sector) || 0), 0);
    const totalAlumnos = datos.reduce((acc, curr) => acc + (Number(curr.numAlumnos) || 0), 0);

    const handleLimpiarTabla = () => {
        if (window.confirm("¿Deseas vaciar los datos?")) {
            setDatos(datos.map(f => ({ ...f, sector: '', numAlumnos: '', nombreProyecto: '' })));
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
                id: `estimulo-desempeno-docente-${periodoActual}`,
                registros: datos,
                periodo: periodoActual
            });
            alert("¡Datos guardados con éxito!");
        } catch (error) { alert("Error al guardar."); }
        finally { setActualizando(false); }
    };

    if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>Cargando...</div>;

    return (
        <div className="container" style={styles.mainContainer}>
            <style>
                {`
                @media screen { .solo-pdf-captura { position: absolute; left: -9999px; } }
                .no_imprimir_botones_ia { display: flex; }
                td[contenteditable="true"]:focus { background-color: #fff9c4 !important; outline: none; }
                td[contenteditable="true"] { word-break: break-word; white-space: normal; }
                `}
            </style>

            <div id="area-oficial-impresion" style={styles.pageWrapper}>
                <div className="solo-pdf-captura" style={styles.fullImageContainer}>
                    <img src={Assets.header} alt="Header" style={styles.fullWidthImg} />
                </div>

                <div style={styles.marginContent}>
                    <div style={styles.contentHeader}>
                        <h2 style={styles.titlePrincipal}>ESTÍMULO AL DESEMPEÑO DOCENTE</h2>
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
                                            <tr key={fila.id} style={{ borderBottom: '1px solid #eee' }}>
                                                <td style={styles.tdCategoria}>{fila.categoria}</td>
                                                <td style={styles.td} contentEditable suppressContentEditableWarning
                                                    onKeyDown={(e) => handleKeyDown(e, index, 1)}
                                                    onBlur={(e) => handleBlurCell(index, 'sector', e.target.innerText)}>{fila.sector}</td>
                                                <td style={styles.td} contentEditable suppressContentEditableWarning
                                                    onKeyDown={(e) => handleKeyDown(e, index, 2)}
                                                    onBlur={(e) => handleBlurCell(index, 'numAlumnos', e.target.innerText)}>{fila.numAlumnos}</td>
                                                <td style={styles.td} contentEditable suppressContentEditableWarning
                                                    onKeyDown={(e) => handleKeyDown(e, index, 3)}
                                                    onBlur={(e) => handleBlurCell(index, 'nombreProyecto', e.target.innerText)}>{fila.nombreProyecto}</td>
                                            </tr>
                                        ))}
                                        <tr style={{ backgroundColor: Colors.barraTitulo || '#00264D', color: 'white', fontWeight: 'bold' }}>
                                            <td style={styles.tdTotal}>TOTAL</td>
                                            <td style={styles.td}>{totalSector}</td>
                                            <td style={styles.td}>{totalAlumnos}</td>
                                            <td style={styles.td}></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </form>
                        </div>
                    </div>

                    <div className="no_imprimir_botones_ia" style={styles.buttonContainer}>
                        <BotonLimpiar onClick={handleLimpiarTabla} />
                        <BotonNuevaColumna onClick={handleAgregarColumna} />
                        <BotonAgregar onClick={() => setDatos([...datos, { id: Date.now(), categoria: 'NUEVO PROYECTO', sector: '', numAlumnos: '', nombreProyecto: '' }])} />
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
    tableContainer: { width: '100%', border: '1px solid #ccc', borderRadius: '4px', overflow: 'hidden' },
    table: { width: '100%', borderCollapse: 'collapse', tableLayout: 'auto' },
    th: { padding: '12px', textAlign: 'center', fontSize: '0.8rem', borderRight: '1px solid rgba(255,255,255,0.1)' },
    tdCategoria: { padding: '10px 15px', fontSize: '0.75rem', textAlign: 'left', fontWeight: 'bold', borderRight: '1px solid #eee', backgroundColor: '#f9f9f9' },
    tdTotal: { padding: '10px 15px', fontSize: '0.85rem', textAlign: 'center' },
    td: { padding: '10px', textAlign: 'center', fontSize: '0.8rem', outline: 'none', borderRight: '1px solid #eee' },
    buttonContainer: { display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '30px', width: '100%' }
};

export default ProyectosInvestigacion;