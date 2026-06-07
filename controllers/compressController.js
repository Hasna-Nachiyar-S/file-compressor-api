const fs = require("fs");

const compressImage = require("../services/imageService");

const compressDocument = require("../services/documentService");

const downloadFile = require("../services/downloadFileService");

exports.compressImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const filePath = req.file.path;

    const result = await compressImage(filePath);

    fs.unlinkSync(filePath);

    const baseUrl = `${req.protocol}://${req.get("host")}`;

    res.json({
      success: true,
      type: "image",
      originalFile: req.file.originalname,
      originalSize: result.originalSize,
      compressedSize: result.compressedSize,
      downloadUrl: `${baseUrl}/${result.outputPath}`,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.compressDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const filePath = req.file.path;

    const result = await compressDocument(filePath);

    fs.unlinkSync(filePath);

    const baseUrl = `${req.protocol}://${req.get("host")}`;

    res.json({
      success: true,
      type: "document",
      originalFile: req.file.originalname,
      originalSize: result.originalSize,
      compressedSize: result.compressedSize,
      downloadUrl: `${baseUrl}/${result.outputPath}`,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.compressFromUrl = async (req, res) => {
  try {
    const { fileUrl, mimeType } = req.body;

    if (!fileUrl) {
      return res.status(400).json({
        success: false,
        message: "fileUrl required",
      });
    }

    const localFile = `uploads/${Date.now()}`;

    await downloadFile(fileUrl, localFile);

    let result;

    if (mimeType && mimeType.startsWith("image/")) {
      result = await compressImage(localFile);
    } else {
      result = await compressDocument(localFile);
    }

    fs.unlinkSync(localFile);

    const baseUrl = `${req.protocol}://${req.get("host")}`;

    res.json({
      success: true,
      originalSize: result.originalSize,
      compressedSize: result.compressedSize,
      downloadUrl: `${baseUrl}/${result.outputPath}`,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
