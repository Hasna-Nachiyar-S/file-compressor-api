const fs = require("fs");
const zlib = require("zlib");

async function compressCsv(inputPath) {
  const outputPath = `compressed/${Date.now()}.csv`;

  const data = fs.readFileSync(inputPath);

  const compressed = zlib.gzipSync(data);

  fs.writeFileSync(outputPath, zlib.gunzipSync(compressed));

  const originalSize = data.length;

  const compressedSize = fs.statSync(outputPath).size;

  return {
    outputPath,
    originalSize,
    compressedSize,
    reductionPercent: (
      ((originalSize - compressedSize) / originalSize) *
      100
    ).toFixed(2),
  };
}

module.exports = compressCsv;
