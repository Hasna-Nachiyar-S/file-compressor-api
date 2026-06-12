const fs = require("fs");
const path = require("path");

const compressImage = require("../services/imageService");
const compressDocument = require("../services/documentService");
const downloadFile = require("../services/downloadFileService");

exports.compressFromUrl = async (req, res) => {
  try {
    console.log("Request:", req.body);

    const { fileUrl, mimeType, compressionLevel } = req.body;

    console.log("Compression Level Received:", compressionLevel);

    if (!fileUrl) {
      return res.status(400).json({
        success: false,
        message: "fileUrl required",
      });
    }

    const extension = mimeType?.split("/")[1] || "tmp";

    const localFile = path.join("uploads", `${Date.now()}.${extension}`);

    await downloadFile(fileUrl, localFile);

    let result;

    if (mimeType && mimeType.startsWith("image/")) {
      console.log("ABOUT TO CALL IMAGE SERVICE");

      result = await compressImage(localFile, compressionLevel);

      console.log("IMAGE SERVICE RETURNED");
    } else {
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
  } catch (error) {
    console.error("Compression Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
