import React, { createContext, useContext, useState, useEffect } from 'react';
// Añadimos updateProfile a las importaciones de auth
import { auth, db } from '../api/firebaseConfig';
import { createUserWithEmailAndPassword, onAuthStateChanged, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';


const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const register = async (userData) => {
        setLoading(true);
        try {
            // 1. Crear el usuario en Firebase Authentication
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                userData.email,
                userData.password
            );

            const userFirebase = userCredential.user;

            // 🔥 NUEVO: Guardamos el nombre real directamente en el perfil nativo de Firebase Auth
            await updateProfile(userFirebase, {
                displayName: userData.name // Aquí se enlaza tu campo "name"
            });

            // 2. Guardar los datos adicionales en Firestore
            await setDoc(doc(db, "users", userFirebase.uid), {
                uid: userFirebase.uid,
                name: userData.name,
                email: userData.email,
                username: userData.username,
                phone: userData.phone,
                area: userData.area,
                subarea: userData.subarea,
                role: 'docente',
                createdAt: new Date()
            });

            console.log("Registro exitoso en Firebase y Firestore con Perfil Actualizado.");
            return userFirebase;

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
            setLoading(false);
        }
    };

    const login = async (credentials) => {
        // Manejado en LoginForm
    };

    const value = {
        user,
        loading,
        register,
        login,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};