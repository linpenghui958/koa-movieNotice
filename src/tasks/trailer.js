const cp = require('child_process')
const { resolve } = require('path')
const url = resolve(__dirname, '../crawler/video.js')

const child = cp.fork(url, [])
let invoked = false

child.on('err', err => {
  if (invoked) return

  invoked = true
  console.log(err)
})

child.on('exit', code => {
  if (invoked) return

  invoked = true

  const message = code === 0 ? null : new Error(`exit code${code}`)

  console.log('结束任务' + message)
})

child.on('message', data => {
  console.log(data)
})