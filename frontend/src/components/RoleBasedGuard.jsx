import React from 'react';

const RoleBasedGuard = ({ children, allowedRoles }) => {
    // Por ahora, solo devuelve los hijos para que la app se cargue
    // La lógica real de roles se implementará después
    return <>{children}</>;
};

export default RoleBasedGuard;