const fs = require("fs");
const path = require("path");

const compressImage = require("../services/imageService");
const compressDocument = require("../services/documentService");
const downloadFile = require("../services/downloadFileService");

exports.compressFromUrl = async (req, res) => {
  try {
    console.log("Request:", req.body);

    const { fileUrl, mimeType, compressionLevel } = req.body;

    if (!fileUrl) {
      return res.status(400).json({
        success: false,
        message: "fileUrl required",
      });
    }

    const extension = mimeType?.split("/")[1] || "tmp";

    const localFile = path.join("uploads", `${Date.now()}.${extension}`);

    console.log("Downloading:", fileUrl);

    await downloadFile(fileUrl, localFile);

    console.log("Download complete");

    let result;

    if (mimeType?.startsWith("image/")) {
      result = await compressImage(localFile, compressionLevel);
    } else {
      result = await compressDocument(localFile);
    }

    if (fs.existsSync(localFile)) {
      fs.unlinkSync(localFile);
    }

    const baseUrl = `${req.protocol}://${req.get("host")}`;

    return res.json({
      success: true,
      originalSize: result.originalSize,
      compressedSize: result.compressedSize,
      downloadUrl: `${baseUrl}/${result.outputPath}`,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
