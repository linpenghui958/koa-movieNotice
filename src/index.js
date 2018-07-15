const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const mongoose = require('mongoose')
const { resolve } = require('path')
const { connect, initSchemas } = require('./database/init')

;(async () => {
  await connect()
  
  initSchemas()
  const Movie = mongoose.model('Movie')
  const movie = await Movie.find({})
  console.log(movie)
})()

app.use(views(resolve(__dirname, './views'), {
  extension: 'pug'
}))


app.use(async (ctx, next) => {
  await ctx.render('index', {
    me: 'Luke',
    you: 'linph'
  })
})

app.listen(2333)