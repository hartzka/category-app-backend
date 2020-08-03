const mongoose = require('mongoose');

const ImageSchema = mongoose.Schema({
    imageName: {
        type: String,
        default: "none",
        required: true
    },
    imageData: {
        type: String,
        required: true
    },
    multerImage: {
        type: String,
        required: true
    },
    categ: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Categ'
    }}, {
    timestamps: true
});

ImageSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })

const Image = mongoose.model('Image', ImageSchema);

module.exports = Image;