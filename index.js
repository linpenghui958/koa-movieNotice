const koa = require('koa')
const app = new koa()

app.use(async (ctx, next) => {
  ctx.body = 'hi linph'
})

app.listen(2333)