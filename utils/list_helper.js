const _ = require('lodash')
const User = require('../models/user')

const totalStars = (categs) => {
  let total = categs.reduce(function(sum, categ) {
      return sum+categ.stars
  }, 0)
  return total
}

const favoriteCateg = (categs) => {
  if (categs.length===0) {
      return {}
  }

  maxStars = categs.reduce(function (categ, m) {
    return ( categ.stars > m.stars ? categ : m );
  });

  return {
      mainCateg: maxStars.mainCateg,
      subCateg: maxStars.subCateg,
      name: maxStars.name,
      description: maxStars.description,
      isMainCateg: maxStars.isMainCateg,
      stars: maxStars.stars
    }
}

const mostCategs = (categs) => {
    return _(categs)
    .groupBy('mainCateg')
    .map((c, mainCateg) => ({ mainCateg, categs: c.length }))
    .maxBy('categs')
}

const mostStars = (categs) => {
    return _(categs)
    .groupBy('mainCateg')
    .map((categs, mainCateg) => {
        const stars = categs.reduce(function(sum, categ) {
            return sum+categ.stars
        }, 0)
        return ({ mainCateg: mainCateg, stars: stars })
    })
    .maxBy('stars')
}

module.exports = {
  totalStars: totalStars, favoriteCateg: favoriteCateg, mostCategs: mostCategs, mostStars
}