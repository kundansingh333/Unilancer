

const express = require("express");
const router = express.Router();
const multer = require("multer");
const cloudinary = require("../config/cloudinary");

const upload = multer({ storage: multer.memoryStorage() });

// NEW GENERIC FILE UPLOAD ENDPOINT
router.post("/file", upload.single("file"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file provided" });
    }

    // PDFs and Documents must be 'raw' in Cloudinary to be viewable/downloadable
    let resType = "auto";
    if (req.file.mimetype.includes("application/") || req.file.mimetype.includes("text/")) {
      resType = "raw";
    }

    const stream = cloudinary.uploader.upload_stream(
      { 
        folder: "messages",
        resource_type: resType 
      },
      (error, result) => {
        if (error) {
          console.error("Cloudinary error:", error);
          return res.status(500).json({ error: "Upload failed", details: error });
        }

        return res.json({ url: result.secure_url });
      }
    );

    stream.end(req.file.buffer);
  } catch (err) {
    console.error("Upload route error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
