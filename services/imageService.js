const sharp = require("sharp");
const fs = require("fs");

function getQuality(level) {
  if (level === "low") return 95;
  if (level === "medium") return 70;
  return 40;
}

async function compressImage(inputPath, compressionLevel) {
  console.log("LEVEL:", compressionLevel);

  const quality = getQuality(compressionLevel);

  const outputPath = "compressed/" + Date.now() + ".jpg";

  const originalSize = fs.statSync(inputPath).size;

  await sharp(inputPath)
    .rotate()
    .resize({ width: 1200 }) // 🔥 IMPORTANT: forces real size change
    .jpeg({ quality, mozjpeg: true })
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
