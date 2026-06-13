const AdmZip = require("adm-zip");
const fs = require("fs");

async function compressDocument(inputPath, compressionLevel = "medium") {
  const zip = new AdmZip();

  zip.addLocalFile(inputPath);

  const outputPath = "compressed/" + Date.now() + ".zip";

  zip.writeZip(outputPath);

  return {
    outputPath,
    originalSize: fs.statSync(inputPath).size,
    compressedSize: fs.statSync(outputPath).size,
  };
}

module.exports = compressDocument;
