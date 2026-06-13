const sharp = require("sharp");
const fs = require("fs");

function settings(level) {
  switch (level) {
    case "low":
      return { width: 1800, quality: 90 };
    case "medium":
      return { width: 1200, quality: 70 };
    case "high":
      return { width: 800, quality: 40 };
    default:
      return { width: 1200, quality: 70 };
  }
}

async function compressImage(inputPath, level = "medium") {
  const s = settings(level);

  const outputPath = `compressed/${Date.now()}.jpg`;

  const originalSize = fs.statSync(inputPath).size;

  console.log("COMPRESS LEVEL:", level, s);

  await sharp(inputPath)
    .resize({ width: s.width, withoutEnlargement: true })
    .jpeg({ quality: s.quality })
    .toFile(outputPath);

  const compressedSize = fs.statSync(outputPath).size;

  console.log("SIZE:", originalSize, "→", compressedSize);

  return {
    outputPath,
    originalSize,
    compressedSize,
  };
}

module.exports = compressImage;
