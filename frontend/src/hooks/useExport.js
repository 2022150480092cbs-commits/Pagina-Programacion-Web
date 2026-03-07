import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

const useExport = () => {

  const exportToPDF = async (elementId, tituloArchivo, orientacion = 'p') => {
    const element = document.getElementById(elementId);
    if (!element) return;

    try {
      // Configuramos el canvas manteniendo tu escala y calidad original
      const canvas = await html2canvas(element, {
        scale: 3,
        useCORS: true,
        backgroundColor: "#ffffff",
        onclone: (clonedDoc) => {
          // Mantenemos tu lógica de logos y botones original
          const logos = clonedDoc.getElementsByClassName('solo-pdf-captura');
          for (let logo of logos) {
            logo.style.position = 'static';
            logo.style.display = 'block';
            logo.style.visibility = 'visible';
            logo.style.height = 'auto';
          }
          const botonesContenedores = clonedDoc.querySelectorAll('.no_imprimir_botones_ia');
          botonesContenedores.forEach(contenedor => {
            contenedor.style.display = 'none';
          });
        }
      });

      const imgData = canvas.toDataURL('image/png');

      // Definimos el formato A4
      const pdf = new jsPDF(orientacion, 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      // Calculamos dimensiones de la imagen para que encaje en el ancho
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      // PRIMERA PÁGINA
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // PÁGINAS ADICIONALES (Si el contenido es más largo que una hoja A4)
      // Esto evita que tu tabla se corte y agrega las hojas necesarias
      while (heightLeft > 0) {
        position = heightLeft - imgHeight; // Desplazamos la imagen hacia arriba
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`${tituloArchivo}.pdf`);
    } catch (error) {
      console.error("Error PDF:", error);
    }
  };

  const exportToExcel = async (datos, tituloArchivo) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Evaluación');

    try {
      const response = await fetch('/assets/logo_tesjo.jpg');
      const blob = await response.blob();
      const arrayBuffer = await blob.arrayBuffer();
      const logoId = workbook.addImage({
        buffer: arrayBuffer,
        extension: 'jpeg',
      });
      worksheet.addImage(logoId, {
        tl: { col: 0, row: 0 },
        ext: { width: 100, height: 60 }
      });
    } catch (e) { console.warn("No se pudo cargar el logo en Excel"); }

    worksheet.getRow(1).height = 50;

    worksheet.mergeCells('A2:C2');
    worksheet.getCell('A2').value = tituloArchivo.toUpperCase();
    worksheet.getCell('A2').font = { bold: true, size: 14 };
    worksheet.getCell('A2').alignment = { horizontal: 'center' };

    worksheet.columns = [
      { header: 'PROGRAMA ACADÉMICO', key: 'p', width: 55 },
      { header: 'CALIFICACIÓN', key: 'c', width: 15 },
      { header: 'TOTAL DOCENTES', key: 't', width: 15 },
    ];

    const headerRow = worksheet.getRow(4);
    headerRow.values = ['PROGRAMA ACADÉMICO', 'CALIFICACIÓN', 'TOTAL DE DOCENTES'];
    headerRow.eachCell(cell => {
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '00264D' } };
      cell.font = { color: { argb: 'FFFFFF' }, bold: true };
      cell.alignment = { horizontal: 'center' };
    });

    datos.forEach(item => {
      // Ajustado para mapear correctamente tus campos
      const row = worksheet.addRow([item.programa, item.resultados, item.nombre]);
      row.getCell(2).alignment = { horizontal: 'center' };
      row.getCell(3).alignment = { horizontal: 'center' };
    });

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), `${tituloArchivo}.xlsx`);
  };

  return { exportToPDF, exportToExcel };
};

export default useExport;