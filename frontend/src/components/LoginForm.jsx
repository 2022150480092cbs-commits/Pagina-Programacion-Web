import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
// Integración: Importación del servicio de Microsoft
import { loginWithMicrosoft } from '../api/firebaseService';

const LoginForm = () => {
    const { login, isAuthenticated } = useAuth();
    const navigate = useNavigate(); // ← YA EXISTÍA, SE USA
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard', { replace: true });
        }
    }, [isAuthenticated, navigate]);

    // Integración: Lógica para el botón de Microsoft
    const handleMicrosoftLogin = async () => {
        setError('');
        setLoading(true);
        try {
            await loginWithMicrosoft();
            navigate('/dashboard');
        } catch (err) {
            setError('Error al acceder con la cuenta institucional de Microsoft.');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login({ email, password });

            // 🔹 FRAGMENTO AGREGADO (REDIRECCIÓN EXPLÍCITA)
            navigate('/dashboard');

        } catch (err) {
            setError(err.message || 'Error al iniciar sesión.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="top-bar">
                <img src="/assets/header-bg.png" alt="Encabezado TESJO" className="encabezado-img" />
            </div>

            <div className="main-content-area">
                <div className="login-box-container">
                    <div className="welcome-panel">
                        <h1 className="welcome-title">BIENVENIDO</h1>
                        <p className="description-text">
                            Programa para la Sistematización y Consolidación de la Estadística
                            Institucional (PSICEI)
                        </p>
                        <p className="sicei-text">
                            Sistema de Consulta de Estadísticas Institucionales
                        </p>
                        <img src="/assets/TESJo_ Blanco.png" alt="Logo TESJO" className="logo-img" />
                    </div>

                    <div className="login-form-panel">
                        <p className="form-title">Usuario:</p>

                        <form onSubmit={handleSubmit}>
                            <div className="input-group">
                                <label htmlFor="email">Usuario</label>
                                <input
                                    type="text"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="input-field"
                                />
                            </div>

                            <div className="input-group">
                                <label htmlFor="password">Contraseña:</label>
                                <input
                                    type="password"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="input-field"
                                />
                            </div>

                            <button type="submit" id="btnlogin" disabled={loading}>
                                {loading ? 'Verificando...' : 'Iniciar Sesión'}
                            </button>

                            {/* Integración: Botón visual de Microsoft */}
                            <button 
                                type="button" 
                                className="btn-microsoft" 
                                onClick={handleMicrosoftLogin}
                                disabled={loading}
                            >
                                <img 
                                    src="https://authjs.dev/img/providers/microsoft.svg" 
                                    alt="MS Logo" 
                                    style={{ width: '18px', marginRight: '10px' }} 
                                />
                                Entrar con @tesjo.edu.mx
                            </button>

                            {error && <p className="error-msg">{error}</p>}

                            <p className="register-link">
                                ¿Aún no tienes cuenta?
                                <a href="/register"> Regístrate</a>
                            </p>
                        </form>
                    </div>
                </div>
            </div>

            <div className="footer">
                <p className="copyright-text">
                    © Copyright 2025 TecNM - Todos los Derechos Reservados
                </p>
                <img src="/assets/pagg.png" alt="Logo Pie de Página" className="footer-img" />
            </div>

            <style jsx="true">{`
                /* El CSS Original */
                html, body, #root, .login-page {
                    margin: 0 !important;
                    padding: 0 !important;
                    width: 100vw !important;
                    height: 100vh !important;
                    box-sizing: border-box !important;
                    overflow-x: hidden !important;
                    overflow-y: auto;
                    background-color: #f4f4f4;
                }

                img, p, h1, h2, h3, h4, h5, h6 {
                    margin: 0;
                    padding: 0;
                }

                #root > * {
                    margin: 0 !important;
                    padding: 0 !important;
                }

                .login-page {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    min-height: 100vh;
                    width: 100vw;
                    display: flex;
                    flex-direction: column;
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }

                .top-bar, .footer {
                    width: 100%;
                    background-color: #1c3170;
                    margin: 0;
                    padding: 0;
                }
                
                .encabezado-img {
                    width: 100%;
                    height: auto;
                    max-height: 120px;
                    object-fit: cover;
                    display: block;
                }

                .footer-img {
                    width: 100%;
                    height: auto;
                    max-height: 280px;
                    object-fit: cover;
                    display: block;
                }

                .copyright-text {
                    color: white;
                    text-align: center;
                    padding: 5px 0;
                    font-size: 0.85rem;
                    background-color: #1c3170;
                    margin: 0;
                }

                .main-content-area {
                    flex-grow: 1;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    padding: 5px;
                    margin: 0;
                }
                
                .login-box-container {
                    display: flex;
                    max-width: 620px;
                    width: 90%;
                    border-radius: 4px;
                    overflow: hidden;
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
                    height: 500px;
                }

                .welcome-panel {
                    flex: 1;
                    background-color: #213c7a;
                    color: white;
                    text-align: center;
                    padding: 30px 20px;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                }

                .welcome-title {
                    font-size: 2.2rem;
                    margin-bottom: 25px;
                    font-weight: 500;
                    letter-spacing: 1px;
                }

                .description-text {
                    font-size: 0.85rem;
                    line-height: 1.4;
                    margin-bottom: 5px;
                }

                .sicei-text {
                    font-size: 0.75rem;
                    margin-bottom: 20px;
                }

                .logo-img {
                    width: 100px;
                    height: auto;
                    margin-top: 15px;
                    align-self: center;
                }

                .login-form-panel {
                    flex: 1;
                    background-color: white;
                    padding: 30px;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                }

                .form-title {
                    font-size: 0.9rem;
                    color: #555;
                    margin-bottom: 5px;
                }

                .input-group {
                    margin-bottom: 15px;
                }

                label {
                    display: none;
                }

                .input-field {
                    width: 100%;
                    padding: 8px 10px;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                    box-sizing: border-box;
                    font-size: 1rem;
                }

                #btnlogin {
                    width: 100%;
                    padding: 10px;
                    background-color: #1c3170;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    transition: background-color 0.3s;
                    font-size: 1rem;
                    margin-bottom: 10px;
                }

                #btnlogin:hover {
                    background-color: #152654;
                }

                /* Integración: Estilo del botón Microsoft */
                .btn-microsoft {
                    width: 100%;
                    padding: 10px;
                    background-color: #ffffff;
                    color: #5e5e5e;
                    border: 1px solid #8c8c8c;
                    border-radius: 4px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 0.9rem;
                    font-weight: 500;
                    transition: background-color 0.2s;
                }

                .btn-microsoft:hover {
                    background-color: #f3f3f3;
                }

                .register-link {
                    text-align: center;
                    margin-top: 15px;
                    font-size: 0.8rem;
                }

                .register-link a {
                    color: #1c3170;
                    text-decoration: none;
                    font-weight: bold;
                    margin-left: 5px;
                }
                
                .error-msg {
                    color: #c0392b;
                    background-color: #fadbd8;
                    padding: 10px;
                    border-radius: 4px;
                    margin-top: 15px;
                    text-align: center;
                    font-size: 0.9rem;
                }

                @media (max-width: 768px) {
                    .login-box-container {
                        flex-direction: column;
                        height: auto;
                    }
                    .welcome-panel {
                        display: none; 
                    }
                    .login-form-panel {
                        padding: 20px;
                    }
                }
            `}</style>
        </div>
    );
};

export default LoginForm;