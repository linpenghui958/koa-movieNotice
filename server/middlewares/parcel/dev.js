const Bundler = require('parcel-bundler')
const views = require('koa-views')
const serve = require('koa-static')
const { resolve } = require('path')

const r = path => resolve(__dirname, path)

const bunlder = new Bundler(r('../../../src/index.html'), {
  publicUrl: '/',
  watch: true
})

export const dev = async app => {
  await bunlder.bundle()

  app.use(serve(r('../../../dist')))

  app.use(views(r('../../../dist')), {
    extension: 'html'
  })

  app.use(async (ctx) => {
    await ctx.render('index.html')
  })
}