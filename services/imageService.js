const sharp = require("sharp");
const fs = require("fs");

async function compressImage(inputPath) {
  const outputPath = "compressed/" + Date.now() + ".webp";

  await sharp(inputPath).webp({ quality: 70 }).toFile(outputPath);

  const originalSize = fs.statSync(inputPath).size;

  const compressedSize = fs.statSync(outputPath).size;

  return {
    outputPath,
    originalSize,
    compressedSize,
  };
}

module.exports = compressImage;
