const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const bcrypt = require('bcrypt')
const User = require('../models/user')

beforeEach(async () => {
  await User.deleteMany({})
  const user = new User({ username: 'root', password: "passwordHash" })
  await user.save()
})

describe('when there is initially one user at db', () => {
  test('succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'abc',
      name: 'abc',
      password: 'def',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd.length).toBe(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('creation fails with proper statuscode and message if username already exists', async () => {
    const newUser = {
      username: 'root',
      name: 'root',
      password: 'hash',
    }

    await api
      .post('/api/users')
      .send(newUser)

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('`username` to be unique')
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const newUser = {
      username: 'aaa',
      name: 'Jaa',
      password: 'b',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('Password min length 3')
  })
})


afterAll(() => {
  mongoose.connection.close()
})