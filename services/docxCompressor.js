const fs = require("fs");
const path = require("path");
const AdmZip = require("adm-zip");

async function compressDocx(inputPath, compressionLevel) {
  const outputPath = `compressed/${Date.now()}.docx`;

  const zip = new AdmZip(inputPath);

  zip.writeZip(outputPath);

  const originalSize = fs.statSync(inputPath).size;

  const compressedSize = fs.statSync(outputPath).size;

  return {
    outputPath,
    originalSize,
    compressedSize,
    reductionPercent: (
      ((originalSize - compressedSize) / originalSize) *
      100
    ).toFixed(2),
  };
}

module.exports = compressDocx;
