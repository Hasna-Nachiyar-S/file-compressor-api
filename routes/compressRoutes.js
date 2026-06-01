const express = require("express");

const router = express.Router();

const upload = require("../services/uploadService");

const controller = require("../controllers/compressController");

router.post("/image", upload.single("file"), controller.compressImage);

router.post("/document", upload.single("file"), controller.compressDocument);

module.exports = router;
