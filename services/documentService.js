console.log("NEW DOCUMENT SERVICE LOADED");

const path = require("path");

const compressPdf = require("./pdfCompressor");
const compressDocx = require("./docxCompressor");
const compressXlsx = require("./xlsxCompressor");
const compressCsv = require("./csvCompressor");

async function compressDocument(inputPath, compressionLevel) {
  console.log("INPUT PATH:", inputPath);

  const ext = path.extname(inputPath).toLowerCase();

  console.log("EXTENSION:", ext);

  switch (ext) {
    case ".pdf":
      return await compressPdf(inputPath, compressionLevel);

    case ".docx":
      return await compressDocx(inputPath, compressionLevel);

    case ".xlsx":
      return await compressXlsx(inputPath, compressionLevel);

    case ".csv":
      return await compressCsv(inputPath, compressionLevel);

    default:
      throw new Error(`Unsupported document type: ${ext}`);
  }
}

module.exports = compressDocument;
