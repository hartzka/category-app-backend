const _ = require('lodash')
const User = require('../models/user')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  let total = blogs.reduce(function(sum, blog) {
      return sum+blog.likes
  }, 0)
  return total
}

const favoriteBlog = (blogs) => {
  if (blogs.length===0) {
      return {}
  }

  maxLikes = blogs.reduce(function (blog, m) {
    return ( blog.likes > m.likes ? blog : m );
  });

  return {
      title: maxLikes.title,
      author: maxLikes.author,
      likes: maxLikes.likes,
    }
}

const mostBlogs = (blogs) => {
    return _(blogs)
    .groupBy('author')
    .map((b, author) => ({ author, blogs: b.length }))
    .maxBy('blogs')
}

const mostLikes = (blogs) => {
    return _(blogs)
    .groupBy('author')
    .map((blogs, author) => {
        const likes = blogs.reduce(function(sum, blog) {
            return sum+blog.likes
        }, 0)
        return ({ author, likes })
    })
    .maxBy('likes')
}

module.exports = {
  dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes
}