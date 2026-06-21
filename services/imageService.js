const sharp = require("sharp");
const fs = require("fs");

function getSettings(level = 50) {
  const percentage = Math.max(1, Math.min(100, Number(level) || 50));

  /*
    1   => quality 95
    50  => quality 80
    100 => quality 60
  */

  const quality = Math.round(95 - ((percentage - 1) * 35) / 99);

  return {
    percentage,
    quality,
  };
}

async function compressImage(inputPath, compressionLevel = 50) {
  const settings = getSettings(compressionLevel);

  const outputPath = `compressed/${Date.now()}.jpg`;

  const originalSize = fs.statSync(inputPath).size;

  const image = sharp(inputPath);

  const metadata = await image.metadata();

  console.log("=================================");
  console.log("Compression Level:", compressionLevel);
  console.log("Quality:", settings.quality);
  console.log("Width:", metadata.width);
  console.log("Height:", metadata.height);
  console.log("Original Size:", originalSize);
  console.log("=================================");

  await image
    .jpeg({
      quality: settings.quality,
      mozjpeg: true,
    })
    .toFile(outputPath);

  const compressedSize = fs.statSync(outputPath).size;

  console.log("Compressed Size:", compressedSize);

  return {
    outputPath,
    originalSize,
    compressedSize,
    quality: settings.quality,
    width: metadata.width,
    compressionPercentage: compressionLevel,
    reductionPercent:
      originalSize > 0
        ? (((originalSize - compressedSize) / originalSize) * 100).toFixed(2)
        : "0",
  };
}

module.exports = compressImage;
