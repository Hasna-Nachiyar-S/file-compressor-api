const sharp = require("sharp");
const fs = require("fs");

function settings(compressionPercentage = 50) {
  const percentage = Math.max(
    1,
    Math.min(100, Number(compressionPercentage) || 50),
  );

  /*
    USER LOGIC (consistent now):
    1%   = best quality (least compression)
    100% = strongest compression
  */

  const quality = Math.round(95 - ((percentage - 1) * (95 - 20)) / 99);

  const width = Math.round(2000 - ((percentage - 1) * (2000 - 600)) / 99);

  return { width, quality };
}

async function compressImage(inputPath, compressionPercentage = 50) {
  const s = settings(compressionPercentage);

  const outputPath = `compressed/${Date.now()}.jpg`;

  const originalSize = fs.statSync(inputPath).size;

  console.log("COMPRESSION:", compressionPercentage + "%", s);

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

  console.log("SIZE:", originalSize, "→", compressedSize);

  return {
    outputPath,
    originalSize,
    compressedSize,
    compressionPercentage,
    quality: s.quality,
    width: s.width,
    reductionPercent: (
      ((originalSize - compressedSize) / originalSize) *
      100
    ).toFixed(2),
  };
}

module.exports = compressImage;
