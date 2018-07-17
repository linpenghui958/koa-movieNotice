const Router = require('koa-router')
const router = new Router()
const mongoose = require('mongoose')

router.get('/movies/all', async (ctx, next) => {
  const Movie = mongoose.model('Movie')
  const movies = await Movie.find({}).sort({ 'meta.creatdAt': -1}).limit(100)
  console.log(movies.length)
  ctx.body = {
    movies
  }
})

router.get('/movies/detail/:id', async (ctx, next) => {
  const Movie = mongoose.model('Movie')
  const id = ctx.params.id
  const movie = await Movie.findOne({ _id: id})
  ctx.body = {
    movie
  }
})

module.exports = router