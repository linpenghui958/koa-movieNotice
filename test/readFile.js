// const { readFile } = require('fs')

// let time1 = new Date().getTime()

// readFile('../img.png', 'utf-8', data => {
//   console.log('完成文件 1 读操作的回调')
//   let time2 = new Date().getTime()
//   let totalTime = time2 - time1
//   console.log(time1)
//   console.log(time2)
//   console.log(`总共耗时${totalTime}`)
// })

// console.log(1)

// setTimeout(() => {
//     console.log(2)
//     new Promise(resolve => {
//         console.log(4)
//         resolve()
//     }).then(() => {
//         console.log(5)
//     })
// })

// new Promise(resolve => {
//     console.log(7)
//     resolve()
// }).then(() => {
//     console.log(8)
// })

// setTimeout(() => {
//     console.log(9)
//     new Promise(resolve => {
//         console.log(11)
//         resolve()
//     }).then(() => {
//         console.log(12)
//     })
// })


// console.log(1)

// setTimeout(() => {
//     console.log(2)
//     new Promise(resolve => {
//         console.log(4)
//         resolve()
//     }).then(() => {
//         console.log(5)
//     })
//     process.nextTick(() => {
//         console.log(3)
//     })
// })

// new Promise(resolve => {
//     console.log(7)
//     resolve()
// }).then(() => {
//     console.log(8)
// })

// process.nextTick(() => {
//     console.log(6)
// })

console.log('golb');

setTimeout(function() {
    console.log('timeout');
    process.nextTick(function() {
        console.log('timeout_nextTick');
    })
    new Promise(function(resolve) {
        console.log('timeout_promise');
        resolve();
    }).then(function() {
        console.log('timeout_then')
    })
})

setImmediate(function() {
    console.log('immediate');
    process.nextTick(function() {
        console.log('immediate_nextTick');
    })
    new Promise(function(resolve) {
        console.log('immediate_promise');
        resolve();
    }).then(function() {
        console.log('immediate_then')
    })
})

process.nextTick(function() {
    console.log('glob_nextTick');
})
new Promise(function(resolve) {
    console.log('glob_promise');
    resolve();
}).then(function() {
    console.log('glob_then')
})