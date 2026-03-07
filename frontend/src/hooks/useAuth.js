// /SIGEST/frontend/src/hooks/useAuth.js

import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

// Este hook nos permite acceder a cualquier parte del AuthContext
export const useAuth = () => {
    return useContext(AuthContext);
};