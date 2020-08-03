const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Categ = require('../models/categ')

const api = supertest(app)
let headers

describe('posting of a categ', () => {

  beforeEach(async () => {
    await Categ.deleteMany({})

    for (let i = 0; i<helper.initialCategs.length; i++) {
      let categObject = new Categ(helper.initialCategs[i])
      await categObject.save()
    }

    const newUser = {
      username: 'aaa',
      name: 'aaa',
      password: 'bbb'
    }

    await api
      .post('/api/users')
      .send(newUser)

    const result = await api
      .post('/api/login')
      .send(newUser)

    headers = {
      'Authorization': `bearer ${result.body.token}`
    }
  })

  test('categs are returned as json', async () => {
    await api
      .get('/api/categ')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('there are correct amount of categs', async () => {
      const response = await api.get('/api/categ')
      expect(response.body).toHaveLength(helper.initialCategs.length)
    })
    
  test('the first categ is tira', async () => {
    const response = await api.get('/api/categ')
    expect(response.body[0].name).toBe('tira')
  })

  test('id is defined correctly', async () => {
    const response = await api.get('/api/categ')
    expect(response.body[0].id).toBeDefined()
  })

  test('a valid categ can be added ', async () => {
    const newCateg = {
      mainCateg: "a", 
      subCateg: "b", 
      name: "c", 
      description: "d", 
      stars: 0,
      isMainCateg: false
    }

    await api
      .post('/api/categ')
      .send(newCateg)
      .set(headers)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const categsAtEnd = await helper.categsInDb()
    expect(categsAtEnd.length).toBe(helper.initialCategs.length + 1)

    const names = categsAtEnd.map(c => c.name)
    expect(names).toContain(
      'c'
    )
  })

  test('unvalid categ can not be added ', async () => {
    const newCateg = {
      mainCateg: "a", 
      subCateg: "b",
      description: "d", 
      stars: 0
    }

    await api
      .post('/api/categ')
      .send(newCateg)
      .expect(401)

    const response = await helper.categsInDb()

    expect(response).toHaveLength(helper.initialCategs.length)
  })


  test('categ without stars has 0 stars', async () => {
    const newCateg = {
      mainCateg: "a", 
      subCateg: "b", 
      name: "c", 
      description: "d",
      isMainCateg: false
    }

    await api
      .post('/api/categ')
      .send(newCateg)

    const response = await api.get('/api/categ')

    expect(response.body[response.body.length-1].stars===0)
  })

  test('categ without name is not added', async () => {
    const newCateg = {
      description: "d"
    }

    await api
      .post('/api/categ')
      .send(newCateg)
      .expect(401)

    const response = await api.get('/api/categ')

    expect(response.body).toHaveLength(helper.initialCategs.length)
  })
})

describe('when categ is saved to database', () => {
  let result
  beforeEach(async () => {
    const newCateg = {
      mainCateg: "a", 
      subCateg: "b", 
      name: "c", 
      description: "d", 
      stars: 0,
      isMainCateg: false
    }

    result = await api
      .post('/api/categ')
      .send(newCateg)
      .set(headers)
  })

  test('it can be removed', async () => {
    const aCateg = result.body

    const initialCategs = await helper.categsInDb()
    await api
      .delete(`/api/categ/${aCateg.id}`)
      .set(headers)
      .expect(204)

    const categsAtEnd = await helper.categsInDb()
    expect(categsAtEnd.length).toBe(initialCategs.length - 1)

    const names = categsAtEnd.map(c => c.name)
    expect(names).not.toContain(
      aCateg.name
    )
  })
})

afterAll(() => {
  mongoose.connection.close()
})