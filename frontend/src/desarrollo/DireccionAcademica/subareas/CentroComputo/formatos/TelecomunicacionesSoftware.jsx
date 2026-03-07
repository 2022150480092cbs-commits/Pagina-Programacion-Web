import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useExport from '../../../../../hooks/useExport';
import { Colors, Assets } from '../../../../../components/generalStyle/StylesConfig';
import { fetchEvaluaciones, saveEvaluacion } from '../../../../../api/firebaseService';
import { useTableLogic } from '../../../../../hooks/useTableLogic';

import {
    BotonSincronizar,
    BotonAgregar,
    BotonLimpiar,
    BotonEliminar,
    BotonNuevaColumna
} from '../../../../../components/BotonesTablas';

const SoftwareInventario = () => {

    const { periodoId } = useParams();
    const periodoActual = periodoId || "Septiembre 2025 – Febrero 2026";

    const [usadoTesjo, setUsadoTesjo] = useState([]);
    const [usadoAculco, setUsadoAculco] = useState([]);
    const [desTesjo, setDesTesjo] = useState([]);
    const [desAculco, setDesAculco] = useState([]);

    const [loading, setLoading] = useState(true);
    const [actualizando, setActualizando] = useState(false);

    const { exportToPDF } = useExport();

    const logicTesjoUsado = useTableLogic(usadoTesjo, setUsadoTesjo, 3);
    const logicAculcoUsado = useTableLogic(usadoAculco, setUsadoAculco, 3);
    const logicTesjoDes = useTableLogic(desTesjo, setDesTesjo, 3);
    const logicAculcoDes = useTableLogic(desAculco, setDesAculco, 3);

    useEffect(() => {
        const cargarDatos = async () => {
            setLoading(true);
            try {
                const idDoc = `centro-computo-software-${periodoActual}`;
                const data = await fetchEvaluaciones(idDoc);

                if (data) {
                    setUsadoTesjo(data.usadoTesjo || []);
                    setUsadoAculco(data.usadoAculco || []);
                    setDesTesjo(data.desTesjo || []);
                    setDesAculco(data.desAculco || []);
                } else {
                    inicializarTablas();
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        cargarDatos();
    }, [periodoActual]);

    const inicializarTablas = () => {
        const fila = () => ({
            id: Date.now() + Math.random(),
            nombre: '',
            categoria: '',
            licencias: ''
        });

        setUsadoTesjo([fila()]);
        setUsadoAculco([fila()]);
        setDesTesjo([fila()]);
        setDesAculco([fila()]);
    };

    const totalLicencias = (data) =>
        data.reduce((acc, curr) => acc + (Number(curr.licencias) || 0), 0);

    // 🔹 NUEVO: agregar fila en todas las tablas
    const agregarFilaTodas = () => {
        const nuevaFila = () => ({ id: Date.now() + Math.random(), nombre: '', categoria: '', licencias: '' });
        setUsadoTesjo([...usadoTesjo, nuevaFila()]);
        setUsadoAculco([...usadoAculco, nuevaFila()]);
        setDesTesjo([...desTesjo, nuevaFila()]);
        setDesAculco([...desAculco, nuevaFila()]);
    };

    const eliminarFila = (id, data, setter) => {
        if (data.length > 1) setter(data.filter(f => f.id !== id));
    };

    const limpiarTodo = () => {
        if (window.confirm("¿Deseas limpiar todas las tablas de software?")) {
            inicializarTablas();
        }
    };

    const handleSincronizar = async () => {
        setActualizando(true);
        try {
            await saveEvaluacion({
                id: `centro-computo-software-${periodoActual}`,
                usadoTesjo,
                usadoAculco,
                desTesjo,
                desAculco,
                periodo: periodoActual
            });
            alert("¡Datos sincronizados!");
        } catch (error) {
            alert("Error al guardar");
        } finally {
            setActualizando(false);
        }
    };

    if (loading) return <div style={{ padding: 50 }}>Cargando formato...</div>;

    const renderSubTabla = (titulo, data, setter, logic) => (
        <>
            <tr style={styles.subHeader}>
                <td colSpan="3">{titulo}</td>
            </tr>

            {data.map((fila, rowIndex) => (
                <tr key={fila.id}>
                    <td
                        contentEditable
                        suppressContentEditableWarning
                        onKeyDown={(e) => logic.handleKeyDown(e, rowIndex, 0)}
                        onBlur={(e) => logic.handleBlurCell(rowIndex, 'nombre', e.target.innerText)}
                        style={styles.td}
                    >
                        {fila.nombre}
                    </td>

                    <td
                        contentEditable
                        suppressContentEditableWarning
                        onKeyDown={(e) => logic.handleKeyDown(e, rowIndex, 1)}
                        onBlur={(e) => logic.handleBlurCell(rowIndex, 'categoria', e.target.innerText)}
                        style={styles.td}
                    >
                        {fila.categoria}
                    </td>

                    <td
                        contentEditable
                        suppressContentEditableWarning
                        onKeyDown={(e) => logic.handleKeyDown(e, rowIndex, 2)}
                        onBlur={(e) => logic.handleBlurCell(rowIndex, 'licencias', e.target.innerText)}
                        style={styles.td}
                    >
                        {fila.licencias}
                    </td>

                    <td style={{ border: 'none' }}>
                        <BotonEliminar onClick={() => eliminarFila(fila.id, data, setter)} />
                    </td>
                </tr>
            ))}

            <tr style={styles.totalRow}>
                <td>TOTAL</td>
                <td></td>
                <td>{totalLicencias(data)}</td>
            </tr>
        </>
    );

    return (
        <div style={styles.container}>
            <div id="area-oficial-impresion" style={styles.page}>
                <img src={Assets.header} alt="Header" style={{ width: '100%' }} />

                {/* SOFTWARE USADO */}
                <h3 style={styles.title}>SOFTWARE USADO</h3>
                <p style={styles.periodo}>{periodoActual}</p>

                <table style={styles.table}>
                    <thead>
                        <tr style={styles.header}>
                            <th>NOMBRE</th>
                            <th>
                                CATEGORÍA<br />
                                <span style={styles.subcategoria}>
                                    (ANTIVIRUS, OTRO SOFTWARE, SISTEMAS OPERATIVOS,
                                    SOFTWARE DE ADMINISTRACIÓN DE RED,
                                    SOFTWARE DE APLICACIÓN)
                                </span>
                            </th>
                            <th>NÚMERO DE LICENCIAS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {renderSubTabla("TES JOCOTITLÁN", usadoTesjo, setUsadoTesjo, logicTesjoUsado)}
                        {renderSubTabla("EXTENSIÓN ACULCO", usadoAculco, setUsadoAculco, logicAculcoUsado)}
                    </tbody>
                </table>

                {/* SOFTWARE DESARROLLADO */}
                <h3 style={styles.title}>SOFTWARE DESARROLLADO</h3>
                <p style={styles.periodo}>{periodoActual}</p>

                <table style={styles.table}>
                    <thead>
                        <tr style={styles.header}>
                            <th>NOMBRE</th>
                            <th>
                                CATEGORÍA<br />
                                <span style={styles.subcategoria}>
                                    (FINANCIEROS, ACADÉMICA, ADMINISTRATIVA,
                                    INNOVACIÓN Y CALIDAD, PLANEACIÓN,
                                    RECURSOS HUMANOS, SERVICIOS)
                                </span>
                            </th>
                            <th>NÚMERO DE LICENCIAS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {renderSubTabla("TES JOCOTITLÁN", desTesjo, setDesTesjo, logicTesjoDes)}
                        {renderSubTabla("EXTENSIÓN ACULCO", desAculco, setDesAculco, logicAculcoDes)}
                    </tbody>
                </table>

                {/* 🔹 BOTONES ABAJO DE TODAS LAS TABLAS */}
                <div style={styles.botones}>
                    <BotonAgregar onClick={agregarFilaTodas} />
                    <BotonLimpiar onClick={limpiarTodo} />
                    <BotonNuevaColumna onClick={() => alert("Función para nueva columna")} />
                    <BotonSincronizar onClick={handleSincronizar} loading={actualizando} />
                </div>

                <img src={Assets.footer} alt="Footer" style={{ width: '100%' }} />
            </div>
        </div>
    );
};

const styles = {
    container: { display: 'flex', justifyContent: 'center', background: '#f5f5f5', padding: 20 },
    page: { width: '1200px', background: '#fff', padding: '20px 1.5cm' },
    table: { width: '100%', borderCollapse: 'collapse', marginBottom: 20 },
    header: { backgroundColor: Colors.barraTitulo || '#00264D', color: '#fff' },
    td: { padding: 8, border: '1px solid #eee', textAlign: 'center' },
    subHeader: { backgroundColor: '#eaeaea', fontWeight: 'bold', textAlign: 'center' },
    totalRow: { backgroundColor: '#00264D', color: '#fff', fontWeight: 'bold' },
    title: { textAlign: 'center', margin: '25px 0 5px 0', fontWeight: 'bold' },
    periodo: { textAlign: 'center', margin: '0 0 15px 0', fontWeight: 'bold', fontSize: '0.9rem' },
    botones: { display: 'flex', justifyContent: 'center', gap: 20, marginTop: 30 },
    subcategoria: { fontSize: '0.7rem', fontWeight: 'normal', display: 'block', marginTop: 4 }
};

export default SoftwareInventario;
