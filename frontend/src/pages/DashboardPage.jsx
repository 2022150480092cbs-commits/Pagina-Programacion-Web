import React from 'react';
// Librería de enrutamiento
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Componentes de Layout
import Layout from './components/Layout';
import AuthLayout from './components/AuthLayout';
import GlobalStyles from './components/GlobalStyles'; // Asumo que GlobalStyles está en /components

// Componentes de Seguridad
import ProtectedRoute from './components/ProtectedRoute';

// Páginas y Formularios (¡RUTAS CORREGIDAS Y SIN DUPLICADOS!)
import Dashboard from './pages/Dashboard';          // Componente de Dashboard
import LoginForm from './components/LoginForm';     // Componente de Login
import RegisterForm from './components/RegisterForm'; // Componente de Registro
// import { AuthProvider } from './context/AuthContext'; // Descomenta en main.jsx

function App() {
    return (
        // Recuerda: <AuthProvider> debe envolver <App /> en main.jsx/index.js
        <Router>
            {/* Aplica todos los estilos CSS globales a la aplicación */}
            <GlobalStyles />

            <Routes>
                {/* 1. Rutas Públicas (Login y Registro) */}
                <Route path="/" element={<AuthLayout />}>
                    {/* index: Muestra el LoginForm en la ruta raíz */}
                    <Route index element={<LoginForm />} />
                    {/* /register: Muestra el RegisterForm */}
                    <Route path="register" element={<RegisterForm />} />
                </Route>

                {/* 2. Rutas Protegidas */}
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            {/* El componente Dashboard */}
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />

                {/* 3. Ruta de Fallback (404) */}
                <Route path="*" element={
                    <Layout>
                        <div style={{ textAlign: 'center', padding: '100px', color: '#555' }}>
                            <h2>404: Página no encontrada</h2>
                            <p>La ruta que buscas no e25614615xiste en SIGEST.</p>
                        </div>
                    </Layout>
                } />
            </Routes>
        </Router>
    );
}

export default App;