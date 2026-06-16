// Importaciones necesarias
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, OAuthProvider } from "firebase/auth";

// Configuración de tu proyecto Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDLvXLcr4M0_saPWyr59DpwUt0gTo42RYY",
  authDomain: "psicei-tesjo-b3b67.firebaseapp.com",
  projectId: "psicei-tesjo-b3b67",
  storageBucket: "psicei-tesjo-b3b67.firebasestorage.app",
  messagingSenderId: "287421376630",
  appId: "1:287421376630:web:6fe48f98db28d16d769757",
  measurementId: "G-99TEY1RTYZ"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Exportar servicios que usas
export const db = getFirestore(app);
export const auth = getAuth(app);


// Configuración para el login institucional de Microsoft
export const microsoftProvider = new OAuthProvider('microsoft.com');
microsoftProvider.setCustomParameters({
  prompt: 'select_account',
  tenant: 'common'
});