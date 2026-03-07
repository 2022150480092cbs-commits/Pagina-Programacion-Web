import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate
} from 'react-router-dom';

// --- IMPORTACIONES DE CONTEXTO Y ESTILOS ---
import { AuthProvider } from './context/AuthContext';
import { Colors, Typography } from './components/generalStyle/StylesConfig';
import './components/generalStyle/LayoutStyles.css';

// --- IMPORTACIONES DE COMPONENTES GENERALES ---
import LoginForm from './components/LoginForm';
import RegisterPage from './pages/RegisterPage';
import MainLayout from './menu/MainLayout';

// --- IMPORTACIONES DE DIRECCIÓN ACADÉMICA ---
import AcademicaHome from './desarrollo/DireccionAcademica/AcademicaHome';
import DesarrolloAcademicoLayout from './desarrollo/DireccionAcademica/subareas/DesarrolloAcademico/DesarrolloAcademicoLayout';
import PeriodoSelector from './desarrollo/DireccionAcademica/subareas/DesarrolloAcademico/PeriodoSelector';
import EvaluacionDocente from './desarrollo/DireccionAcademica/subareas/DesarrolloAcademico/formatos/EvaluacionDocente';
import EstimuloDesempeño from './desarrollo/DireccionAcademica/subareas/DesarrolloAcademico/formatos/EstimuloDesempeño';
import AlumnosEventos from './desarrollo/DireccionAcademica/subareas/DesarrolloAcademico/formatos/AlumnosEventos';
import CapacitacionDocente from './desarrollo/DireccionAcademica/subareas/DesarrolloAcademico/formatos/CapacitacionDocente';
import PersonalDocente from './desarrollo/DireccionAcademica/subareas/DesarrolloAcademico/formatos/PersonalDocente';
import Tutorias from './desarrollo/DireccionAcademica/subareas/DesarrolloAcademico/formatos/Tutorias';

// --- IMPORTACIONES DE DEPARTAMENTO DE CENTRO DE CÓMPUTO ---
import CentroComputoLayout from './desarrollo/DireccionAcademica/subareas/CentroComputo/CentroComputoLayout';
import AparatosTelefonicos from './desarrollo/DireccionAcademica/subareas/CentroComputo/formatos/AparatosTelefonicos';
import EducacionEspecial from './desarrollo/DireccionAcademica/subareas/CentroComputo/formatos/EducacionEspecial';
import RecursosInformaticos from './desarrollo/DireccionAcademica/subareas/CentroComputo/formatos/RecursosInformaticos';
import TelecomunicacionesHardware from './desarrollo/DireccionAcademica/subareas/CentroComputo/formatos/TelecomunicacionesHardware';
import TelecomunicacionesSoftware from './desarrollo/DireccionAcademica/subareas/CentroComputo/formatos/TelecomunicacionesSoftware';

/**
 * COMPONENTE: DashboardHome
 */
