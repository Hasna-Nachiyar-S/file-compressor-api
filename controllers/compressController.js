const fs = require("fs");

const compressImage = require("../services/imageService");

const compressDocument = require("../services/documentService");

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

    res.status(200).json({
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

    res.status(200).json({
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
