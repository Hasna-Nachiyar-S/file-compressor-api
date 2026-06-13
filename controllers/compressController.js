const fs = require("fs");
const path = require("path");

const compressImage = require("../services/imageService");
const compressDocument = require("../services/documentService");
const downloadFile = require("../services/downloadFileService");

exports.compressFromUrl = async (req, res) => {
  try {
    console.log("NEW DEPLOYMENT ACTIVE");
    console.log("BODY:", req.body);

    const { fileUrl, fileName, compressionLevel } = req.body;

    if (!fileUrl || !fileName) {
      return res.status(400).json({
        success: false,
        message: "fileUrl and fileName required",
      });
    }

    const extension = fileName.split(".").pop().toLowerCase();

    console.log("EXTENSION:", extension);

    const imageExtensions = [
      "jpg",
      "jpeg",
      "png",
      "webp",
      "gif",
      "bmp",
      "tiff",
    ];

    const localFile = path.join("uploads", `${Date.now()}.${extension}`);

    await downloadFile(fileUrl, localFile);

    let result;

    if (imageExtensions.includes(extension)) {
      console.log("IMAGE PATH TRIGGERED");

      result = await compressImage(localFile, compressionLevel);
    } else {
      console.log("DOCUMENT PATH TRIGGERED");

      result = await compressDocument(localFile);
    }

    if (fs.existsSync(localFile)) {
      fs.unlinkSync(localFile);
    }

    const downloadUrl = `https://${req.get("host")}/${result.outputPath}`;

    return res.json({
      success: true,
      originalSize: result.originalSize,
      compressedSize: result.compressedSize,
      downloadUrl,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
