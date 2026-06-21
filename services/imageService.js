const sharp = require("sharp");
const fs = require("fs");

function settings(compressionPercentage = 50) {
  const percentage = Math.max(
    1,
    Math.min(100, Number(compressionPercentage) || 50),
  );

  /*
   * 1%  => quality 95
   * 50% => quality 80
   * 100% => quality 60
   */

  const quality = Math.round(95 - ((percentage - 1) * 35) / 99);

  return {
    percentage,
    quality,
  };
}

async function compressImage(inputPath, compressionPercentage = 50) {
  const s = settings(compressionPercentage);

  const outputPath = `compressed/${Date.now()}.jpg`;

  const originalSize = fs.statSync(inputPath).size;

  const image = sharp(inputPath);

  const metadata = await image.metadata();

  await image
    .jpeg({
      quality: s.quality,
      mozjpeg: true,
    })
    .toFile(outputPath);

  const compressedSize = fs.statSync(outputPath).size;

  return {
    outputPath,
    originalSize,
    compressedSize,
    quality: s.quality,
    width: metadata.width,
    reductionPercent:
      originalSize > 0
        ? (((originalSize - compressedSize) / originalSize) * 100).toFixed(2)
        : "0",
  };
}

module.exports = compressImage;
