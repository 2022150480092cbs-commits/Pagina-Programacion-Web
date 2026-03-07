export const useTableNavigation = () => {
  const handleKeyDown = (e) => {
    const cell = e.target;
    if (cell.tagName !== 'TD') return;

    const row = cell.parentElement;
    const cellIndex = Array.from(row.children).indexOf(cell);
    const tbody = row.parentElement;
    const rowIndex = Array.from(tbody.children).indexOf(row);

    let nextCell;

    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault(); // Evita el salto de línea o espacio
        nextCell = tbody.children[rowIndex - 1]?.children[cellIndex];
        break;
      case 'ArrowDown':
        e.preventDefault();
        nextCell = tbody.children[rowIndex + 1]?.children[cellIndex];
        break;
      case 'ArrowLeft':
        // Solo navega si el cursor está al inicio del texto
        if (window.getSelection().anchorOffset === 0) {
          e.preventDefault();
          nextCell = row.children[cellIndex - 1];
        }
        break;
      case 'ArrowRight':
        // Solo navega si el cursor está al final del texto
        if (window.getSelection().anchorOffset === cell.innerText.length) {
          e.preventDefault();
          nextCell = row.children[cellIndex + 1];
        }
        break;
      default:
        return;
    }

    if (nextCell && nextCell.getAttribute('contentEditable') === 'true') {
      nextCell.focus();
    }
  };

  return { handleKeyDown };
};