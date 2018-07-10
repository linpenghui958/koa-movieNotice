const fs = require('fs')
const util = require('util')

// fs.readFile('./package.json', (err, data) => {
//   if (err) console.log(err)
//   data = JSON.parse(data)
//   console.log(data.name)
// })

// function readFile(path) {
//   return new Promise((resolve, reject) => {
//     fs.readFile(path, (err, data) => {
//       if (err) console.log(err)
//       resolve(JSON.parse(data))
//     })
//   })
// }
// readFile('./package.json')
//   .then(data => console.log(data.name))

// util.promisify(fs.readFile)('./package.json')
//   .then(JSON.parse)
//   .then(data => console.log(data.name))
//   .catch(err => console.log(err))

// const readFileAsync = util.promisify(fs.readFile)

// async function init () {
//   try {
//     let data = await readFileAsync('./package.json')
//     data = JSON.parse(data)
//     console.log(data.name)
//   } catch (err) {
//     console.log(err)
//   }
// }
// init()

// function makeIterator(arr) {
//   let nextIndex = 0
//   return {
//     next () {
//       if (nextIndex < arr.length) {
//         return { value: arr[nextIndex++], done: false}
//       } else {
//         return { value: undefined, done: true}
//       }
//     }
//   }
// }

function *makeIterator (arr) {
  for (let i = 0; i < arr.length; i++) {
    yield arr[i]
  }
}

const gen = makeIterator(['吃饭', '睡觉', '打豆豆'])

console.log('first', gen.next())
console.log('second', gen.next())
console.log('third', gen.next())
console.log('fouth', gen.next())