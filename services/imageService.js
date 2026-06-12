const sharp = require("sharp");
const fs = require("fs");
const crypto = require("crypto");

function getQuality(level) {
  if (level === "low") return 95;
  if (level === "medium") return 70;
  return 40;
}

async function compressImage(inputPath, compressionLevel) {
  console.log("LEVEL:", compressionLevel);

  const quality = getQuality(compressionLevel);

  // 🔥 guaranteed unique filename
  const fileName = crypto.randomBytes(8).toString("hex");

  const outputPath = `compressed/${fileName}.jpg`;

  const originalSize = fs.statSync(inputPath).size;

  await sharp(inputPath)
    .rotate()
    .resize({
      width: 1000, // 🔥 forces real compression difference
      withoutEnlargement: true,
    })
    .jpeg({
      quality,
      mozjpeg: true,
    })
    .toFile(outputPath);

  const compressedSize = fs.statSync(outputPath).size;

  console.log("QUALITY:", quality);
  console.log("ORIGINAL:", originalSize);
  console.log("COMPRESSED:", compressedSize);

  return {
    outputPath,
    originalSize,
    compressedSize,
  };
}

module.exports = compressImage;
