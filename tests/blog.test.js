const listHelper = require('../utils/list_helper')
const helper = require('./test_helper')

const listWithOneCateg = [
  { 
    _id: "5a422a851b54a676234d17f5", 
    mainCateg: "courses", 
    subCateg: "fuksi", 
    name: "tira", 
    description: "tietorakenteet ja algot", 
    stars: 5,
    isMainCateg: false,
    __v: 0 
  },
]

describe('total stars', () => {

  test('when list has only one categ equals the stars of that', () => {
    const result = listHelper.totalStars(listWithOneCateg)
    expect(result).toBe(5)
  })

  test('stars of a bigger list is calculated right', () => {
    const result = listHelper.totalStars(helper.initialCategs)
    expect(result).toBe(14)
  })

  test('stars of empty list is zero', () => {
    const result = listHelper.totalStars([])
    expect(result).toBe(0)
  })
})

describe('favorite categ', () => {

  test('when list has only one categ equals that', () => {
    const result = listHelper.favoriteCateg(listWithOneCateg)
    expect(result).toEqual({
      mainCateg: "courses", 
      subCateg: "fuksi", 
      name: "tira", 
      description: "tietorakenteet ja algot", 
      stars: 5,
      isMainCateg: false
    })
  })

  test('returns the categ with max stars', () => {
    const result = listHelper.favoriteCateg(helper.initialCategs)
    expect(result).toEqual({
      mainCateg: "courses", 
      subCateg: "fuksi", 
      name: "tira", 
      description: "tietorakenteet ja algot", 
      stars: 5,
      isMainCateg: false
    })
  })

  test('returns empty object of empty list', () => {
    const result = listHelper.favoriteCateg([])
    expect(result).toEqual({})
  })
})

describe('most stars', () => {
  test('mostStars returns the correct result', () => {
    const result = listHelper.mostStars(helper.initialCategs);
    expect(result).toEqual({
      mainCateg: "courses", 
      stars: 12
    });
  })
})

describe('most categs', () => {
  test('mostCategs returns the correct result', () => {
    const result = listHelper.mostCategs(helper.initialCategs);
    expect(result).toEqual({ mainCateg: 'courses', categs: 4 });
  })
})