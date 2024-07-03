const express = require('express');
const router = express.Router();
const addnodes = require('../models/sankeynodes');
const { translate } = require('free-translate');
const multer = require('multer');

// Set the maximum file size (e.g., 5MB)
const maxSize = 5 * 1024 * 1024; // 5MB in bytes

const storage = multer.diskStorage({
  destination: function (req, file, next) {
    next(null, 'public/nodes');
  },
  filename: function (req, file, next) {
    let { name } = req.body;

    // Extract the file extension from the uploaded file
    const fileExtension = file.originalname.split('.').pop();

    // Use the filename generated by Multer with the dynamic extension
    const filename = name + '.' + fileExtension;

    next(null, filename);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: maxSize }, // Set the maximum file size limit
}).single('image');

const defaultImageUrl = 'Default+Image.svg';

router.post('/', (req, res) => {
  upload(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred (e.g., file too large)
      return res.status(400).send('File is too large. Max file size is 5MB.');
    } else if (err) {
      // An unknown error occurred
      return res.status(400).send('Something went wrong!');
    }

    try {
      // const { role } = req.authData;
      // if (req.authData) {
      //   if (role !== 'admin') {
      //     throw {
      //       status: 403,
      //       message: 'Access forbidden. You are not an admin.',
      //     };
      //   }
      // }

      const { name, colour, sankeytype } = req.body;

      if (!name) return res.status(400).send('Required field cannot be empty');

      const node = await addnodes.findOne({
        where: { name, sankeytype },
      });
      if (node) return res.status(400).send('This node already exists.');

      // Extract the file extension from the uploaded file
      const fileExtension = req.file
        ? req.file.originalname.split('.').pop()
        : '';

      // Use the filename generated by Multer with the dynamic extension, or the default image
      const img = req.file ? `${name}.${fileExtension}` : defaultImageUrl;

      // Create the node record with id and color
      let addnode = await addnodes.create({
        colour: colour,
        image: img,
        sankeytype,
        name
      });

      // Send the response with the node information
      res.status(200).send({ message: 'Node added successfully', addnode });

      // Translate to French and update the database
      translate(name, { from: 'en', to: 'fr' }).then(async (translatedText) => {
        await addnodes.update(
          { id_french: translatedText },
          {
            where: { name },
          }
        );
        console.log('French stored');
      });

      // Translate to Portuguese and update the database
      translate(name, { from: 'en', to: 'pt' }).then(async (translatedText) => {
        await addnodes.update(
          { id_portegues: translatedText },
          {
            where: { name },
          }
        );
        console.log('Portuguese stored');
      });
    } catch (err) {
      console.log(err);
      res.status(400).send('Something went wrong!');
    }
  });
});

module.exports = router;
