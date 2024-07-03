const express = require("express");
const router = express.Router();
const getnodes = require("../models/sankeynodes");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { translate } = require("free-translate");

// Configure Multer for storing profile images
const storage = multer.memoryStorage(); // Use memory storage for file uploads

const fileFilter = (req, file, cb) => {
  // Check the file size (in bytes)
  if (file.size > 5 * 1024 * 1024) { // 5 MB limit
    return cb(new Error("File size too large. Max 5 MB allowed."));
  }
  cb(null, true); // Allow the upload if it passes the size check
};

const nodes = multer({
  storage: storage,
  fileFilter: fileFilter,
});

router.put("/", nodes.single("image"), async (req, res) => {
  try {
    const { role } = req.authData;
    if (req.authData) {
      if (role !== "admin") {
        throw {
          status: 403,
          message: "Access forbidden. You are not an admin.",
        };
      }
    }

    const { id, name, colour } = req.body;

    if (!id) return res.status(400).send("Required field cannot be empty");

    const node = await getnodes.findOne({ where: { id } });
    if (!node) return res.status(400).send("No such node exists.");

    const imagepath = path.join(__dirname, "..", "public/nodes", node.image);
    if (fs.existsSync(imagepath) && node.image && req?.file?.buffer)
      fs.unlinkSync(imagepath);

    let img = node.image;
    // Upload image if a new one is provided
    if (req.file) {
      const fileExtension = req.file.originalname.split(".").pop();
      const fileName = `${name}-${Date.now()}.${fileExtension}`;
      const filePath = path.join(__dirname, "..", "public/nodes", fileName);

      fs.writeFileSync(filePath, req.file.buffer);
      img = fileName;
    }

    // Update the node record
    let updatednode = await getnodes.update(
      {
        id,
        name: name == "" ? node.name : name,
        colour: colour ? colour : node.colour,
        image: img,
      },
      {
        where: { id },
        returning: true,
        plain: true,
      }
    );

    // Translate to French and update the database
    translate(name, { from: "en", to: "fr" }).then(async (translatedText) => {
      getnodes.update(
        {
          id_french: translatedText,
        },
        {
          where: { id },
          returning: true,
          plain: true,
        }
      ).then(() => {
        console.log("French saved")
      })
    });

    // Translate to Portuguese and update the database
    translate(name, { from: "en", to: "pt" }).then(async (translatedText) => {
      getnodes.update(
        {
          id_portuguese: translatedText,
        },
        {
          where: { id },
          returning: true,
          plain: true,
        }
      ).then(() => {
        console.log("Portuguese saved")
      })
    });

    return res.status(200).send({ message: "Node updated successfully" });
  } catch (err) {
    console.log(err);
    res.status(400).send("Something went wrong!");
  }
});

module.exports = router;
