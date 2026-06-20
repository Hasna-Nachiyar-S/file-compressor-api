const sharp = require("sharp");
const fs = require("fs");

function settings(compressionPercentage = 50) {
  const percentage = Math.max(
    1,
    Math.min(100, Number(compressionPercentage) || 50),
  );

  // 1 = best quality
  // 100 = strongest compression

  const quality = Math.round(100 - ((percentage - 1) * 50) / 99);

  const width = Math.round(1200 - ((percentage - 1) * (1200 - 250)) / 99);

  return {
    percentage,
    quality,
    width,
  };
}

async function compressImage(inputPath, compressionPercentage = 50) {
  const s = settings(compressionPercentage);

  const outputPath = `compressed/${Date.now()}.jpg`;

  const originalSize = fs.statSync(inputPath).size;

  console.log("=================================");
  console.log("Compression:", compressionPercentage);
  console.log("Quality:", s.quality);
  console.log("Width:", s.width);
  console.log("Original Size:", originalSize);
  console.log("=================================");

  await sharp(inputPath)
    .resize({
      width: s.width,
      withoutEnlargement: true,
    })
    .jpeg({
      quality: s.quality,
      mozjpeg: true,
    })
    .toFile(outputPath);

  const compressedSize = fs.statSync(outputPath).size;

  console.log("Compressed Size:", compressedSize);

  return {
    outputPath,
    originalSize,
    compressedSize,
    quality: s.quality,
    width: s.width,
    compressionPercentage,
    reductionPercent:
      originalSize > 0
        ? (((originalSize - compressedSize) / originalSize) * 100).toFixed(2)
        : "0",
  };
}

module.exports = compressImage;
