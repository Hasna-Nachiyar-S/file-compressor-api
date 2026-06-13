console.log("=== NEW CONTROLLER VERSION ===");
console.log(req.body);

const fs = require("fs");
const path = require("path");

const compressImage = require("../services/imageService");
const compressDocument = require("../services/documentService");
const downloadFile = require("../services/downloadFileService");

exports.compressFromUrl = async (req, res) => {
  try {
    const { fileUrl, fileName, compressionLevel } = req.body;

    console.log("BODY:", req.body);

    if (!fileUrl) {
      return res.status(400).json({
        success: false,
        message: "fileUrl required",
      });
    }

    const extension = fileName?.split(".").pop()?.toLowerCase() || "tmp";

    const localFile = path.join("uploads", `${Date.now()}.${extension}`);

    await downloadFile(fileUrl, localFile);

    const imageExtensions = [
      "jpg",
      "jpeg",
      "png",
      "webp",
      "gif",
      "bmp",
      "tiff",
    ];

    let result;

    if (imageExtensions.includes(extension)) {
      console.log("IMAGE DETECTED");
      console.log("LEVEL:", compressionLevel);

      result = await compressImage(localFile, compressionLevel);
    } else {
      console.log("DOCUMENT DETECTED");

      result = await compressDocument(localFile, compressionLevel);
    }

    if (fs.existsSync(localFile)) {
      fs.unlinkSync(localFile);
    }

    const protocol = req.headers["x-forwarded-proto"] || "https";

    const downloadUrl = `${protocol}://${req.get("host")}/${result.outputPath}`;

    res.json({
      success: true,
      originalSize: result.originalSize,
      compressedSize: result.compressedSize,
      downloadUrl,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
