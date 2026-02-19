import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchEvaluaciones, saveEvaluacion } from "../../../../../api/firebaseService";
import { Colors } from "../../../../../components/generalStyle/StylesConfig";
import { BotonSincronizar, BotonNuevaColumna, BotonAgregar, BotonLimpiar } from "../../../../../components/BotonesTablas";
import useExport from "../../../../../hooks/useExport";

/* =====================================================
🔵 TABLA 1 — SOFTWARE ESPECIALIZADO
===================================================== */

const SoftwareEspecializado = ({ periodoActual }) => {

  const [datos, setDatos] = useState([]);
  const [columnas, setColumnas] = useState([
    { key: "tes", label: "TESJO" },
    { key: "aculco", label: "EXTENSIÓN ACULCO" }
  ]);
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    const cargar = async () => {
      const idDoc = `software-especializado-${periodoActual}`;
      const resp = await fetchEvaluaciones(idDoc);

      if (resp?.registros && Array.isArray(resp.registros) && resp.registros.length > 0 && typeof resp.registros[0] === "object") {
        setDatos(resp.registros);
        setColumnas(resp.columnas || columnas);
      } else {
        setDatos([]);
      }

      setLoading(false);
    };
    cargar();
  }, [periodoActual]);

  const agregarFila = () => {
    const nombre = window.prompt("¿Qué software deseas agregar?");
    if (!nombre) return;

    const nueva = { id: Date.now(), nombre, isNew: true };
    columnas.forEach(col => (nueva[col.key] = ""));
    setDatos([...datos, nueva]);
  };

  const agregarColumna = () => {
    const nombre = window.prompt("Nombre del nuevo programa:");
    if (!nombre) return;

    const key = nombre.toLowerCase().replace(/\s+/g, "_");
    const nuevaCol = { key, label: nombre };
    const nuevosDatos = datos.map(f => ({ ...f, [key]: "" }));

    setColumnas([...columnas, nuevaCol]);
    setDatos(nuevosDatos);
  };

  const limpiarTabla = () => setDatos(datos.filter(f => !f.isNew));

  const handleChange = (i, key, value) => {
    const nuevos = [...datos];
    nuevos[i][key] = value;
    setDatos(nuevos);
  };

  const guardar = async () => {
    setGuardando(true);
    await saveEvaluacion({
      id: `software-especializado-${periodoActual}`,
      registros: datos,
      columnas,
      area: "Centro de Cómputo",
      subarea: "Software Especializado",
      periodo: periodoActual
    });
    alert("Guardado correctamente");
    setGuardando(false);
  };

  const totalGeneral = columnas.reduce(
    (acc, col) =>
      acc + datos.reduce((sum, fila) => sum + (Number(fila[col.key]) || 0), 0),
    0
  );

  if (loading) return <div>Cargando Software Especializado...</div>;

  return (
    <div style={styles.softwareContainer}>
      <h3 style={styles.softwareTitle}>
        NÚMERO DE SOFTWARE INFORMÁTICO ESPECIALIZADO PARA ESTUDIANTES CON DISCAPACIDAD
      </h3>

      <table style={styles.softwareTable}>
        <thead>
          <tr style={styles.headerRow}>
            <th style={styles.th}>Software</th>
            {columnas.map(col => <th key={col.key} style={styles.th}>{col.label}</th>)}
            <th style={styles.th}>TOTAL</th>
          </tr>
        </thead>
        <tbody>
          {datos.map((fila, i) => {
            const totalFila = columnas.reduce(
              (acc, col) => acc + (Number(fila[col.key]) || 0),
              0
            );

            return (
              <tr key={fila.id}>
                <td style={styles.tdLabel}>{fila.nombre}</td>
                {columnas.map(col => (
                  <td key={col.key} style={styles.td}>
                    <input
                      type="number"
                      value={fila[col.key]}
                      onChange={e => handleChange(i, col.key, e.target.value)}
                      style={styles.input}
                    />
                  </td>
                ))}
                <td style={styles.tdTotal}>{totalFila}</td>
              </tr>
            );
          })}

          <tr style={styles.totalRow}>
            <td>TOTAL</td>
            {columnas.map(col => (
              <td key={col.key}>
                {datos.reduce((sum, fila) => sum + (Number(fila[col.key]) || 0), 0)}
              </td>
            ))}
            <td>{totalGeneral}</td>
          </tr>
        </tbody>
      </table>

      <div style={styles.botonesHorizontal} className="no-export">
        <BotonAgregar onClick={agregarFila} />
        <BotonNuevaColumna onClick={agregarColumna} />
        <BotonLimpiar onClick={limpiarTabla} />
        <BotonSincronizar onClick={guardar} loading={guardando} />
      </div>
    </div>
  );
};

/* =====================================================
🔵 TABLAS 2 Y 3 — EQUIPO Y MOBILIARIO
===================================================== */

const filasBase = [
  "Impresoras Braille",
  "Pantallas de Toque",
  "Atriles",
  "Teléfonos para Personas Sordas",
  "Computadoras con Pantalla Táctil",
  "Teclados Alternativos",
  "Ratones (Mouse) Alternativos",
  "Magnificadores o Lupas",
  "Comunicadores",
  "Otros (Especificar)"
];

