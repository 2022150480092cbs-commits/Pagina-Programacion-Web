import React, { useState } from 'react';
import { Colors, Typography } from './StylesConfig';

const ChatIA = ({ onClose, onQuery }) => {
    const [input, setInput] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!input.trim()) return;
        onQuery(input); // Enviamos la pregunta a la lógica principal
        setInput('');
    };

    // ... dentro de ChatIA.jsx
    return (
        <div
            style={styles.chatContainer}
            onClick={(e) => e.stopPropagation()} // 👈 ESTA ES LA CLAVE
        >
            <div style={styles.header}>
                <span>🤖 Asistente PSICEI</span>
                <button onClick={onClose} style={styles.closeBtn}>×</button>
            </div>
            <div style={styles.body}>
                <p style={styles.welcomeText}>
                    Hola Cristian, ¿qué formato necesitas consultar hoy?
                    <br />
                    <small>Ej: "Dame la evaluación docente de Septiembre 2025"</small>
                </p>
            </div>
            <form onSubmit={handleSubmit} style={styles.footer}>
                <input
                    type="text"
                    placeholder="Escribe tu consulta..."
                    style={styles.input}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />
                <button type="submit" style={styles.sendBtn}>➔</button>
            </form>
        </div>
    );
};

const styles = {
    chatContainer: {
        position: 'absolute', top: '50px', right: '0', width: '300px',
        backgroundColor: 'white', borderRadius: '12px', overflow: 'hidden',
        boxShadow: '0 10px 30px rgba(0,0,0,0.2)', zIndex: 5000,
        fontFamily: Typography.principal
    },
    header: {
        backgroundColor: '#1c3170', color: 'white', padding: '12px',
        display: 'flex', justifyContent: 'space-between', fontWeight: 'bold'
    },
    body: { padding: '15px', minHeight: '80px', color: '#333' },
    welcomeText: { fontSize: '0.9rem', margin: 0, lineHeight: '1.4' },
    footer: { display: 'flex', padding: '10px', borderTop: '1px solid #eee' },
    input: { flex: 1, border: '1px solid #ddd', borderRadius: '20px', padding: '8px 15px', outline: 'none' },
    sendBtn: { marginLeft: '8px', backgroundColor: '#1c3170', border: 'none', color: 'white', borderRadius: '50%', width: '35px', cursor: 'pointer' },
    closeBtn: { background: 'none', border: 'none', color: 'white', fontSize: '20px', cursor: 'pointer' }
};

export default ChatIA;