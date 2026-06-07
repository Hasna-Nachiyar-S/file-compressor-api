const sharp = require("sharp");
const fs = require("fs");

async function compressImage(
  inputPath,
  compressionLevel = "mediumcompression",
) {
  let quality = 70;

  switch (compressionLevel) {
    case "lowcompression":
      quality = 90;
      break;

    case "mediumcompression":
      quality = 70;
      break;

    case "highcompression":
      quality = 40;
      break;
  }

  const outputPath = "compressed/" + Date.now() + ".webp";

  await sharp(inputPath).webp({ quality }).toFile(outputPath);

  return {
    outputPath,
    originalSize: fs.statSync(inputPath).size,
    compressedSize: fs.statSync(outputPath).size,
  };
}

module.exports = compressImage;
