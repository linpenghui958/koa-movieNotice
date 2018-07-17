const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const mongoose = require('mongoose')
const { resolve } = require('path')
const { connect, initSchemas } = require('./database/init')

;(async () => {
  await connect()
  
  await initSchemas()

  // require('./tasks/movie')
  // require('./tasks/api')
  require('./tasks/qiniu')
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