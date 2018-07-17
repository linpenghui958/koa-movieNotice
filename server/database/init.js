const mongoose = require('mongoose')
const dbUrl = 'mongodb://localhost/douban-movie'
const glob = require('glob')
const { resolve } = require('path')
mongoose.Promise = global.Promise 

exports.initSchemas = () => {
  glob.sync(resolve(__dirname, './schema', '**/*.js')).forEach(require)
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
      const Dog = mongoose.model('Dog', {name: String})
      const doga = new Dog({name: 'chungua'})

      doga.save().then(() => {
        console.log('save success')
      })
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