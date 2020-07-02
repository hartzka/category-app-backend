const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
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

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  .populate('image', { imageName: 1, imageData: 1, multerImage: 1 })
  .populate('user', { username: 1, name: 1 })
  response.json(blogs.map(blog => blog.toJSON()))
})

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  .populate('image', { imageName: 1, imageData: 1, multerImage: 1 })
  .populate('user', { username: 1, name: 1 })
  if (blog) {
    response.json(blog.toJSON())
  } else {
    response.status(404).end()
  }
})

blogsRouter.post('/', async (request, response, next) => {
  const body = request.body
  console.log(request.body.image)
  
  const token = getTokenFrom(request)

  const decodedToken = jwt.verify(token, process.env.SECRET)
  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const user = await User.findById(decodedToken.id)
  console.log('userid');
  console.log(request.body.image.id); 
  const image = await Image.findById(request.body.image.id)

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes === undefined ? 0 : body.likes,
    user: user._id,
    image: image._id
  })

  if (!blog.url || !blog.title) {
    return response.status(400).send({ error: 'title or url missing' })
  }

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  image.blog = savedBlog._id
  await user.save()
  await image.save()
  console.log(user)
  console.log(image)
  const blogToBeReturned = await Blog.findById(savedBlog.id)
  .populate('image', { imageName: 1, imageData: 1, multerImage: 1 })
  .populate('user', { username: 1, name: 1 })
  response.json(blogToBeReturned.toJSON())
})

blogsRouter.delete('/:id', async (request, response, next) => {
  const id = request.params.id
  const token = getTokenFrom(request)

  const decodedToken = jwt.verify(token, process.env.SECRET)

  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

    try {
        const blog = await Blog.findById(id)

        if (blog.user.toString() === decodedToken.id) {
            await Blog.findByIdAndRemove(blog.id)
            response.status(204).end()
        } else {
            response.status(401).json({ error: 'not authorized' })
        }

    } catch (error) {
        next(error)
    }
})

blogsRouter.put('/:id', async (request, response, next) => {
  const body = request.body

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  }

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
    .populate('image', { imageName: 1, imageData: 1, multerImage: 1 })
    .populate('user', { username: 1, name: 1 })
  console.log(updatedBlog);
  response.json(updatedBlog.toJSON())
})

module.exports = blogsRouter