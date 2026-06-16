// ************************* Custom Hook Optimizado ************************ //

import { useState } from 'react';

export const useTableLogic = (datos, setDatos, numColumnas) => {

    // 1. Lógica para eliminar fila
    const eliminarFila = (id) => {
        if (datos.length > 1) {
            setDatos(datos.filter(f => f.id !== id));
        }
    };

    // 2. Actualización segura de celdas
    const handleBlurCell = (index, campo, valor) => {
        const nuevosDatos = [...datos];
        if (nuevosDatos[index][campo] !== valor) {
            nuevosDatos[index][campo] = valor;
            setDatos(nuevosDatos);
        }
    };

    // 3. Lógica de navegación tipo Excel CORREGIDA
    const handleKeyDown = (e, rowIndex, colIndex) => {
        const table = e.target.closest('table');
        if (!table) return;

        // DINÁMICO: Contamos cuántas filas hay en el <thead> para saber el offset real
        const offsetRows = table.tHead.rows.length;

        let nextCell;

        switch (e.key) {
            case 'ArrowUp':
                e.preventDefault();
                // Navegación vertical considerando el offset dinámico
                if (rowIndex > 0) {
                    nextCell = table.rows[rowIndex + (offsetRows - 1)].cells[colIndex];
                }
                break;
            case 'ArrowDown':
            case 'Enter':
                e.preventDefault();
                if (rowIndex < datos.length - 1) {
                    nextCell = table.rows[rowIndex + (offsetRows + 1)].cells[colIndex];
                }
                break;
            case 'ArrowLeft':
                if (colIndex > 0) {
                    e.preventDefault();
                    nextCell = table.rows[rowIndex + offsetRows].cells[colIndex - 1];
                }
                break;
            case 'ArrowRight':
                if (colIndex < numColumnas - 1) {
                    e.preventDefault();
                    nextCell = table.rows[rowIndex + offsetRows].cells[colIndex + 1];
                }
                break;
            default: return;
        }

        if (nextCell) {
            nextCell.focus();
            const range = document.createRange();
            const sel = window.getSelection();
            range.selectNodeContents(nextCell);
            range.collapse(false);
            sel.removeAllRanges();
            sel.addRange(range);
        }
    };

    return { eliminarFila, handleKeyDown, handleBlurCell };
};