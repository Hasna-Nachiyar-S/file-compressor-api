const sharp = require("sharp");
const fs = require("fs");

function getQuality(level) {
  if (level === "low") return 95;
  if (level === "medium") return 70;
  return 40;
}

async function compressImage(inputPath, compressionLevel) {
  console.log("🔥 IMAGE SERVICE HIT 🔥");
  console.log("LEVEL:", compressionLevel);

  const quality = getQuality(compressionLevel);

  const outputPath = "compressed/" + Date.now() + ".jpg";

  const originalSize = fs.statSync(inputPath).size;

  await sharp(inputPath).resize(1000).jpeg({ quality }).toFile(outputPath);

  const compressedSize = fs.statSync(outputPath).size;

  return {
    outputPath,
    originalSize,
    compressedSize,
  };
}

// 🔥 IMPORTANT: explicit export
module.exports = compressImage;
