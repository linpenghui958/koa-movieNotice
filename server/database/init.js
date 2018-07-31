const mongoose = require('mongoose')
const dbUrl = 'mongodb://localhost/douban-movie'
const glob = require('glob')
const { resolve } = require('path')
mongoose.Promise = global.Promise 

exports.initSchemas = () => {
  glob.sync(resolve(__dirname, './schema', '**/*.js')).forEach(require)
}

exports.initAdmin = async () => {
  const User = mongoose.model('User')

  let user = await User.findOne({
    username: 'linph'
  })

  if (!user) {
    const user = new User({
      username: 'linph',
      email: '370345882@qq.com',
      password: '123abc',
      role: 'admin'
    })

    await user.save()
  }

}

exports.connect = () => {
  return new Promise((resolve, reject) => {

    let maxConnectTimes = 0

    if (process.env.NODE_ENV !== 'production') {
      mongoose.set('debug', true)
    }

    mongoose.connect(dbUrl)

    const db = mongoose.connection

    db.on('error', (err) => {
      maxConnectTimes++
      if (maxConnectTimes < 5) {
        mongoose.connect(dbUrl)
      } else {
        throw new Error('你的数据库好像挂了啊！')
      }
    })

    db.once('open', () => {
      resolve()
      console.log('数据库连接成功！')
    })

    db.on('disconnected', () => {
      maxConnectTimes++
      if (maxConnectTimes < 5) {
        mongoose.connect(dbUrl)
      } else {
        throw new Error('你的数据库好像挂了啊！')
      }
    })

  })
}