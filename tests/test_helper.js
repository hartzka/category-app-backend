const Categ = require('../models/categ')
const User = require('../models/user')

const initialCategs = [
    { _id: "5a422a851b54a676234d17f5", mainCateg: "courses", subCateg: "fuksi", name: "tira", description: "tietorakenteet ja algot", stars: 5, isMainCateg: false, __v: 0 },
    { _id: "5a422a851b54a676234d17f6", mainCateg: "courses", subCateg: "kandi", name: "kandi", description: "kandidaatin tutkielma", stars: 3, isMainCateg: false, __v: 0 },
    { _id: "5a422a851b54a676234d17f7", mainCateg: "courses", subCateg: "maisteri", name: "daa", description: "design and anal of algos", stars: 4, isMainCateg: false, __v: 0 },
    { _id: "5a422a851b54a676234d17f8", mainCateg: "os systems", subCateg: "", name: "linux", description: "linus", stars: 2, isMainCateg: false, __v: 0 },
    { _id: "5a422a851b54a676234d17f9", mainCateg: "os systems", subCateg: "", name: "windows", description: "", stars: 0, isMainCateg: false, __v: 0 },
    { _id: "5a422a851b54a676234d17f3", mainCateg: "courses", subCateg: "", name: "", description: "", isMainCateg: true, stars: 0, __v: 0 },
    { _id: "5a422a851b54a676234d17f4", mainCateg: "os systems", subCateg: "", name: "", description: "", isMainCateg: true, stars: 0, __v: 0 }
  ]

const categsInDb = async () => {
  const categs = await Categ.find({})
  return categs.map(categ => categ.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = {
  initialCategs: initialCategs, categsInDb: categsInDb, usersInDb
}