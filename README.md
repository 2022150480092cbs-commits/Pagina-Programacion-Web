PSICEI - PROGRAMA PARA LA SISTEMATIZACIÓN Y CONSOLIDACIÓN DE LA ESTADÍSTICA INSTITUCIONAL (TESJo)

Este archivo contiene la información general del proyecto, las tecnologías
empleadas, instrucciones para su instalación y los integrantes del equipo.

------------------------------------------------------------------------
1. DESCRIPCIÓN DEL SISTEMA
------------------------------------------------------------------------
PSICEI (Programa para la Sistematización y Consolidación de la Estadística
Institucional) es un sistema web diseñado para el Tecnológico de Estudios
Superiores de Jocotitlán (TESJo). 

Su propósito fundamental es centralizar, sistematizar y facilitar la
consulta de estadísticas y planeaciones institucionales. El sistema permite:
- Autenticación segura mediante credenciales tradicionales o cuenta 
  institucional de Microsoft (@tesjo.edu.mx).
- Un panel interactivo (Dashboard) para visualizar indicadores clave.
- Procesamiento y extracción inteligente de datos mediante inteligencia
  artificial (Asistente/Procesador IA PSICEI impulsado por Gemini API).
- Exportación de reportes estadísticos y planeaciones en formatos como 
  Excel (ExcelJS) y PDF (jsPDF / html2canvas).

------------------------------------------------------------------------
2. TECNOLOGÍAS UTILIZADAS
------------------------------------------------------------------------
El sistema está construido bajo una arquitectura desacoplada (Frontend/Backend):

FRONTEND (Cliente):
- React 19 (React-scripts)
- React Router DOM (para navegación)
- Firebase Client SDK (Autenticación y base de datos en tiempo real)
- @google/generative-ai (Integración de Gemini API para el asistente)
- ExcelJS & File-Saver (Generación y descarga de archivos de Excel)
- jsPDF & html2canvas (Generación y exportación de reportes PDF)

BACKEND (Servidor API):
- Node.js
- Express.js (para la creación de la API REST)
- Firebase Admin SDK (gestión segura de recursos y bases de datos)
- CORS (Configuración de acceso seguro)

BASE DE DATOS Y SERVICIOS CLOUD:
- Firebase (Firestore Database & Firebase Authentication)

------------------------------------------------------------------------
3. INSTRUCCIONES DE INSTALACIÓN Y CONFIGURACIÓN
------------------------------------------------------------------------
Siga los siguientes pasos para instalar y ejecutar el proyecto localmente:

Requisitos previos:
- Tener instalado Node.js (versión 16 o superior recomendada).
- Contar con un proyecto configurado en Firebase Console.

Paso 1: Clonar el proyecto
   git clone <URL_DEL_REPOSITORIO>
   cd Planeacion

Paso 2: Configuración del Backend
   1. Navegue a la carpeta del servidor:
      cd backend
   2. Instale las dependencias necesarias:
      npm install
   3. Cree un archivo '.env' en la raíz de la carpeta 'backend/' y configure
      las variables de entorno requeridas (ej. BACKEND_PORT, credenciales de Firebase).
   4. Inicie el servidor de desarrollo:
      npm start

Paso 3: Configuración del Frontend
   1. En una nueva terminal, navegue a la carpeta del cliente:
      cd frontend
   2. Instale las dependencias necesarias:
      npm install
   3. Cree un archivo '.env' en la raíz de la carpeta 'frontend/' y configure
      las claves públicas de Firebase y Gemini API.
   4. Inicie el servidor de desarrollo de React:
      npm start

El frontend se abrirá automáticamente en su navegador en http://localhost:3000

------------------------------------------------------------------------
4. INTEGRANTES DEL EQUIPO
------------------------------------------------------------------------
El desarrollo de este sistema está a cargo de:

* Cristian Bautista Secundino
* Alejandra Reyes Serapio
* Juan Carlo Morales
* Guastavo Felix Mauricio

                         TESJo - 2025/2026

# Pagina-Programacion-Web
Repositorio web para el proyecto integrador
