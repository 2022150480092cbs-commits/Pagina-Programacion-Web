import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Colors } from '../../../../../components/generalStyle/StylesConfig';
import useExport from '../../../../../hooks/useExport';
import {
    BotonSincronizar,
    BotonAgregar,
    BotonLimpiar,
} from '../../../../../components/BotonesTablas';

const TablasInfraestructura = () => {
    const { periodoId } = useParams();
    const [periodoActual, setPeriodoActual] = useState(periodoId || "Septiembre 2025 – Febrero 2026");

    useEffect(() => {
        if(periodoId) setPeriodoActual(periodoId);
    }, [periodoId]);

    // =================== Infraestructura ===================
    const columnasInfra = ['marca','modelo','plataforma','arquitectura','procesador','memoria','disco','tipoServidor','monitor','capCache','tarjetaRed','tarjetaSonido','tarjetaVideo','raton','teclado'];
    const headersInfra = ['MARCA','MODELO','PLATAFORMA','ARQUITECTURA','PROCESADOR','CAPACIDAD MEMORIA','CAPACIDAD DISCO','TIPO SERVIDOR','MONITOR','CACHE','TARJETA RED','TARJETA SONIDO','TARJETA VIDEO','RATÓN','TECLADO'];

    const [tesInfra, setTesInfra] = useState([columnasInfra.reduce((acc, key) => ({...acc, [key]:''}), {id: Date.now()})]);
    const [aculcoInfra, setAculcoInfra] = useState([columnasInfra.reduce((acc, key) => ({...acc, [key]:''}), {id: Date.now()+1})]);

    // =================== Telecomunicaciones ===================
    const columnasTelecom = ['tipo','marca','modelo','caracteristicas','cantidad'];
    const headersTelecom = ['TIPO','MARCA','MODELO','CARACTERÍSTICAS','CANTIDAD'];

    const [tesTelecom, setTesTelecom] = useState([columnasTelecom.reduce((acc, key) => ({...acc, [key]:''}), {id: Date.now()+2})]);
    const [aculcoTelecom, setAculcoTelecom] = useState([columnasTelecom.reduce((acc, key) => ({...acc, [key]:''}), {id: Date.now()+3})]);

    // --- EXPORT PDF / EXCEL ---
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

    // ======= FUNCIONES PARA AGREGAR Y ACTUALIZAR FILAS =======
    const agregarFilaInfra = () => {
        const nuevaTes = columnasInfra.reduce((acc,key)=>({...acc,[key]:''}), {id: Date.now()});
        const nuevaAculco = columnasInfra.reduce((acc,key)=>({...acc,[key]:''}), {id: Date.now()+1});
        setTesInfra([...tesInfra, nuevaTes]);
        setAculcoInfra([...aculcoInfra, nuevaAculco]);
    };

    const agregarFilaTelecom = () => {
        const nuevaTes = columnasTelecom.reduce((acc,key)=>({...acc,[key]:''}), {id: Date.now()});
        const nuevaAculco = columnasTelecom.reduce((acc,key)=>({...acc,[key]:''}), {id: Date.now()+1});
        setTesTelecom([...tesTelecom, nuevaTes]);
        setAculcoTelecom([...aculcoTelecom, nuevaAculco]);
    };

    const limpiarFilas = (tabla) => {
        if(tabla==='infra'){
            setTesInfra([columnasInfra.reduce((acc,key)=>({...acc,[key]:''}), {id: Date.now()})]);
            setAculcoInfra([columnasInfra.reduce((acc,key)=>({...acc,[key]:''}), {id: Date.now()+1})]);
        } else {
            setTesTelecom([columnasTelecom.reduce((acc,key)=>({...acc,[key]:''}), {id: Date.now()})]);
            setAculcoTelecom([columnasTelecom.reduce((acc,key)=>({...acc,[key]:''}), {id: Date.now()+1})]);
        }
    };

    const actualizarDato = (tabla, id, key, valor) => {
        const actualizar = (lista, setLista) => setLista(lista.map(fila => fila.id === id ? {...fila, [key]: valor} : fila));
        if(tabla==='tesInfra') actualizar(tesInfra, setTesInfra);
        if(tabla==='aculcoInfra') actualizar(aculcoInfra, setAculcoInfra);
        if(tabla==='tesTelecom') actualizar(tesTelecom, setTesTelecom);
        if(tabla==='aculcoTelecom') actualizar(aculcoTelecom, setAculcoTelecom);
    };

    const estiloColumna = {
        borderBottom: '1px solid #ccc',
        borderRight: '1px solid #ccc',
        padding: '6px',
        textAlign: 'center',
        minWidth: '100px',
        fontSize: '0.75rem' // 🔹 letra más pequeña
    };

    const renderTabla = (titulo, tes, aculco, keys, headers, tablaId) => (
        <div style={{ marginBottom: 40 }}>
            <h3 style={{ textAlign:'center', marginBottom: 5, fontSize:'0.85rem' }}>{titulo}</h3>
            <p style={{ textAlign:'center', marginTop:0, marginBottom:15, color:'#333', fontWeight:'bold', fontSize:'0.8rem' }}>{periodoActual}</p>
            <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ccc', fontSize:'0.75rem' }}>
                <thead style={{ backgroundColor: Colors.barraTitulo || '#00264D', color: '#fff', fontSize:'0.75rem' }}>
                    <tr>
                        {headers.map((header, i) => (
                            <th key={i} style={{ ...estiloColumna, fontWeight:'bold' }}>{header}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    <tr style={{ backgroundColor:'#e6e6e6', fontWeight:'bold', fontSize:'0.75rem' }}>
                        <td colSpan={keys.length}>TES JOCOTITLÁN</td>
                    </tr>
                    {tes.map(fila => (
                        <tr key={fila.id}>
                            {keys.map((key,i)=>(
                                <td
                                    key={i}
                                    contentEditable
                                    suppressContentEditableWarning
                                    onBlur={(e)=>{ actualizarDato(tablaId, fila.id, key, e.target.innerText); }}
                                    style={estiloColumna}
                                >
                                    {fila[key] || ''}
                                </td>
                            ))}
                        </tr>
                    ))}
                    <tr style={{ backgroundColor:'#e6e6e6', fontWeight:'bold', fontSize:'0.75rem' }}>
                        <td colSpan={keys.length}>EXTENSIÓN ACULCO</td>
                    </tr>
                    {aculco.map(fila => (
                        <tr key={fila.id}>
                            {keys.map((key,i)=>(
                                <td
                                    key={i}
                                    contentEditable
                                    suppressContentEditableWarning
                                    onBlur={(e)=>{ actualizarDato(tablaId+'Aculco', fila.id, key, e.target.innerText); }}
                                    style={estiloColumna}
                                >
                                    {fila[key] || ''}
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
                {renderTabla("Listado de Servidores", tesInfra, aculcoInfra, columnasInfra, headersInfra, 'tesInfra')}
                {renderTabla("Dispositivos de Conectividad", tesTelecom, aculcoTelecom, columnasTelecom, headersTelecom, 'tesTelecom')}
                
                {/* ===== BOTONES ABAJO DE LA ÚLTIMA TABLA ===== */}
                <div style={{ marginTop: 20, display:'flex', justifyContent:'center', gap:10 }}>
                    <BotonAgregar onClick={()=>{ agregarFilaInfra(); agregarFilaTelecom(); }} />
                    <BotonLimpiar onClick={()=>{ limpiarFilas('infra'); limpiarFilas('telecom'); }} />
                    <BotonSincronizar onClick={()=>alert("Función sincronizar aquí")} />
                </div>
            </div>
        </div>
    );
};

export default TablasInfraestructura;
