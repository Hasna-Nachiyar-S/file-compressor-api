const sharp = require("sharp");
const fs = require("fs");

function getQuality(level) {
  switch (level) {
    case "low":
      return 90;
    case "medium":
      return 70;
    case "high":
      return 40;
    default:
      return 70;
  }
}

async function compressImage(inputPath, compressionLevel) {
  console.log("compressImage called with:", compressionLevel);

  const quality = getQuality(compressionLevel);

  const outputPath = "compressed/" + Date.now() + ".webp";

  const originalSize = fs.statSync(inputPath).size;

  await sharp(inputPath)
    .rotate() // 🔥 IMPORTANT: forces proper processing
    .toFormat("webp", { quality }) // 🔥 more reliable than .webp()
    .toFile(outputPath);

  const compressedSize = fs.statSync(outputPath).size;

  console.log("Quality used:", quality);
  console.log("Original:", originalSize, "Compressed:", compressedSize);

  return {
    outputPath,
    originalSize,
    compressedSize,
  };
}

module.exports = compressImage;
