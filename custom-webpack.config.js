module.exports = {
  // Tell webpack do not bundle optional jsPDF dependencies
  externals: {
    canvg: 'canvg',
    html2canvas: 'html2canvas',
    dompurify: 'dompurify',
    coreJs: 'core-js',
    raf: 'raf',
    rgbcolor: 'rgbcolor',
    rfdc: 'rfdc',
  },
};
