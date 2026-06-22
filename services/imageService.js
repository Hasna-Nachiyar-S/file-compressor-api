const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

console.log("IMAGE SERVICE BUILD 2026-06-22");

function getSettings(level = 50) {
  const percentage = Math.max(1, Math.min(100, Number(level) || 50));

  // Gentler curve
  const quality = Math.round(100 - percentage * 0.6);

  return {
    percentage,
    quality,
  };
}

async function compressImage(inputPath, compressionLevel = 50) {
  const settings = getSettings(compressionLevel);

  const ext = path.extname(inputPath).toLowerCase();

  let outputExtension = ".jpg";

  switch (ext) {
    case ".png":
      outputExtension = ".png";
      break;

    case ".webp":
      outputExtension = ".webp";
      break;

    case ".jpeg":
    case ".jpg":
    default:
      outputExtension = ".jpg";
      break;
  }

  const outputPath = path.join("compressed", `${Date.now()}${outputExtension}`);

  const originalSize = fs.statSync(inputPath).size;

  const metadata = await sharp(inputPath).metadata();

  let targetWidth = metadata.width;

  // Resize only very large images
  if (metadata.width > 2500) {
    targetWidth = 2500;
  }

  console.log("=================================");
  console.log("Compression Level:", compressionLevel);
  console.log("Quality:", settings.quality);
  console.log("Original Width:", metadata.width);
  console.log("Original Height:", metadata.height);
  console.log("Target Width:", targetWidth);
  console.log("Original Size:", originalSize);
  console.log("Input Format:", metadata.format);
  console.log("=================================");

  let pipeline = sharp(inputPath);

  if (targetWidth !== metadata.width) {
    pipeline = pipeline.resize({
      width: targetWidth,
      withoutEnlargement: true,
    });
  }

  switch (outputExtension) {
    case ".png":
      await pipeline
        .png({
          compressionLevel: Math.round((compressionLevel / 100) * 9),
          adaptiveFiltering: true,
        })
        .toFile(outputPath);
      break;

    case ".webp":
      await pipeline
        .webp({
          quality: settings.quality,
        })
        .toFile(outputPath);
      break;

    default:
      await pipeline
        .jpeg({
          quality: settings.quality,
          mozjpeg: true,
        })
        .toFile(outputPath);
      break;
  }

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
    compressedHeight: metadata.height * (targetWidth / metadata.width),
    reductionPercent,
  };
}

module.exports = compressImage;
