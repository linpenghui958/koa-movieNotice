const { readFile } = require('fs')

let time1 = new Date().getTime()

readFile('../img.png', 'utf-8', data => {
  console.log('完成文件 1 读操作的回调')
  let time2 = new Date().getTime()
  let totalTime = time2 - time1
  console.log(time1)
  console.log(time2)
  console.log(`总共耗时${totalTime}`)
})