const DashboardHome = () => {
  const navigate = useNavigate();
  const opciones = [
    { nombre: "Dirección y Vinculación", ruta: "vinculacion" },
    { nombre: "Unidad Jurídica y de Igualdad de Género", ruta: "juridica" },
    { nombre: "Unidad de Planeación", ruta: "planeacion" },
    { nombre: "Dirección Académica", ruta: "direccion-academica" },
    { nombre: "Dirección de Vinculación y Extensión", ruta: "extension" },
    { nombre: "Subdirección de Servicios Administrativos", ruta: "administrativos" },
    { nombre: "Extensión Aculco", ruta: "aculco" },
    { nombre: "RIP", ruta: "rip" }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', gap: '12px', padding: '40px 0', fontFamily: Typography.principal }}>
      {opciones.map((opcion, index) => (
        <button
          key={index}
          onClick={() => navigate(`/dashboard/${opcion.ruta}`)}
          style={{ width: '90%', maxWidth: '550px', padding: '18px', backgroundColor: '#0066cc', color: Colors.textoBlanco, border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: 'bold', fontFamily: Typography.principal, cursor: 'pointer', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', transition: 'all 0.3s ease' }}
          onMouseOver={(e) => (e.target.style.backgroundColor = '#0052a3')}
          onMouseOut={(e) => (e.target.style.backgroundColor = '#0066cc')}
        >
          {opcion.nombre}
        </button>
      ))}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <style dangerouslySetInnerHTML={{
          __html: `
              html, body, #root { margin: 0; padding: 0; width: 100vw; height: 100vh; overflow-x: hidden; font-family: ${Typography.principal}; background-color: ${Colors.fondoGris}; }
              *, button, input { font-family: ${Typography.principal} !important; box-sizing: border-box; }
        `}} />

        <Routes>
          <Route path="/" element={<LoginForm />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route path="/dashboard" element={<MainLayout />}>
            <Route index element={<DashboardHome />} />

            <Route path="direccion-academica">
              <Route index element={<AcademicaHome />} />

              {/* --- SUBÁREA: DESARROLLO ACADÉMICO --- */}
              <Route path="desarrollo-academico" element={<DesarrolloAcademicoLayout />}>
                <Route path="evaluacion-docente" element={<PeriodoSelector tituloFormato="Evaluación Docente" rutaBase="/dashboard/direccion-academica/desarrollo-academico/evaluacion-docente" />} />
                <Route path="evaluacion-docente/:periodoId" element={<EvaluacionDocente />} />

                <Route path="alumnos-eventos-academicos" element={<PeriodoSelector tituloFormato="Alumnos en Eventos Académicos" rutaBase="/dashboard/direccion-academica/desarrollo-academico/alumnos-eventos-academicos" />} />
                <Route path="alumnos-eventos-academicos/:periodoId" element={<AlumnosEventos />} />

                <Route path="capacitacion-personal-docente" element={<PeriodoSelector tituloFormato="Capacitación Personal Docente" rutaBase="/dashboard/direccion-academica/desarrollo-academico/capacitacion-personal-docente" />} />
                <Route path="capacitacion-personal-docente/:periodoId" element={<CapacitacionDocente />} />

                <Route path="personal-docente-estudia" element={<PeriodoSelector tituloFormato="Personal Docente que Estudia" rutaBase="/dashboard/direccion-academica/desarrollo-academico/personal-docente-estudia" />} />
                <Route path="personal-docente-estudia/:periodoId" element={<PersonalDocente />} />

                <Route path="estimulo-desempeno-docente" element={<PeriodoSelector tituloFormato="Estímulo al Desempeño Docente" rutaBase="/dashboard/direccion-academica/desarrollo-academico/estimulo-desempeno-docente" />} />
                <Route path="estimulo-desempeno-docente/:periodoId" element={<EstimuloDesempeño />} />

                <Route path="tutorias" element={<PeriodoSelector tituloFormato="Tutorias" rutaBase="/dashboard/direccion-academica/desarrollo-academico/tutorias" />} />
                <Route path="tutorias/:periodoId" element={<Tutorias />} />
              </Route>

              {/* --- SUBÁREA: CENTRO DE CÓMPUTO (NUEVA CONFIGURACIÓN) --- */}
              <Route path="computo" element={<CentroComputoLayout />}>
                <Route path="aparatos-telefonicos" element={<PeriodoSelector tituloFormato="Líneas y aparatos Teléfonicos." rutaBase="/dashboard/direccion-academica/computo/aparatos-telefonicos" />} />
                <Route path="aparatos-telefonicos/:periodoId" element={<AparatosTelefonicos />} />

                <Route path="educacion-especial" element={<PeriodoSelector tituloFormato="Infraestructura Educación Especial" rutaBase="/dashboard/direccion-academica/computo/educacion-especial" />} />
                <Route path="educacion-especial/:periodoId" element={<EducacionEspecial />} />

                <Route path="recursos-informaticos" element={<PeriodoSelector tituloFormato="Recursos Informáticos" rutaBase="/dashboard/direccion-academica/computo/recursos-informaticos" />} />
                <Route path="recursos-informaticos/:periodoId" element={<RecursosInformaticos />} />

                <Route path="telecomunicaciones-hardware" element={<PeriodoSelector tituloFormato="Telecomunicaciones Hardware" rutaBase="/dashboard/direccion-academica/computo/telecomunicaciones-hardware" />} />
                <Route path="telecomunicaciones-hardware/:periodoId" element={<TelecomunicacionesHardware />} />

                <Route path="telecomunicaciones-software" element={<PeriodoSelector tituloFormato="Telecomunicaciones Software" rutaBase="/dashboard/direccion-academica/computo/telecomunicaciones-software" />} />
                <Route path="telecomunicaciones-software/:periodoId" element={<TelecomunicacionesSoftware />} />
              </Route>

            </Route>

            <Route path="*" element={<div>Interfaz en Desarrollo</div>} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;