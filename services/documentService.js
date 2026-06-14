const AdmZip = require("adm-zip");
const fs = require("fs");

async function compressDocument(inputPath, compressionLevel = 50) {
  const zip = new AdmZip();

  zip.addLocalFile(inputPath);

  const outputPath = "compressed/" + Date.now() + ".zip";

  zip.writeZip(outputPath);

  return {
    outputPath,
    originalSize: fs.statSync(inputPath).size,
    compressedSize: fs.statSync(outputPath).size,
    compressionLevel,
    reductionPercent: (
      ((fs.statSync(inputPath).size - fs.statSync(outputPath).size) /
        fs.statSync(inputPath).size) *
      100
    ).toFixed(2),
  };
}

module.exports = compressDocument;
