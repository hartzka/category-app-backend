const express = require('express');
const Image = require('../models/image');
const imageRouter = express.Router();
const multer = require('multer');
const s3 = require('./s3')

imageRouter.get('/', async (request, response) => {
    const images = await Image.find({}).populate('categ', {
      mainCateg: 1, subCateg: 1, description: 1, stars: 1, name: 1
    })  
    response.json(images.map(u => u.toJSON()))
})

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname)
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/gif') {
        cb(null, true)
    } else {
        cb(null, false)
    }
}

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 50
    },
    fileFilter: fileFilter
});

imageRouter.route("/uploadmulter")
    .post(upload.single('imageData'), async (req, res, next) => {
        try {
        const image = new Image({
            imageName: req.body.imageName,
            imageData: `https://${process.env.S3_BUCKET_NAME}.s3.eu-north-1.amazonaws.com/${req.file.path}`,
            multerImage: req.body.multerImage
        });
        const newImage = await image.save()
        s3.uploadFile(req.file.path)
        res.json(newImage)
    } catch (exception) {
        next(exception)
    }   
})

module.exports = imageRouter;