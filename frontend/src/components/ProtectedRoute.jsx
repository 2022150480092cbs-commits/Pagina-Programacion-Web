// frontend/src/components/ProtectedRoute.jsx
import WelcomePage from "./pages/WelcomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import React from 'react';
import { Navigate } from 'react-router-dom';

// Importar el contexto de autenticación aquí si lo usas, por ahora usamos localStorage
// import { useAuth } from '../context/AuthContext'; 

/**
 * Componente de Ruta Protegida.
 * Revisa si existe un token en el almacenamiento local. Si no existe,
 * redirige al usuario a la página de inicio de sesión.
 * * @param {Object} props.children - El componente que se desea proteger (ej: Dashboard)
 */
const ProtectedRoute = ({ children }) => {
    // En una aplicación real, usarías el estado del AuthContext.
    // Por ahora, simulamos la autenticación verificando la existencia del token.
    const isAuthenticated = localStorage.getItem('token');

    if (!isAuthenticated) {
        // Redirige al login. El 'replace' asegura que el usuario no pueda 
        // volver a la ruta protegida con el botón de "atrás".
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
