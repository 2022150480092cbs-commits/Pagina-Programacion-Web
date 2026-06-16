// frontend/src/components/AuthLayout.jsx   
// aplica herencia para el encabezado, imgen de enmedio, pie-pag.

import React from 'react';
import { Outlet } from 'react-router-dom';

// Importa las imágenes o define las rutas de las imágenes aquí
// ASUME que las imágenes están en frontend/public o se importan.
const HEADER_IMG_SRC = "/header-bg.png"; // Reemplaza con tu ruta
const FOOTER_IMG_SRC = "/footer-bg.png"; // Reemplaza con tu ruta
const LOGO_IMG_SRC = "/tesjo-logo.png";   // Reemplaza con tu ruta

const AuthLayout = () => {
  return (
    <div className="app-container">
      {/* --- ENCABEZADO --- */}
      <header className="top-bar">
        <img src={HEADER_IMG_SRC} alt="Encabezado TESJO" className="encabezado-img" />
      </header>

      {/* --- CONTENIDO CENTRAL (Donde se renderiza LoginForm o RegisterForm) --- */}
      <main className="main-content-area auth-panel-wrapper">
        <div className="auth-box-container">
            {/* Panel de Bienvenida (el panel azul) */}
            <div className="welcome-panel">
                <h1 className="welcome-title">BIENVENIDO</h1>
                <p className="description-text">
                    Programa para la Sistematización y Consolidación de la Estadística Institucional (**PSICE**)
                </p>
                <p className="sicei-text">
                    Sistema de Consulta de Estadísticas Institucionales
                </p>
                <img src={LOGO_IMG_SRC} alt="Logo TESJO" className="logo-img" />
            </div>

            {/* Renderiza el Formulario (Login o Registro) */}
            <div className="login-form-panel">
                <Outlet /> 
            </div>
        </div>
      </main>

      {/* --- PIE DE PÁGINA --- */}
      <footer className="footer">
        <div className="copyright-text">
            © Copyright 2025 TecNM - Todos los Derechos Reservados
        </div>
        <img src={FOOTER_IMG_SRC} alt="Pie de Página TESJO" className="footer-img" />
      </footer>
    </div>
  );
};

export default AuthLayout;