const TablaEquipo = ({ titulo, idDocBase, periodoActual }) => {

  const [datos, setDatos] = useState([]);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    const cargar = async () => {
      const idDoc = `${idDocBase}-${periodoActual}`;
      const resp = await fetchEvaluaciones(idDoc);

      if (resp?.registros && Array.isArray(resp.registros) && resp.registros.length > 0 && typeof resp.registros[0] === "object") {
        setDatos(resp.registros);
      } else {
        setDatos(
          filasBase.map((f, i) => ({
            id: Date.now() + i,
            equipo: f,
            operacion: "",
            reparacion: "",
            reserva: ""
          }))
        );
      }
    };
    cargar();
  }, [periodoActual, idDocBase]);

  const total = campo =>
    datos.reduce((acc, f) => acc + (Number(f[campo]) || 0), 0);

  const guardar = async () => {
    setGuardando(true);
    await saveEvaluacion({
      id: `${idDocBase}-${periodoActual}`,
      registros: datos,
      area: "Centro de Cómputo",
      subarea: titulo,
      periodo: periodoActual
    });
    alert("Guardado correctamente");
    setGuardando(false);
  };

  return (
    <div style={styles.tablaContainer}>
      <h3 style={styles.subtitulo}>{titulo}</h3>
      <table style={styles.table}>
        <thead>
          <tr style={styles.headerRow}>
            <th style={styles.th}>Equipo</th>
            <th style={styles.th}>Operación</th>
            <th style={styles.th}>Reparación</th>
            <th style={styles.th}>Reserva</th>
            <th style={styles.th}>Total</th>
          </tr>
        </thead>
        <tbody>
          {datos.map(f => {
            const totalFila =
              (Number(f.operacion) || 0) +
              (Number(f.reparacion) || 0) +
              (Number(f.reserva) || 0);

            return (
              <tr key={f.id}>
                <td style={styles.tdLabel}>{f.equipo}</td>
                {["operacion", "reparacion", "reserva"].map(campo => (
                  <td key={campo} style={styles.td}>
                    <input
                      type="number"
                      value={f[campo]}
                      onChange={e =>
                        setDatos(
                          datos.map(d =>
                            d.id === f.id ? { ...d, [campo]: e.target.value } : d
                          )
                        )
                      }
                      style={styles.input}
                    />
                  </td>
                ))}
                <td style={styles.tdTotal}>{totalFila}</td>
              </tr>
            );
          })}

          <tr style={styles.totalRow}>
            <td>TOTAL</td>
            <td>{total("operacion")}</td>
            <td>{total("reparacion")}</td>
            <td>{total("reserva")}</td>
            <td>{total("operacion") + total("reparacion") + total("reserva")}</td>
          </tr>
        </tbody>
      </table>

      <div style={styles.botonesHorizontal} className="no-export">
        <BotonSincronizar onClick={guardar} loading={guardando} />
      </div>
    </div>
  );
};

/* =====================================================
🔵 COMPONENTE PRINCIPAL
===================================================== */

const EducacionEspecial = () => {

  const { periodoId } = useParams();
  const periodoActual = periodoId || "Septiembre 2025 – Febrero 2026";
  const { exportToPDF, exportToExcel } = useExport();

  useEffect(() => {
    const handlePDF = () =>
      exportToPDF("area-oficial-impresion", `Educación Especial - ${periodoActual}`);

    const handleExcel = () =>
      exportToExcel(
        document.querySelectorAll("#area-oficial-impresion table"),
        `Educación Especial - ${periodoActual}`
      );

    window.addEventListener("descargar-pdf-global", handlePDF);
    window.addEventListener("descargar-excel-global", handleExcel);

    return () => {
      window.removeEventListener("descargar-pdf-global", handlePDF);
      window.removeEventListener("descargar-excel-global", handleExcel);
    };
  }, [periodoActual, exportToPDF, exportToExcel]);

  return (
    <div style={styles.mainContainer}>
      <div id="area-oficial-impresion">

        <h2 style={{ textAlign: "center", marginBottom: 20 }}>
          Periodo: {periodoActual}
        </h2>

        <SoftwareEspecializado periodoActual={periodoActual} />

        <div style={styles.contenedorDoble}>
          <TablaEquipo
            titulo="TESJO"
            idDocBase="equipo-mobiliario-tes"
            periodoActual={periodoActual}
          />
          <TablaEquipo
            titulo="EXTENSIÓN ACULCO"
            idDocBase="equipo-mobiliario-aculco"
            periodoActual={periodoActual}
          />
        </div>

      </div>
    </div>
  );
};

/* =====================================================
🔵 ESTILOS (SIN CAMBIOS)
===================================================== */

const styles = {
  mainContainer: { padding: 30, backgroundColor: "#f5f5f5" },
  contenedorDoble: { display: "flex", gap: 30, marginTop: 30 },
  tablaContainer: { width: "50%", background: "white", padding: 20, borderRadius: 6 },
  subtitulo: { textAlign: "center", marginBottom: 15, fontWeight: "bold" },
  table: { width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" },
  softwareContainer: { background: "white", padding: 15, borderRadius: 6, width: "85%", margin: "0 auto 30px auto" },
  softwareTitle: { textAlign: "center", fontSize: "0.9rem", marginBottom: 15, fontWeight: "bold" },
  softwareTable: { width: "100%", borderCollapse: "collapse", fontSize: "0.75rem" },
  headerRow: { backgroundColor: Colors.barraTitulo || "#00264D", color: "white", fontWeight: "bold" },
  th: { padding: 6 },
  td: { padding: 6, textAlign: "center", border: "1px solid #ddd", backgroundColor: "white" },
  tdLabel: { padding: 6, border: "1px solid #ddd", backgroundColor: "white" },
  tdTotal: { fontWeight: "bold", border: "1px solid #ddd", backgroundColor: "white" },
  totalRow: { backgroundColor: Colors.barraTitulo || "#00264D", color: "white", fontWeight: "bold", textAlign: "center" },
  input: { width: "55px", height: "26px", textAlign: "center", backgroundColor: "white", border: "1px solid #ccc", borderRadius: 4 },
  botonesHorizontal: { marginTop: 15, display: "flex", gap: 10, justifyContent: "center" }
};

export default EducacionEspecial;