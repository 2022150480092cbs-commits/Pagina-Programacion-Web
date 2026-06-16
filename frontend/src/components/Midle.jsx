import React from 'react';

/**
 * Componente Midle (Contenido Central)
 *
 * Envuelve el contenido principal de una página (e.g., el formulario de registro, 
 * el dashboard) dándole estilos de contenedor o centrado que son consistentes.
 *
 * @param {object} props.children - El contenido específico de la página.
 */
function Midle({ children }) {
    return (
        <div
            className="midle-content-wrapper"
            style={{
                // Estilos para centrar el contenido principal y darle un margen superior e inferior.
                maxWidth: '1200px', // Ancho máximo del contenido
                margin: '50px auto', // Margen superior/inferior de 50px y centrado horizontal
                padding: '20px', // Relleno interno
                backgroundColor: '#fff', // Fondo blanco para la sección de contenido
                borderRadius: '10px', // Bordes redondeados
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', // Sombra suave
            }}
        >
            {children}
        </div>
    );
}

export default Midle;
