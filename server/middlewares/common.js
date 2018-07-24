import bodyParser from 'koa-bodyparser'
import logger from 'koa-logger'


export const addLogger = app => {
  app.use(logger())
}

export const addBodyParser = app => {
  app.use(bodyParser())
}