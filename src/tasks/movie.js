const cp = require('child_process')
const { resolve } = require('path')

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
  console.log(data.result)
})