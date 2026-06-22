console.log("IMAGE SERVICE BUILD 2026-06-22");
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

function getSettings(level = 50) {
  const percentage = Math.max(1, Math.min(100, Number(level) || 50));

  // Wider quality range
  const quality = Math.round(95 - ((percentage - 1) * 80) / 99);

  return {
    percentage,
    quality,
  };
}

async function compressImage(inputPath, compressionLevel = 50) {
  const settings = getSettings(compressionLevel);

  const outputPath = path.join("compressed", `${Date.now()}.jpg`);

  const originalSize = fs.statSync(inputPath).size;

  const metadata = await sharp(inputPath).metadata();

  let targetWidth = metadata.width;

  // Resize only when image is large
  if (metadata.width > 2000) {
    targetWidth = 2000;
  } else if (metadata.width > 1500) {
    targetWidth = 1500;
  }

  console.log("=================================");
  console.log("IMAGE SERVICE VERSION");
  console.log("Compression Level:", compressionLevel);
  console.log("Quality:", settings.quality);
  console.log("Original Width:", metadata.width);
  console.log("Original Height:", metadata.height);
  console.log("Target Width:", targetWidth);
  console.log("Original Size:", originalSize);
  console.log("=================================");

  await sharp(inputPath)
    .resize({
      width: targetWidth,
      withoutEnlargement: true,
    })
    .jpeg({
      quality: settings.quality,
      mozjpeg: true,
    })
    .toFile(outputPath);

  const compressedSize = fs.statSync(outputPath).size;

  const reductionPercent =
    originalSize > 0
      ? (((originalSize - compressedSize) / originalSize) * 100).toFixed(2)
      : "0.00";

  console.log("Compressed Size:", compressedSize);
  console.log("Reduction:", reductionPercent + "%");

  return {
    outputPath,
    originalSize,
    compressedSize,
    quality: settings.quality,
    originalWidth: metadata.width,
    originalHeight: metadata.height,
    compressedWidth: targetWidth,
    reductionPercent,
  };
}

module.exports = compressImage;
