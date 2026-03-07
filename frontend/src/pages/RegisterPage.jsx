// Archivo: RegisterPage.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';

const inputStyle = { padding: '10px', border: '1px solid #ccc', borderRadius: '5px', width: '100%', boxSizing: 'border-box' };

const InputField = ({ label, name, value, onChange, type, required, inputStyle: customInputStyle }) => (
    <div style={{ marginBottom: '15px' }}>
        <label className="input-label" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '0.9rem' }}>{label}</label>
        <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            className="input-field"
            style={{ ...inputStyle, ...customInputStyle }}
        />
    </div>
);

function RegisterPage() {
    const navigate = useNavigate();
    const { register, isLoading } = useAuth();

    // 1. OBJETO DE SUB-ÁREAS (Sincronizado con los values de AREAS)
    const subareasData = {
        "planeacion": [
            { name: "Departamento de Evaluación y Calidad Institucional", value: "Departamento de Evaluación y Calidad Institucional" }
        ],
        "docencia": [
            { name: "Departamento de Desarrollo Académico", value: "Departamento de Desarrollo Académico" },
            { name: "Departamento de Centro de Cómputo", value: "Departamento de Centro de Cómputo" },
            { name: "Departamento de Investigación en Ciencia y Tecnología", value: "Departamento de Investigación en Ciencia y Tecnología" },
            { name: "Subdirección de Servicios Escolares", value: "Subdirección de Servicios Escolares" },
            { name: "Unidad de Biblioteca", value: "Unidad de Biblioteca" },
            { name: "Subdirección de Servicios Profesionales", value: "Subdirección de Servicios Profesionales" }
        ],
        "vinculacion": [
            { name: "Subdirección de Extensión", value: "Subdirección de Extensión" },
            { name: "Unidad de Biblioteca", value: "Unidad de Biblioteca" },
            { name: "Departamento de Servicio Social y Residencia Profesional", value: "Departamento de Servicio Social y Residencia Profesional" }
        ],
        "administracion": [
            { name: "Departamento de Administración Personal", value: "Departamento de Administración Personal" },
            { name: "Departamento de Recursos Financieros", value: "Departamento de Recursos Financieros" },
            { name: "Departamento de Recursos Materiales y Servicios Generales", value: "Departamento de Recursos Materiales y Servicios Generales" }
        ]
    };

    const AREAS = [
        { value: "selecciona", label: "Selecciona tu Área", disabled: true },
        { value: "direccion", label: "Dirección General" },
        { value: "docencia", label: "Dirección Académica" },
        { value: "planeacion", label: "Unidad de Planeación" },
        { value: "sistemas", label: "División de Sistemas" },
        { value: "vinculacion", label: "Dirección de Vinculación y Extensión" },
        { value: "administracion", label: "Subdirección de Servicios Administrativos" },
    ];

    const [formData, setFormData] = useState({
        nombre: '', apellidoPaterno: '', apellidoMaterno: '', telefono: '',
        area: 'selecciona', subarea: '', correo: '', username: '',
        password: '', confirmPassword: '',
    });

    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        // Si cambia el área, reseteamos la subárea para que no se quede una anterior
        if (name === "area") {
            setFormData({ ...formData, [name]: value, subarea: '' });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        if (formData.password !== formData.confirmPassword) {
            setError('❌ Error: Las contraseñas no coinciden.');
            return;
        }

        const payload = {
            name: `${formData.nombre} ${formData.apellidoPaterno} ${formData.apellidoMaterno}`,
            email: formData.correo,
            username: formData.username,
            password: formData.password,
            phone: formData.telefono,
            area: formData.area,
            subarea: formData.subarea
        };

        try {
            await register(payload);
            setSuccessMessage("✅ ¡Registro exitoso!");
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setError(err.message || 'Error al registrar.');
        }
    };

    return (
        <Layout>
            <div style={{ backgroundColor: '#cccccc', minHeight: 'calc(100vh - 150px)', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '40px 0' }}>
                <div style={{ display: 'flex', width: '750px', height: '600px', backgroundColor: 'white', borderRadius: '15px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.3)', position: 'relative', zIndex: 10 }}>

                    {/* Panel Azul Izquierdo */}
                    <div style={{ flex: '0 0 350px', backgroundColor: '#213c7a', color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '40px', textAlign: 'center' }}>
                        <h1 style={{ fontSize: '2.2rem', marginBottom: '25px' }}>REGISTRO</h1>
                        <p style={{ fontSize: '0.9rem' }}>Crea una nueva cuenta para acceder al sistema de consulta de estadísticas.</p>
                        <img src="/assets/TESJo_ Blanco.png" alt="Logo TESJo" style={{ width: '150px', marginTop: '20px' }} />
                    </div>

                    {/* Panel Derecho con Scroll */}
                    <div style={{ flex: '1', padding: '40px', overflowY: 'auto', background: 'white' }}>
                        <h3 style={{ color: '#213c7a', borderBottom: '2px solid #eee', paddingBottom: '10px', marginBottom: '20px', textAlign: 'center' }}>Registro de Nuevo Usuario</h3>

                        {error && <div style={{ color: 'red', textAlign: 'center', marginBottom: '15px' }}>{error}</div>}
                        {successMessage && <div style={{ color: 'green', textAlign: 'center', marginBottom: '15px' }}>{successMessage}</div>}

                        <form onSubmit={handleSubmit}>
                            {/* Campo Nombre(s) en su propia fila */}
                            <InputField label="Nombre(s):" name="nombre" value={formData.nombre} onChange={handleChange} type="text" required />

                            {/* Campo Apellido Paterno en su propia fila */}
                            <InputField label="Apellido Paterno:" name="apellidoPaterno" value={formData.apellidoPaterno} onChange={handleChange} type="text" required />

                            {/* Campo Apellido Materno en su propia fila */}
                            <InputField label="Apellido Materno:" name="apellidoMaterno" value={formData.apellidoMaterno} onChange={handleChange} type="text" required />

                            {/* Campo Número de Teléfono en su propia fila */}
                            <InputField label="Número de Teléfono:" name="telefono" value={formData.telefono} onChange={handleChange} type="tel" required />

                            {/* Selector de Área en su propia fila */}
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '0.9rem' }}>Área:</label>
                                <select name="area" value={formData.area} onChange={handleChange} required style={inputStyle}>
                                    {AREAS.map(opt => <option key={opt.value} value={opt.value} disabled={opt.disabled}>{opt.label}</option>)}
                                </select>
                            </div>

                            {/* Selector Dinámico de Subárea en su propia fila */}
                            {subareasData[formData.area] && (
                                <div style={{ marginBottom: '15px' }}>
                                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '0.9rem' }}>Subárea:</label>
                                    <select name="subarea" value={formData.subarea} onChange={handleChange} required style={inputStyle}>
                                        <option value="">Selecciona una Subárea</option>
                                        {subareasData[formData.area].map((sub, index) => (
                                            <option key={index} value={sub.value}>{sub.name}</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {/* Campos restantes en filas individuales */}
                            <InputField label="Correo Institucional (@tesjo.edu.mx):" name="correo" value={formData.correo} onChange={handleChange} type="email" required />
                            <InputField label="Nombre de Usuario:" name="username" value={formData.username} onChange={handleChange} type="text" required />
                            <InputField label="Contraseña:" name="password" value={formData.password} onChange={handleChange} type="password" required />
                            <InputField label="Confirmar:" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} type="password" required />

                            <button type="submit" disabled={isLoading} style={{ width: '100%', padding: '12px', backgroundColor: '#1c3170', color: 'white', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}>
                                {isLoading ? 'Procesando...' : 'Crear Cuenta'}
                            </button>
                        </form>

                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default RegisterPage;