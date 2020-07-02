const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')

const api = supertest(app)
let headers

describe('posting of a blog', () => {

  beforeEach(async () => {
    await Blog.deleteMany({})

    for (let i = 0; i<helper.initialBlogs.length; i++) {
      let blogObject = new Blog(helper.initialBlogs[i])
      await blogObject.save()
    }

    const newUser = {
      username: 'aaa',
      name: 'aaa',
      password: 'bbb',
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

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('there are correct amount of blogs', async () => {
      const response = await api.get('/api/blogs')
      expect(response.body).toHaveLength(helper.initialBlogs.length)
    })
    
  test('the first blog is about React patterns', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body[0].title).toBe('React patterns')
  })

  test('id is defined correctly', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body[0].id).toBeDefined()
  })

  test('a valid blog can be added ', async () => {
    const newBlog = {
    title: "New title",
    author: "Author",
    url: "http://b.html",
    likes: 22
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set(headers)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd.length).toBe(helper.initialBlogs.length + 1)

    const titles = blogsAtEnd.map(b => b.title)
    expect(titles).toContain(
      'New title'
    )
  })

  test('unvalid blog can not be added ', async () => {
    const newBlog = {
      title: "Blogi2",
      author: "esim2",
      url: "http://www.esimblogi2.com",
      likes: 8
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)

    const response = await helper.blogsInDb()

    expect(response).toHaveLength(helper.initialBlogs.length)
  })


  test('blog without likes has 0 likes', async () => {
    const newBlog = {
      title: "New title",
      author: "Author",
      url: "http://a.html",
    }

    await api
      .post('/api/blogs')
      .send(newBlog)

    const response = await api.get('/api/blogs')

    expect(response.body[response.body.length-1].likes===0)
  })

  test('blog without title and url is not added', async () => {
    const newBlog = {
      author: "Test"
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)

    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })
})

describe('when blog is saved to database', () => {
  let result
  beforeEach(async () => {
    const newBlog = {
      title: 'Great developer experience',
      author: 'Hector Ramos',
      url: 'https://jestjs.io/blog/2017/01/30/a-great-developer-experience',
      likes: 7
    }

    result = await api
      .post('/api/blogs')
      .send(newBlog)
      .set(headers)
  })

  test('it can be removed', async () => {
    const aBlog = result.body

    const initialBlogs = await helper.blogsInDb()
    await api
      .delete(`/api/blogs/${aBlog.id}`)
      .set(headers)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd.length).toBe(initialBlogs.length - 1)

    const titles = blogsAtEnd.map(b => b.title)
    expect(titles).not.toContain(
      aBlog.title
    )
  })
})

afterAll(() => {
  mongoose.connection.close()
})