const categRouter = require('express').Router()
const Categ = require('../models/categ')
const User = require('../models/user')
const Image = require('../models/image')
const jwt = require('jsonwebtoken')

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }
  return null
}

categRouter.get('/', async (request, response) => {
  const categs = await Categ.find({})
  .populate('image', { imageName: 1, imageData: 1, multerImage: 1 })
  .populate('user', { username: 1, name: 1 })
  response.json(categs.map(categ => categ.toJSON()))
})

categRouter.get('/:id', async (request, response) => {
  const categ = await Categ.findById(request.params.id)
  .populate('image', { imageName: 1, imageData: 1, multerImage: 1 })
  .populate('user', { username: 1, name: 1 })
  if (categ) {
    response.json(categ.toJSON())
  } else {
    response.status(404).end()
  }
})

categRouter.post('/', async (request, response, next) => {
  const body = request.body
  
  const token = getTokenFrom(request)

  const decodedToken = jwt.verify(token, process.env.SECRET)
  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  if (!body.mainCateg || body.mainCateg === '') {
    return response.status(400).send({ error: 'category1 missing' })
  }

  if (!body.isMainCateg && body.name === '') {
    return response.status(400).send({ error: 'name is empty' })
  }

  const user = await User.findById(decodedToken.id)
  let image = null
  if (body.image !== undefined) {
    image = await Image.findById(body.image.id)
  }

  let categ
  if (image === null) {
    categ = new Categ({
      mainCateg: body.mainCateg,
      subCateg: body.subCateg === undefined ? '' : body.subCateg,
      isMainCateg: body.isMainCateg,
      name: body.name === undefined ? '' : body.name,
      description: body.description === undefined ? '' : body.description,
      stars: body.stars === undefined ? 0 : body.stars,
      user: user._id
    })
  } else {
    categ = new Categ({
      mainCateg: body.mainCateg,
      subCateg: body.subCateg === undefined ? '' : body.subCateg,
      isMainCateg: body.isMainCateg,
      name: body.name === undefined ? '' : body.name,
      description: body.description === undefined ? '' : body.description,
      stars: body.stars === undefined ? 0 : body.stars,
      user: user._id,
      image: image._id
    })
  }

  const savedCateg = await categ.save()
  user.categs = user.categs.concat(savedCateg._id)
  await user.save()
  if (image !== null) {
    image.categ = savedCateg._id
    await image.save()
    const categToBeReturned = await Categ.findById(savedCateg.id)
    .populate('image', { imageName: 1, imageData: 1, multerImage: 1 })
    .populate('user', { username: 1, name: 1 })
    response.json(categToBeReturned.toJSON())
  } else {
    const categToBeReturned = await Categ.findById(savedCateg.id)
    .populate('user', { username: 1, name: 1 })
    response.json(categToBeReturned.toJSON())
  }
})

categRouter.delete('/:id', async (request, response, next) => {
  const id = request.params.id
  const token = getTokenFrom(request)

  const decodedToken = jwt.verify(token, process.env.SECRET)

  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

    try {
        const categ = await Categ.findById(id)

        if (categ.user.toString() === decodedToken.id) {
            const user = await User.findById(decodedToken.id)
            await Categ.findByIdAndRemove(categ._id)
            user.categs = user.categs.filter(c => c === categ._id)
            const updatedUser = await User.findByIdAndUpdate(decodedToken.id, user, { new: true })
            .populate('categ', {
              mainCateg: 1, subCateg: 1, description: 1, stars: 1, name: 1
            })  
            response.status(204).end()
        } else {
            response.status(401).json({ error: 'not authorized' })
        }

    } catch (error) {
        next(error)
    }
})

categRouter.put('/:id', async (request, response, next) => {
  const body = request.body

  let categ = {
    mainCateg: body.mainCateg,
    subCateg: body.subCateg === undefined ? '' : body.subCateg,
    isMainCateg: body.isMainCateg,
    name: body.name === undefined ? '' : body.name,
    description: body.description === undefined ? '' : body.description,
    stars: body.stars === undefined ? 0 : body.stars,
  }
  if (body.image !== undefined) {
    let image = await Image.findById(body.image.id)
    categ.image = image._id
    image.categ = categ._id
    await image.save()
  }

  const updatedCateg = await Categ.findByIdAndUpdate(request.params.id, categ, { new: true })
    .populate('image', { imageName: 1, imageData: 1, multerImage: 1 })
    .populate('user', { username: 1, name: 1 })
  response.json(updatedCateg.toJSON())
})

module.exports = categRouter