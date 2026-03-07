import React, { createContext, useContext, useState } from 'react';
// Importaciones necesarias de Firebase SDK
import { auth, db } from '../api/firebaseConfig'; // Verifica que esta ruta sea correcta en tu PC
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Función de REGISTRO REAL con FIREBASE
    const register = async (userData) => {
        setIsLoading(true);
        try {
            // 1. Crear el usuario en Firebase Authentication (Email y Password)
            const userCredential = await createUserWithEmailAndPassword(
                auth, 
                userData.email, 
                userData.password
            );

            const user = userCredential.user;

            // 2. Guardar los datos adicionales en Firestore (Nombre, Área, Subárea, Teléfono)
            // Se usa setDoc para crear un documento con el mismo ID del usuario (uid)
            await setDoc(doc(db, "users", user.uid), {
                uid: user.uid,
                name: userData.name,
                email: userData.email,
                username: userData.username,
                phone: userData.phone,
                area: userData.area,
                subarea: userData.subarea, // Aquí se guarda la subárea que agregamos
                role: 'docente',
                createdAt: new Date()
            });

            console.log("Registro exitoso en Firebase y Firestore.");
            return user;

        } catch (error) {
            let errorMessage = "Fallo en el registro con Firebase.";
            if (error.code === 'auth/email-already-in-use') {
                errorMessage = "Este correo ya está registrado en el sistema.";
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = "El formato del correo institucional es inválido.";
            } else if (error.code === 'auth/weak-password') {
                errorMessage = "La contraseña es muy débil para Firebase.";
            }
            throw new Error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (credentials) => {
        // Aquí iría tu lógica de signInWithEmailAndPassword más adelante
    };

    const value = {
        isAuthenticated,
        isLoading,
        register,
        login,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};