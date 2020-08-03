const mongoose = require('mongoose')

const categSchema = mongoose.Schema({
  mainCateg: {
    type: String,
    required: true
  },
  isMainCateg: {
    type: Boolean,
    required: true,
  },
  subCateg: String,
  name: String,
  description: String,
  stars: Number,
  image: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Image'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
})

categSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Categ = mongoose.model('Categ', categSchema)
module.exports = Categ

