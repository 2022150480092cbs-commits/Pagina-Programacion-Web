import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Colors, Typography } from '../../components/generalStyle/StylesConfig';

const AcademicaHome = () => {
    const navigate = useNavigate();

    // Lista de departamentos con sus respectivas rutas
    const departamentos = [
        { nombre: "Departamento de Desarrollo Académico", ruta: "desarrollo-academico" },
        { nombre: "Departamento de Centro de Cómputo", ruta: "computo" },
        { nombre: "Subdirección de Servicios Escolares", ruta: "escolares" }
    ];

    return (
        <div className="container" style={{ fontFamily: Typography.principal }}>
            
            {/* TÍTULO CON EL NUEVO DISEÑO INSTITUCIONAL */}
            <div className="header-title-container">
                <h2>Dirección Académica</h2>
            </div>

            {/* CONTENEDOR DE BOTONES DE DEPARTAMENTOS */}
            <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                gap: '20px', 
                width: '100%',
                marginTop: '10px' 
            }}>
                {departamentos.map((dep, index) => (
                    <button 
                        key={index}
                        onClick={() => navigate(`/dashboard/direccion-academica/${dep.ruta}`)}
                        style={{
                            width: '100%', 
                            maxWidth: '600px', 
                            padding: '20px',
                            backgroundColor: Colors.periodoActivo, 
                            color: 'white', 
                            border: 'none',
                            borderRadius: '12px', 
                            fontWeight: '600', 
                            fontSize: '1.1rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                            transition: 'transform 0.2s, background-color 0.2s'
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.transform = 'scale(1.02)';
                            e.currentTarget.style.backgroundColor = '#005bb5';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.transform = 'scale(1)';
                            e.currentTarget.style.backgroundColor = Colors.periodoActivo;
                        }}
                    >
                        {dep.nombre}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default AcademicaHome;