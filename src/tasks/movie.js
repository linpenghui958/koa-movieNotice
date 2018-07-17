const cp = require('child_process')
const { resolve } = require('path')
const mongoose = require('mongoose')
const Movie = mongoose.model('Movie')

const child = cp.fork(resolve(__dirname, '../crawler/trailer-list.js'), [])

let invoked = false
child.on('err', err => {
  if (invoked) return
  invoked = true
  console.log(err)
})

child.on('exit', code => {
  if (invoked) return
  
  invoked = false

  const message = code === 0 ? null : new Error(`进程退出码：${code}`)
  console.log(message)
})

child.on('message', (data) => {

  const result = data.result
  console.log(result)
  result.forEach(async item => {
    let movie = await Movie.findOne({
      doubanId: item.doubanId
    })

    if (!movie) {
      let movieItem = new Movie(item)
      await movieItem.save()
    }
  })
})