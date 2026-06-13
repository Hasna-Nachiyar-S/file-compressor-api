const sharp = require("sharp");
const fs = require("fs");

function getCompressionSettings(level) {
  switch (level) {
    case "low":
      return {
        width: 1800,
        quality: 90,
      };

    case "medium":
      return {
        width: 1200,
        quality: 70,
      };

    case "high":
      return {
        width: 800,
        quality: 40,
      };

    default:
      return {
        width: 1200,
        quality: 70,
      };
  }
}

async function compressImage(inputPath, compressionLevel = "medium") {
  const settings = getCompressionSettings(compressionLevel);

  const outputPath = `compressed/${Date.now()}.jpg`;

  const originalSize = fs.statSync(inputPath).size;

  console.log("Compressing:", compressionLevel, settings);

  await sharp(inputPath)
    .resize({
      width: settings.width,
      withoutEnlargement: true,
    })
    .jpeg({
      quality: settings.quality,
      mozjpeg: true,
    })
    .toFile(outputPath);

  const compressedSize = fs.statSync(outputPath).size;

  console.log("Original:", originalSize, "Compressed:", compressedSize);

  return {
    outputPath,
    originalSize,
    compressedSize,
  };
}

module.exports = compressImage;
