import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
    const styles = {
        container: {
            backgroundColor: '#00264D',
            color: 'white',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            fontFamily: 'Segoe UI, sans-serif',
            textAlign: 'center',
            padding: '20px',
        },
        title: {
            fontSize: '2.5em',
            marginBottom: '20px',
            letterSpacing: '1px',
        },
        subtitle: {
            fontSize: '1.3em',
            marginBottom: '40px',
        },
        button: {
            backgroundColor: 'white',
            color: '#00264D',
            padding: '12px 28px',
            borderRadius: '30px',
            textDecoration: 'none',
            fontWeight: 'bold',
            fontSize: '1.1em',
            transition: 'all 0.3s ease',
        },
        buttonHover: {
            backgroundColor: '#004080',
            color: 'white',
        },
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>¡BIENVENIDO a SIGEST!</h1>
            <p style={styles.subtitle}>Página pública de inicio.</p>

            <Link
                to="/login"
                style={styles.button}
                onMouseEnter={(e) => {
                    e.target.style.backgroundColor = styles.buttonHover.backgroundColor;
                    e.target.style.color = styles.buttonHover.color;
                }}
                onMouseLeave={(e) => {
                    e.target.style.backgroundColor = styles.button.backgroundColor;
                    e.target.style.color = styles.button.color;
                }}
            >
                Iniciar Sesión
            </Link>
        </div>
    );
};

export default HomePage;
