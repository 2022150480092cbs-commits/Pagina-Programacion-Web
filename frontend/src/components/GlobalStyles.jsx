// frontend/src/GlobalStyles.jsx
import React from 'react';

const GlobalStyles = () => (
    <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

        body {
            margin: 0;
            padding: 0;
            font-family: 'Inter', sans-serif;
            background: linear-gradient(to right, #BCBBBA, #777779);
        }
        * {
            box-sizing: border-box;
        }

        .welcome-container {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            height: 100vh;
            width: 100%;
            background-color: #1D2C57;
            color: white;
            text-align: center;
        }
        
        .welcome-title { font-size: 3rem; margin-bottom: 30px; }
        
        .auth-container { 
            background: linear-gradient(to right, #BCBBBA, #777779);
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            min-height: 100vh;
            width: 100%;
        }

        .app-container {
            position: relative;
            min-height: 200vh;
            display: flex;
            flex-direction: column;
        }

        .login-card {
            display: flex;
            flex-direction: column;
            width: 400px;
            max-width: 90%;
            background: white;
            border-radius: 10px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            margin: 20px auto;
            overflow: hidden;
        }

        .encabezado-img {
            width: 100%;
            height: auto;
            display: block;
        }

        /* --- ESTILO DE TABLAS REUTILIZABLE --- */
        .celda-espaciada {
            line-height: 1.5 !important;
            padding: 12px 8px !important;
            vertical-align: middle !important;
        }

        /* --- AJUSTES DE IMPRESIÓN DINÁMICA --- */
        @media print {
            @page {
                size: landscape; /* Fuerza orientación horizontal */
                margin: 1cm;
            }

            body {
                background: none !important;
                -webkit-print-color-adjust: exact;
            }

            /* Evita que las filas se corten entre páginas */
            tr {
                page-break-inside: avoid !important;
                break-inside: avoid !important;
            }

            /* Repite el encabezado de la tabla en cada hoja */
            thead {
                display: table-header-group !important;
            }

            #area-oficial-impresion {
                width: 100% !important;
                height: auto !important;
                box-shadow: none !important;
                margin: 0 !important;
                padding: 0 !important;
                display: block !important;
            }

            .no_imprimir_botones_ia {
                display: none !important;
            }
        }



        /* --- AJUSTES DE IMPRESIÓN DINÁMICA EN GlobalStyles.jsx --- */
@media print {
    @page {
        size: landscape;
        /* Definimos un margen inferior para que el footer no se encime con el contenido */
        margin: 1cm 1cm 3cm 1cm; 
    }

    /* Contenedor principal de la página de impresión */
    #area-oficial-impresion {
        position: relative;
        min-height: 100%; /* Ocupa todo el alto de la hoja */
        width: 100% !important;
        display: block !important;
    }

    /* Forzamos el footer al límite inferior de CADA hoja */
    .footer-pdf-fijo {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 2.5cm; /* Ajusta según el tamaño de tu imagen de footer */
        display: block !important;
    }

    /* Evitamos que el contenido de la tabla se corte de forma extraña */
    .margin-content-print {
        padding-bottom: 3cm; /* Espacio de seguridad para no chocar con el footer fijo */
    }
}
    `}</style>
);

export default GlobalStyles;