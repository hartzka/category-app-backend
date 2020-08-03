const testingRouter = require('express').Router()
const Categ = require('../models/categ')
const User = require('../models/user')

testingRouter.post('/reset', async (request, response) => {
  await Categ.deleteMany({})
  await User.deleteMany({})

  response.status(204).end()
})

module.exports = testingRouter