const Koa = require('koa')
const MIDDLEWARES = ['router']
const R = require('ramda')
const { resolve } = require('path')
const { connect, initSchemas } = require('./database/init')

const useMiddlewares = (app) => {
  R.map(
    R.compose(
      R.forEachObjIndexed(
        initWith => initWith(app)
      ),
      require,
      name => resolve(__dirname, `./middlewares/${name}`)
    )
  )(MIDDLEWARES)
}

;(async () => {
  await connect()
  
  await initSchemas()
 
  // require('./tasks/movie')
  // require('./tasks/api')
  // require('./tasks/qiniu')  //爬取数据到qiniu
  // require('./crawler/video')  // 爬取video字段数据
  
  const app = new Koa()
  await useMiddlewares(app)
  app.listen(2333)

})()

