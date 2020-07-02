const express = require('express');
const Image = require('../models/image');
const imageRouter = express.Router();
const multer = require('multer');

imageRouter.get('/', async (request, response) => {
    const images = await Image.find({}).populate('blogs', {
      title: 1, author: 1, url: 1, likes: 1
    })  
    response.json(images.map(u => u.toJSON()))
})

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});

imageRouter.route("/uploadmulter")
    .post(upload.single('imageData'), async (req, res, next) => {
        try {
        console.log(req.body)
        const image = new Image({
            imageName: req.body.imageName,
            imageData: req.file.path,
            multerImage: req.body.multerImage
        });
        const newImage = await image.save()
        res.json(newImage)
    } catch (exception) {
        next(exception)
    }   
})

module.exports = imageRouter;