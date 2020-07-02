const listHelper = require('../utils/list_helper')
const helper = require('./test_helper')

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
})

const listWithOneBlog = [
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0
  }
]

describe('total likes', () => {

  test('when list has only one blog equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    expect(result).toBe(5)
  })

  test('likes of a bigger list is calculated right', () => {
    const result = listHelper.totalLikes(helper.initialBlogs)
    expect(result).toBe(36)
  })

  test('likes of empty list is zero', () => {
    const result = listHelper.totalLikes([])
    expect(result).toBe(0)
  })
})

describe('favorite blog', () => {

  test('when list has only one blog equals that', () => {
    const result = listHelper.favoriteBlog(listWithOneBlog)
    expect(result).toEqual({
      author: "Edsger W. Dijkstra", 
      likes: 5,
      title: "Go To Statement Considered Harmful"
    })
  })

  test('returns the blog with max likes', () => {
    const result = listHelper.favoriteBlog(helper.initialBlogs)
    expect(result).toEqual({
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      likes: 12
    })
  })

  test('returns empty object of empty list', () => {
    const result = listHelper.favoriteBlog([])
    expect(result).toEqual({})
  })
})

describe('most likes', () => {
  test('mostLikes returns the correct result', () => {
    const result = listHelper.mostLikes(helper.initialBlogs);
    expect(result).toEqual({
        author: "Edsger W. Dijkstra",
        likes: 17
    });
  })
})

describe('most blogs', () => {
  test('mostBlogs returns the correct result', () => {
    const result = listHelper.mostBlogs(helper.initialBlogs);
    expect(result).toEqual({
        author: "Robert C. Martin",
        blogs: 3
    });
  })
})