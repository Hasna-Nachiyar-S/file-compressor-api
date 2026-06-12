const sharp = require("sharp");
const fs = require("fs");

function getQuality(level) {
  switch (level) {
    case "low":
      return 90; // least compression
    case "medium":
      return 70;
    case "high":
      return 40; // strongest compression
    default:
      return 70;
  }
}

async function compressImage(inputPath, compressionLevel) {
  const quality = getQuality(compressionLevel);

  const outputPath = "compressed/" + Date.now() + ".webp";

  const originalSize = fs.statSync(inputPath).size;

  await sharp(inputPath).webp({ quality }).toFile(outputPath);

  const compressedSize = fs.statSync(outputPath).size;

  return {
    outputPath,
    originalSize,
    compressedSize,
  };
}

module.exports = compressImage;
