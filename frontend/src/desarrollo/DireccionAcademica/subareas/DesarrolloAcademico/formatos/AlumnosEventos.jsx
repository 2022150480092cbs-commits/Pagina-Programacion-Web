import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useExport from '../../../../../hooks/useExport';
import { Assets, Typography } from '../../../../../components/generalStyle/StylesConfig';
import { fetchEvaluaciones, saveEvaluacion } from '../../../../../api/firebaseService';
import { useTableLogic } from '../../../../../hooks/useTableLogic';

import { SelectPrograma } from '../../../../../components/OrdenProgramas/Matricula';
import {
  BotonSincronizar,
  BotonAgregar,
  BotonLimpiar,
  BotonNuevaColumna
} from '../../../../../components/BotonesTablas';

const AlumnosEventos = () => {
  const { periodoId } = useParams();
  const [datos, setDatos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actualizando, setActualizando] = useState(false);
  const [programasExtra, setProgramasExtra] = useState([]);

  const columnas = [
    { key: 'programa', label: 'PROGRAMA ACADÉMICO' },
    { key: 'nombre', label: 'NOMBRE' },
    { key: 'sexo', label: 'SEXO' },
    { key: 'etapa', label: 'ETAPA' },
    { key: 'fecha', label: 'FECHA' },
    { key: 'resultados', label: 'RESULTADOS' },
    { key: 'observaciones', label: 'OBSERVACIONES' }
  ];

  const { exportToPDF, exportToExcel } = useExport();
  const periodoActual = periodoId || "Septiembre 2025 – Febrero 2026";

  useEffect(() => {
    const handlePDF = () => exportToPDF();
    const handleExcel = () => exportToExcel(datos, columnas, `Estudiantes en Eventos - ${periodoActual}`);

    window.addEventListener('descargar-pdf-global', handlePDF);
    window.addEventListener('descargar-excel-global', handleExcel);

    return () => {
      window.removeEventListener('descargar-pdf-global', handlePDF);
      window.removeEventListener('descargar-excel-global', handleExcel);
    };
  }, [datos, periodoActual]);

  const calcularValorFila = (fila, index) => {
    if (!fila.esSubtotal) return fila.nombre;
    const filtrar = (idPrefix) => datos.slice(0, index).filter(r => r.id.startsWith(idPrefix) && !r.esSubtotal && r.nombre && r.nombre.trim() !== '').length;
    if (fila.id === 'joco-SUBTOTAL_LICENCIATURA_ESCOLARIZADA') return filtrar('joco-');
    if (fila.id === 'acul-TOTAL_EXTENSIÓN_ACULCO') return filtrar('acul-');
    if (fila.id === 'total-gral-final') return datos.filter(r => !r.esSubtotal && !r.esSeparador && r.nombre && r.nombre.trim() !== '').length;
    const buscarInicio = (idSub) => datos.findIndex(r => r.id === idSub) + 1;
    if (fila.id === 'joco-SUBTOTAL_LICENCIATURA_NO_ESCOLARIZADA') return datos.slice(buscarInicio('joco-SUBTOTAL_LICENCIATURA_ESCOLARIZADA'), index).filter(r => !r.esSubtotal && r.nombre && r.nombre.trim() !== '').length;
    if (fila.id === 'joco-SUBTOTAL_MAESTRÍA') return datos.slice(buscarInicio('joco-SUBTOTAL_LICENCIATURA_NO_ESCOLARIZADA'), index).filter(r => !r.esSubtotal && r.nombre && r.nombre.trim() !== '').length;
    if (fila.id === 'joco-SUBTOTAL_DOCTORADO') return datos.slice(buscarInicio('joco-SUBTOTAL_MAESTRÍA'), index).filter(r => !r.esSubtotal && r.nombre && r.nombre.trim() !== '').length;
    return "";
  };

  const generarEstructuraBase = () => {
    const listado = [];
    listado.push({ id: 'header-jocotitlan', programa: 'JOCOTITLÁN', esSeparador: true });
    const pJoco = ["INGENIERÍA ELECTROMECÁNICA", "INGENIERÍA INDUSTRIAL", "INGENIERÍA EN SISTEMAS COMPUTACIONALES", "INGENIERÍA MECATRÓNICA", "ARQUITECTURA", "CONTADOR PÚBLICO", "INGENIERÍA EN GESTIÓN EMPRESARIAL", "INGENIERÍA QUÍMICA", "INGENIERÍA EN MATERIALES", "INGENIERÍA EN ANIMACIÓN DIGITAL Y EFECTOS VISUALES", "LICENCIATURA EN TURISMO", "INGENIERÍA EN LOGÍSTICA", "SUBTOTAL LICENCIATURA ESCOLARIZADA", "INGENIERÍA INDUSTRIAL NO ESCOLARIZADA", "SUBTOTAL LICENCIATURA NO ESCOLARIZADA", "MAESTRÍA EN INGENIERÍA", "MAESTRÍA EN INTELIGENCIA ARTIFICIAL", "SUBTOTAL MAESTRÍA", "DOCTORADO EN CIENCIAS DE LA INGENIERÍA", "SUBTOTAL DOCTORADO"];
    pJoco.forEach(p => listado.push({ id: `joco-${p.replace(/\s+/g, '_')}`, programa: p, nombre: '', sexo: '', etapa: '', fecha: '', resultados: '', observaciones: '', esSubtotal: p.includes("SUBTOTAL") }));
    listado.push({ id: 'header-aculco', programa: 'ACULCO', esSeparador: true });
    const pAcul = ["CONTADOR PÚBLICO", "INGENIERÍA INDUSTRIAL", "INGENIERÍA EN SISTEMAS COMPUTACIONALES", "LICENCIATURA EN TURISMO", "TOTAL EXTENSIÓN ACULCO"];
    pAcul.forEach(p => listado.push({ id: `acul-${p.replace(/\s+/g, '_')}`, programa: p, nombre: '', sexo: '', etapa: '', fecha: '', resultados: '', observaciones: '', esSubtotal: p.includes("TOTAL") }));
    listado.push({ id: 'total-gral-final', programa: 'TOTAL MATRÍCULA', esSubtotal: true });
    return listado;
  };

  const { handleKeyDown, handleBlurCell } = useTableLogic(datos, setDatos, columnas.length);

  useEffect(() => {
    const cargarDatos = async () => {
      setLoading(true);
      try {
        const idDoc = `alumnos-eventos-${periodoActual}`;
        const res = await fetchEvaluaciones(idDoc, "centroComputo");
        const base = generarEstructuraBase();
        if (res && res.registros) {
          const fusion = base.map(b => {
            const g = res.registros.find(r => r.id === b.id);
            return g ? { ...b, ...g } : b;
          });
          setDatos(fusion);
        } else { setDatos(base); }
      } catch (error) { console.error(error); }
      finally { setLoading(false); }
    };
    cargarDatos();
  }, [periodoActual]);

  const handleSincronizar = async () => {
    setActualizando(true);
    try {
      await saveEvaluacion({ id: `alumnos-eventos-${periodoActual}`, registros: datos, periodo: periodoActual, area: "Centro de Cómputo", subarea: "Estudiantes en Eventos Académicos" }, "centroComputo");
      alert("¡Datos sincronizados!");
    } catch (error) { alert("Error al guardar."); }
    finally { setActualizando(false); }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>Cargando...</div>;

  return (
    <div className="container" style={styles.mainContainer}>
      <style>{`
        @media print {
          @page { size: landscape; margin: 0; }
          .no_imprimir_botones_ia { display: none !important; }
          body { background: white !important; -webkit-print-color-adjust: exact; }
          
          /* HEADER Y FOOTER FIJOS EN CADA HOJA */
          .print-header { position: fixed; top: 0; left: 0; width: 100%; height: 120px; }
          .print-footer { position: fixed; bottom: 0; left: 0; width: 100%; height: 100px; }
          
          /* MARGEN PARA QUE LA TABLA NO CHOQUE CON EL HEADER/FOOTER */
          .margin-content-print { 
            padding-top: 130px !important; 
            padding-bottom: 110px !important; 
            width: 95% !important; 
            margin: auto; 
          }
          
          tr { page-break-inside: avoid; break-inside: avoid; }
          thead { display: table-header-group; }
          #area-oficial-impresion { box-shadow: none !important; width: 100% !important; }
        }
        
        @media screen {
          .solo-print { display: none; }
          td[contenteditable="true"]:focus { background-color: #fff9c4 !important; outline: none; }
          td[contenteditable="true"] { word-break: break-word; white-space: normal; }
        }
      `}</style>

      <div id="area-oficial-impresion" style={styles.pageWrapper}>
        {/* HEADER */}
        <div className="solo-print print-header"><img src={Assets.header} alt="H" style={{ width: '100%' }} /></div>

        <div style={styles.marginContent} className="margin-content-print">
          <div style={styles.contentHeader}>
            <h2 style={styles.titlePrincipal}>ESTUDIANTES EN EVENTOS ACADÉMICOS</h2>
            <p style={styles.subtitlePeriodo}>Periodo: {periodoActual}</p>
            <div style={styles.divider} />
          </div>

          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead>
                <tr style={{ backgroundColor: '#00264D', color: 'white' }}>
                  {columnas.map(col => <th key={col.key} style={styles.th}>{col.label}</th>)}
                </tr>
              </thead>
              <tbody>
                {datos.map((fila, index) => {
                  const esFijo = fila.esSubtotal || fila.esSeparador;
                  return (
                    <tr key={fila.id} style={{ backgroundColor: esFijo ? '#f2f2f2' : '#ffffff', fontWeight: esFijo ? 'bold' : 'normal', borderBottom: '1px solid #eee' }}>
                      <td style={styles.tdPrograma} className="celda-espaciada">
                        {esFijo || fila.id.startsWith('joco-') || fila.id.startsWith('acul-') ? (
                          <div style={{ padding: '8px', fontSize: '0.7rem' }}>{fila.programa}</div>
                        ) : (<SelectPrograma value={fila.programa} onChange={v => handleBlurCell(index, 'programa', v)} />)}
                      </td>
                      <td style={styles.tdNombre} className="celda-espaciada" contentEditable={!esFijo} suppressContentEditableWarning onBlur={(e) => !esFijo && handleBlurCell(index, 'nombre', e.target.innerText.trim())}>
                        {calcularValorFila(fila, index)}
                      </td>
                      {columnas.slice(2).map((col, cIdx) => (
                        <td key={col.key} style={col.key === 'fecha' ? styles.tdFecha : styles.td} className="celda-espaciada" contentEditable={!esFijo} suppressContentEditableWarning onBlur={(e) => !esFijo && handleBlurCell(index, col.key, e.target.innerText.trim())}>
                          {fila[col.key]}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="no_imprimir_botones_ia" style={styles.buttonContainer}>
            <BotonLimpiar onClick={() => setDatos(generarEstructuraBase())} />
            <BotonNuevaColumna onClick={() => { const n = prompt("P:"); if (n) setProgramasExtra([...programasExtra, n.toUpperCase()]) }} />
            <BotonAgregar onClick={() => setDatos([...datos, { id: `extra-${Date.now()}`, programa: '', nombre: '' }])} />
            <BotonSincronizar onClick={handleSincronizar} loading={actualizando} />
          </div>
        </div>

        {/* FOOTER */}
        <div className="solo-print print-footer"><img src={Assets.footer} alt="F" style={{ width: '100%' }} /></div>
      </div>
    </div>
  );
};

const styles = {
  mainContainer: { width: '100%', display: 'flex', justifyContent: 'center', backgroundColor: '#f5f5f5', padding: '20px 0' },
  pageWrapper: { backgroundColor: 'white', width: '100%', maxWidth: '1400px', margin: '0 auto', display: 'flex', flexDirection: 'column', position: 'relative', boxShadow: '0 0 15px rgba(0,0,0,0.1)' },
  marginContent: { padding: '20px 1cm', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' },
  contentHeader: { textAlign: 'center', width: '100%', marginBottom: '20px' },
  titlePrincipal: { margin: '0', fontSize: '1.4rem', fontWeight: 'bold', fontFamily: Typography.principal },
  subtitlePeriodo: { margin: '5px 0', fontSize: '1rem', color: '#333', fontFamily: Typography.principal },
  divider: { height: '3px', backgroundColor: '#00264D', width: '100%', marginTop: '10px' },
  tableContainer: { border: '1px solid #ccc', borderRadius: '4px', overflow: 'hidden', width: '100%' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { padding: '12px', textAlign: 'center', fontSize: '0.6rem', borderRight: '1px solid rgba(255,255,255,0.1)' },
  tdPrograma: { padding: '12px 8px', fontSize: '0.7rem', borderRight: '1px solid #eee', minWidth: '320px', lineHeight: '1.3', verticalAlign: 'middle' },
  tdNombre: { padding: '12px 8px', fontSize: '0.7rem', borderRight: '1px solid #eee', minWidth: '220px', lineHeight: '1.3', verticalAlign: 'middle' },
  tdFecha: { padding: '12px 8px', textAlign: 'center', fontSize: '0.7rem', borderRight: '1px solid #eee', minWidth: '130px', lineHeight: '1.3', verticalAlign: 'middle' },
  td: { padding: '12px 8px', textAlign: 'center', fontSize: '0.7rem', outline: 'none', borderRight: '1px solid #eee', lineHeight: '1.3', verticalAlign: 'middle', minWidth: '100px' },
  buttonContainer: { display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '30px', width: '100%' }
};

export default AlumnosEventos;