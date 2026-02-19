import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Colors } from '../../../../../components/generalStyle/StylesConfig';
import useExport from '../../../../../hooks/useExport';
import {
    BotonSincronizar,
    BotonAgregar,
    BotonLimpiar,
    BotonNuevaColumna
} from '../../../../../components/BotonesTablas';

const TablasInfraestructura = () => {

    const { periodoId } = useParams();
    const [periodoActual, setPeriodoActual] = useState(periodoId || "Septiembre 2025 – Febrero 2026");

    useEffect(() => {
        if (periodoId) setPeriodoActual(periodoId);
    }, [periodoId]);

    // =================== Infraestructura ===================
    const columnasInfra = ['marca','modelo','plataforma','arquitectura','procesador','memoria','disco','tipoServidor','monitor','capCache','tarjetaRed','tarjetaSonido','tarjetaVideo','raton','teclado'];
    const headersInfra = ['MARCA','MODELO','PLATAFORMA','ARQUITECTURA','PROCESADOR','CAPACIDAD MEMORIA','CAPACIDAD DISCO','TIPO SERVIDOR','MONITOR','CACHE','TARJETA RED','TARJETA SONIDO','TARJETA VIDEO','RATÓN','TECLADO'];

    const crearFilaInfra = () =>
        columnasInfra.reduce((acc, key) => ({ ...acc, [key]: '' }), { id: Date.now() + Math.random() });

    const [tesInfra, setTesInfra] = useState([crearFilaInfra()]);
    const [aculcoInfra, setAculcoInfra] = useState([crearFilaInfra()]);

    // =================== Telecomunicaciones ===================
    const columnasTelecom = ['tipo','marca','modelo','caracteristicas','cantidad'];
    const headersTelecom = ['TIPO','MARCA','MODELO','CARACTERÍSTICAS','CANTIDAD'];

    const crearFilaTelecom = () =>
        columnasTelecom.reduce((acc, key) => ({ ...acc, [key]: '' }), { id: Date.now() + Math.random() });

    const [tesTelecom, setTesTelecom] = useState([crearFilaTelecom()]);
    const [aculcoTelecom, setAculcoTelecom] = useState([crearFilaTelecom()]);

    // =================== EXPORT ===================
    const { exportToPDF, exportToExcel } = useExport();

    useEffect(() => {
        const handlePDF = () => exportToPDF('area-oficial-tablas', `Infraestructura y Telecomunicaciones - ${periodoActual}`);

        const handleExcel = () => {
            const allData = {
                'Servidores TES': tesInfra,
                'Servidores Aculco': aculcoInfra,
                'Dispositivos TES': tesTelecom,
                'Dispositivos Aculco': aculcoTelecom
            };
            exportToExcel(allData, `Infraestructura y Telecomunicaciones - ${periodoActual}`);
        };

        window.addEventListener('descargar-pdf-global', handlePDF);
        window.addEventListener('descargar-excel-global', handleExcel);

        return () => {
            window.removeEventListener('descargar-pdf-global', handlePDF);
            window.removeEventListener('descargar-excel-global', handleExcel);
        };
    }, [tesInfra, aculcoInfra, tesTelecom, aculcoTelecom, periodoActual]);

    // =================== FUNCIONES GENERALES ===================
    const agregarFilasAmbasTablas = () => {
        setTesInfra(prev => [...prev, crearFilaInfra()]);
        setAculcoInfra(prev => [...prev, crearFilaInfra()]);
        setTesTelecom(prev => [...prev, crearFilaTelecom()]);
        setAculcoTelecom(prev => [...prev, crearFilaTelecom()]);
    };

    const limpiarTodo = () => {
        if (window.confirm("¿Deseas limpiar todas las tablas?")) {
            setTesInfra([crearFilaInfra()]);
            setAculcoInfra([crearFilaInfra()]);
            setTesTelecom([crearFilaTelecom()]);
            setAculcoTelecom([crearFilaTelecom()]);
        }
    };

    const actualizarDato = (lista, setLista, id, key, valor) => {
        setLista(lista.map(fila =>
            fila.id === id ? { ...fila, [key]: valor } : fila
        ));
    };

    const estiloColumna = {
        borderBottom: '1px solid #ccc',
        borderRight: '1px solid #ccc',
        padding: '6px',
        textAlign: 'center',
        minWidth: '100px'
    };

    const renderTabla = (titulo, tes, setTes, aculco, setAculco, keys, headers, mostrarPeriodo = false) => (
        <div style={{ marginBottom: 40 }}>
            <h3 style={{ textAlign:'center', marginBottom: 5 }}>{titulo}</h3>

            {mostrarPeriodo && (
                <p style={{ textAlign:'center', marginTop:0, marginBottom:15 }}>
                    {periodoActual}
                </p>
            )}

            <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ccc' }}>
                <thead style={{ backgroundColor: Colors.barraTitulo || '#00264D', color: '#fff' }}>
                    <tr>
                        {headers.map((header, i) => (
                            <th
                                key={i}
                                style={{
                                    ...estiloColumna,
                                    fontWeight: 'bold',
                                    fontSize: '12px' // 👈 letra más chica
                                }}
                            >
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    <tr style={{ backgroundColor:'#e6e6e6', fontWeight:'bold' }}>
                        <td colSpan={keys.length}>TES JOCOTITLÁN</td>
                    </tr>

                    {tes.map(fila => (
                        <tr key={fila.id}>
                            {keys.map((key,i)=>(
                                <td
                                    key={i}
                                    contentEditable
                                    suppressContentEditableWarning
                                    onBlur={(e)=> actualizarDato(tes, setTes, fila.id, key, e.target.innerText)}
                                    style={estiloColumna}
                                >
                                    {fila[key]}
                                </td>
                            ))}
                        </tr>
                    ))}

                    <tr style={{ backgroundColor:'#e6e6e6', fontWeight:'bold' }}>
                        <td colSpan={keys.length}>EXTENSIÓN ACULCO</td>
                    </tr>

                    {aculco.map(fila => (
                        <tr key={fila.id}>
                            {keys.map((key,i)=>(
                                <td
                                    key={i}
                                    contentEditable
                                    suppressContentEditableWarning
                                    onBlur={(e)=> actualizarDato(aculco, setAculco, fila.id, key, e.target.innerText)}
                                    style={estiloColumna}
                                >
                                    {fila[key]}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    return (
        <div style={{ width:'100%', display:'flex', justifyContent:'center', backgroundColor:'#f2f2f2', padding:20 }}>
            <div id="area-oficial-tablas" style={{ width:'100%', maxWidth:1400, backgroundColor:'#fff', padding:20, border:'3px solid #00264D', borderRadius:4, overflowX:'auto' }}>
                
                {renderTabla(
                    "Listado de Servidores",
                    tesInfra, setTesInfra,
                    aculcoInfra, setAculcoInfra,
                    columnasInfra,
                    headersInfra,
                    true
                )}

                {renderTabla(
                    "Dispositivos de Conectividad",
                    tesTelecom, setTesTelecom,
                    aculcoTelecom, setAculcoTelecom,
                    columnasTelecom,
                    headersTelecom,
                    false
                )}

                {/* BOTONES GENERALES */}
                <div style={{ marginTop: 20, display:'flex', justifyContent:'center', gap:15 }}>
                    <BotonLimpiar onClick={limpiarTodo} />
                    <BotonNuevaColumna onClick={()=> alert("Función agregar columna aquí")} />
                    <BotonAgregar onClick={agregarFilasAmbasTablas} />
                    <BotonSincronizar onClick={()=> alert("Función sincronizar aquí")} />
                </div>

            </div>
        </div>
    );
};

export default TablasInfraestructura;
