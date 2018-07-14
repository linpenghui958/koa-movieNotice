const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const { resolve } = require('path')
const { connect } = require('./database/init')

;(async () => {
  connect()
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