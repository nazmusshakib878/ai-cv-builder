export const generatePDF = async (fileName: string) => {
  try {
    // Dynamic import for html2pdf
    // Ignoring TS error as it's a JS library without types out of the box in this quick setup
    // @ts-ignore
    const html2pdf = (await import('html2pdf.js')).default;
    
    const element = document.getElementById('resume-a4-document');
    if (!element) {
      console.error('CV preview element not found');
      return;
    }

    const opt = {
      margin:       0,
      filename:     `${fileName.replace(/\s+/g, '_')}_CV.pdf`,
      image:        { type: 'jpeg' as const, quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' as const }
    };
    
    html2pdf().set(opt).from(element).save();
  } catch (error) {
    console.error('Failed to generate PDF:', error);
    alert('Failed to generate PDF. Check console for details.');
  }
};
