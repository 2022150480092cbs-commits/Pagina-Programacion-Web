import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useExport from '../../../../../hooks/useExport';
import { Colors, Assets, Typography } from '../../../../../components/generalStyle/StylesConfig';
import { fetchEvaluaciones, saveEvaluacion } from '../../../../../api/firebaseService';
import { useTableLogic } from '../../../../../hooks/useTableLogic';

import {
  BotonSincronizar,
  BotonAgregar,
  BotonLimpiar
} from '../../../../../components/BotonesTablas';

const EducacionEspecial = () => {
  const { periodoId } = useParams();
  const [datosSoftware, setDatosSoftware] = useState([]);
  const [datosTesjo, setDatosTesjo] = useState([]);
  const [datosAculco, setDatosAculco] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actualizando, setActualizando] = useState(false);

  const periodoActual = periodoId || "Septiembre 2025 – Febrero 2026";

  // 1. Ganchos de lógica de tabla independientes para evitar desbordamientos
  // Cada uno conoce su propio límite de columnas
  const logicSoftware = useTableLogic(datosSoftware, setDatosSoftware, 3);
  const logicTesjo = useTableLogic(datosTesjo, setDatosTesjo, 4);
  const logicAculco = useTableLogic(datosAculco, setDatosAculco, 4);

  const { exportToPDF, exportToExcel } = useExport();

  useEffect(() => {
    const handlePDF = () => exportToPDF('area-oficial-impresion', `Educación Especial - ${periodoActual}`, 'landscape');
    const handleExcel = () => exportToExcel([...datosTesjo, ...datosSoftware], `Educación Especial - ${periodoActual}`);
    window.addEventListener('descargar-pdf-global', handlePDF);
    window.addEventListener('descargar-excel-global', handleExcel);
    return () => {
      window.removeEventListener('descargar-pdf-global', handlePDF);
      window.removeEventListener('descargar-excel-global', handleExcel);
    };
  }, [datosTesjo, datosSoftware, periodoActual]);

  useEffect(() => {
    const cargarDatos = async () => {
      setLoading(true);
      try {
        const idDoc = `centro-computo-educacion-especial-${periodoActual}`;
        const registros = await fetchEvaluaciones(idDoc);
        if (registros && registros.tesjo) {
          setDatosSoftware(registros.software || []);
          setDatosTesjo(registros.tesjo);
          setDatosAculco(registros.aculco);
        } else {
          setDatosSoftware([{ id: 1, software: '', tesjo: '', aculco: '' }, { id: 2, software: '', tesjo: '', aculco: '' }, { id: 3, software: '', tesjo: '', aculco: '' }]);
          const equiposBase = ["Impresoras Braille", "Pantallas de Toque", "Atriles", "Teléfonos para Personas Sordas", "Computadoras con Pantalla Táctil", "Teclados Alternativos", "Ratones (Mouse) Alternativos", "Magnificadores o Lupas", "Comunicadores", "Otros (Especificar)"];
          const init = () => equiposBase.map(e => ({ id: Math.random(), equipo: e, operacion: '', reparacion: '', reserva: '' }));
          setDatosTesjo(init());
          setDatosAculco(init());
        }
      } catch (error) { console.error(error); }
      finally { setLoading(false); }
    };
    cargarDatos();
  }, [periodoActual]);

  const updateCell = (setter, data, index, field, value) => {
    const nuevos = [...data];
    nuevos[index][field] = value;
    setter(nuevos);
  };

  const calcTotalFila = (f) => (Number(f.operacion) || 0) + (Number(f.reparacion) || 0) + (Number(f.reserva) || 0);

  const handleSincronizar = async () => {
    setActualizando(true);
    try {
      await saveEvaluacion({
        id: `centro-computo-educacion-especial-${periodoActual}`,
        software: datosSoftware,
        tesjo: datosTesjo,
        aculco: datosAculco,
        periodo: periodoActual,
        tipoFormato: "Educación Especial"
      });
      alert("¡Datos guardados!");
    } catch (error) { alert("Error al guardar."); }
    finally { setActualizando(false); }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>Cargando...</div>;

  return (
    <div className="container" style={styles.mainContainer}>
      <style>{`
                @media screen { .solo-pdf-captura { position: absolute; left: -9999px; } }
                td[contenteditable="true"]:focus { background-color: #fff9c4 !important; outline: 2px solid ${Colors.periodoActivo}; }
                td[contenteditable="true"] { word-break: break-word; white-space: normal; }
                img { display: block; }
            `}</style>

      <div id="area-oficial-impresion" style={styles.pageWrapper}>
        <div className="solo-pdf-captura" style={styles.fullImageContainer}>
          <img src={Assets.header} alt="Header" style={styles.fullWidthImg} />
        </div>

        <div style={styles.marginContent}>
          <div style={styles.contentHeader}>
            <h2 style={styles.titlePrincipal}>INFRAESTRUCTURA DE EDUCACIÓN ESPECIAL</h2>
            <p style={styles.subtitlePeriodo}>Periodo: {periodoActual}</p>
            <div style={styles.divider} />
          </div>

          {/* TABLA 1: SOFTWARE */}
          <div style={{ width: '100%', marginBottom: '30px' }}>
            <div style={styles.tableContainer}>
              <table style={styles.table}>
                <thead>
                  <tr style={{ backgroundColor: '#00264D', color: 'white' }}><th colSpan="4" style={styles.thMain}>NÚMERO DE SOFTWARE INFORMÁTICO ESPECIALIZADO</th></tr>
                  <tr style={{ backgroundColor: '#00264D', color: 'white', borderTop: '1px solid rgba(255,255,255,0.2)' }}>
                    <th style={styles.th}>Software</th><th style={styles.th}>TESJO</th><th style={styles.th}>EXTENSIÓN ACULCO</th><th style={styles.th}>TOTAL</th>
                  </tr>
                </thead>
                <tbody>
                  {datosSoftware.map((f, i) => (
                    <tr key={f.id}>
                      <td style={styles.tdInput} contentEditable onKeyDown={(e) => logicSoftware.handleKeyDown(e, i, 0)}
                        onBlur={(e) => updateCell(setDatosSoftware, datosSoftware, i, 'software', e.target.innerText)}>{f.software}</td>
                      <td style={styles.tdInput} contentEditable onKeyDown={(e) => logicSoftware.handleKeyDown(e, i, 1)}
                        onBlur={(e) => updateCell(setDatosSoftware, datosSoftware, i, 'tesjo', e.target.innerText)}>{f.tesjo}</td>
                      <td style={styles.tdInput} contentEditable onKeyDown={(e) => logicSoftware.handleKeyDown(e, i, 2)}
                        onBlur={(e) => updateCell(setDatosSoftware, datosSoftware, i, 'aculco', e.target.innerText)}>{f.aculco}</td>
                      <td style={styles.tdTotalFila}>{(Number(f.tesjo) || 0) + (Number(f.aculco) || 0)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div style={styles.dualTableWrapper}>
            {/* TESJO */}
            <div style={styles.subTableContainer}>
              <h3 style={styles.plantelTitle}>TESJO</h3>
              <table style={styles.table}>
                <thead>
                  <tr style={{ backgroundColor: '#00264D', color: 'white' }}><th style={styles.th}>Equipo</th><th style={styles.th}>Op.</th><th style={styles.th}>Rep.</th><th style={styles.th}>Res.</th><th style={styles.th}>Total</th></tr>
                </thead>
                <tbody>
                  {datosTesjo.map((f, i) => (
                    <tr key={f.id}>
                      <td style={styles.tdEquipo}>{f.equipo}</td>
                      <td style={styles.tdInput} contentEditable onKeyDown={(e) => logicTesjo.handleKeyDown(e, i, 1)}
                        onBlur={(e) => updateCell(setDatosTesjo, datosTesjo, i, 'operacion', e.target.innerText)}>{f.operacion}</td>
                      <td style={styles.tdInput} contentEditable onKeyDown={(e) => logicTesjo.handleKeyDown(e, i, 2)}
                        onBlur={(e) => updateCell(setDatosTesjo, datosTesjo, i, 'reparacion', e.target.innerText)}>{f.reparacion}</td>
                      <td style={styles.tdInput} contentEditable onKeyDown={(e) => logicTesjo.handleKeyDown(e, i, 3)}
                        onBlur={(e) => updateCell(setDatosTesjo, datosTesjo, i, 'reserva', e.target.innerText)}>{f.reserva}</td>
                      <td style={styles.tdTotalFila}>{calcTotalFila(f)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* ACULCO */}
            <div style={styles.subTableContainer}>
              <h3 style={styles.plantelTitle}>ACULCO</h3>
              <table style={styles.table}>
                <thead>
                  <tr style={{ backgroundColor: '#00264D', color: 'white' }}><th style={styles.th}>Equipo</th><th style={styles.th}>Op.</th><th style={styles.th}>Rep.</th><th style={styles.th}>Res.</th><th style={styles.th}>Total</th></tr>
                </thead>
                <tbody>
                  {datosAculco.map((f, i) => (
                    <tr key={f.id}>
                      <td style={styles.tdEquipo}>{f.equipo}</td>
                      <td style={styles.tdInput} contentEditable onKeyDown={(e) => logicAculco.handleKeyDown(e, i, 1)}
                        onBlur={(e) => updateCell(setDatosAculco, datosAculco, i, 'operacion', e.target.innerText)}>{f.operacion}</td>
                      <td style={styles.tdInput} contentEditable onKeyDown={(e) => logicAculco.handleKeyDown(e, i, 2)}
                        onBlur={(e) => updateCell(setDatosAculco, datosAculco, i, 'reparacion', e.target.innerText)}>{f.reparacion}</td>
                      <td style={styles.tdInput} contentEditable onKeyDown={(e) => logicAculco.handleKeyDown(e, i, 3)}
                        onBlur={(e) => updateCell(setDatosAculco, datosAculco, i, 'reserva', e.target.innerText)}>{f.reserva}</td>
                      <td style={styles.tdTotalFila}>{calcTotalFila(f)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="no_imprimir_botones_ia" style={styles.buttonContainer}>
            <BotonLimpiar onClick={() => window.location.reload()} />
            <BotonAgregar onClick={() => setDatosSoftware([...datosSoftware, { id: Date.now(), software: '', tesjo: '', aculco: '' }])} />
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
  mainContainer: { width: '100%', display: 'flex', justifyContent: 'center', padding: '20px 0 40px 0', backgroundColor: '#f5f5f5' },
  pageWrapper: { backgroundColor: 'white', width: '98%', display: 'flex', flexDirection: 'column', position: 'relative', boxShadow: '0 0 15px rgba(0,0,0,0.1)', minHeight: 'auto', overflow: 'hidden' },
  marginContent: { padding: '20px 2%', flex: '1 0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  fullImageContainer: { width: '100%', lineHeight: '0' },
  fullImageContainerFooter: { width: '100%', marginTop: 'auto', lineHeight: '0', borderTop: '1px solid #eee' },
  fullWidthImg: { width: '100%', display: 'block' },
  contentHeader: { width: '100%', textAlign: 'center', marginBottom: '20px' },
  titlePrincipal: { fontSize: '1.3rem', fontWeight: 'bold', fontFamily: Typography.principal },
  subtitlePeriodo: { fontSize: '1rem', color: '#333' },
  divider: { height: '3px', backgroundColor: '#00264D', width: '100%', marginTop: '10px' },
  tableContainer: { border: '1px solid #ccc', borderRadius: '4px', overflow: 'hidden', width: '100%' },
  dualTableWrapper: { display: 'flex', gap: '20px', width: '100%', justifyContent: 'center' },
  subTableContainer: { flex: '1', border: '1px solid #ccc', borderRadius: '4px', overflow: 'hidden' },
  plantelTitle: { textAlign: 'center', padding: '8px', backgroundColor: '#f8f9fa', fontSize: '1rem', fontWeight: 'bold', borderBottom: '2px solid #00264D' },
  table: { width: '100%', borderCollapse: 'collapse' },
  thMain: { padding: '10px', fontSize: '0.85rem' },
  th: { padding: '8px', fontSize: '0.7rem', borderRight: '1px solid rgba(255,255,255,0.1)' },
  tdEquipo: { padding: '6px 10px', fontSize: '0.7rem', fontWeight: 'bold', borderBottom: '1px solid #eee' },
  tdInput: { padding: '6px', textAlign: 'center', fontSize: '0.75rem', border: '1px solid #eee', outline: 'none' },
  tdTotalFila: { padding: '6px', textAlign: 'center', fontSize: '0.75rem', fontWeight: 'bold', backgroundColor: '#f0f4f8' },
  buttonContainer: { display: 'flex', gap: '15px', marginTop: '30px', marginBottom: '20px' }
};

export default EducacionEspecial;