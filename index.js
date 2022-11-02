const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2
require('dotenv').config();
const fs = require('fs').promises

const upload = multer({
   storage: multer.diskStorage({
      destination: './temp',
      filename: (req, file, cb) => cb(null, file.originalname)
   })
});

cloudinary.config({
   api_key: process.env.CLD_API_KEY,
   api_secret: process.env.CLD_API_SECRET,
   cloud_name: process.env.CLD_CLOUD_NAME
})

const app = express();

app.use(express.json());

app.post('/upload', upload.single('image'), async (req, res) => {
   try {
      const { secure_url } = await cloudinary.uploader.upload(req.file.path);
      fs.unlink(req.file.path)
         .then(() => console.log(`File ${req.file.path} removed`))
         .catch((err) => console.log('Error while removing file', err));
      res.json({
         url: secure_url,
      });
   } catch (error) {
      res.json({
         error,
      })
   }
});

app.listen(5000, () => {
   console.log(`Server listen on port 5000`);
});
