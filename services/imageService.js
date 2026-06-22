const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

console.log("IMAGE SERVICE BUILD 2026-06-22");

function getQuality(level = 50) {
  level = Math.max(1, Math.min(100, Number(level) || 50));

  return Math.round(95 - ((level - 1) * 55) / 99);
}

async function compressImage(inputPath, compressionLevel = 50) {
  const quality = getQuality(compressionLevel);

  const metadata = await sharp(inputPath).metadata();

  const originalSize = fs.statSync(inputPath).size;

  const ext = path.extname(inputPath).toLowerCase();

  let outputExtension;

  if (ext === ".png") {
    outputExtension = ".webp";
  } else if (ext === ".webp") {
    outputExtension = ".webp";
  } else {
    outputExtension = ".jpg";
  }

  const outputPath = path.join("compressed", `${Date.now()}${outputExtension}`);

  let targetWidth = metadata.width;

  if (metadata.width > 2500) {
    targetWidth = 2500;
  }

  console.log("=================================");
  console.log("Compression Level:", compressionLevel);
  console.log("Quality:", quality);
  console.log("Original Size:", originalSize);
  console.log("Format:", metadata.format);
  console.log("Target Width:", targetWidth);
  console.log("=================================");

  let pipeline = sharp(inputPath);

  if (targetWidth !== metadata.width) {
    pipeline = pipeline.resize({
      width: targetWidth,
      withoutEnlargement: true,
    });
  }

  if (outputExtension === ".webp") {
    await pipeline
      .webp({
        quality,
        effort: 6,
      })
      .toFile(outputPath);
  } else {
    await pipeline
      .jpeg({
        quality,
        mozjpeg: true,
      })
      .toFile(outputPath);
  }

  const compressedSize = fs.statSync(outputPath).size;

  const reductionPercent =
    originalSize > 0
      ? (((originalSize - compressedSize) / originalSize) * 100).toFixed(2)
      : "0.00";

  console.log("Original:", originalSize);
  console.log("Compressed:", compressedSize);
  console.log("Reduction:", reductionPercent);

  return {
    outputPath,
    originalSize,
    compressedSize,
    quality,
    width: targetWidth,
    reductionPercent,
  };
}

module.exports = compressImage;
