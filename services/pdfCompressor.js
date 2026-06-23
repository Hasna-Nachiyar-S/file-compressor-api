const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

function run(command) {
  return new Promise((resolve, reject) => {
    exec(command, (err) => {
      if (err) {
        reject(err);
        return;
      }

      resolve();
    });
  });
}

async function compressPdf(inputPath, compressionLevel = 50) {
  const outputPath = `compressed/${Date.now()}.pdf`;

  let setting = "/ebook";

  if (compressionLevel > 80) setting = "/screen";

  if (compressionLevel < 30) setting = "/printer";

  await run(`
gs \
-sDEVICE=pdfwrite \
-dCompatibilityLevel=1.4 \
-dPDFSETTINGS=${setting} \
-dNOPAUSE \
-dQUIET \
-dBATCH \
-sOutputFile="${outputPath}" \
"${inputPath}"
`);

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

module.exports = compressPdf;
