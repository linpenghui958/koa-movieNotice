// const co = require('co')
// const fetch = require('node-fetch')

// co(function *() {
//   const res = yield fetch('https://api.douban.com/v2/movie/1291843')
//   const movie = yield res.json()
//   const summary = movie.summary

//   console.log('summary', summary)
// })

const luke = {
  id: 2,
  say: function () {
    setTimeout(function () {
      console.log('id', this.id) // undefined
    }, 50)
  },
  sayWithThis: function () {
    var _this = this
    setTimeout(function () {
      console.log('this id', _this.id)  // 2
    }, 500)
  },
  sayWithArrow: function () {
    setTimeout(() => {
      console.log('arrow id', this.id)   //  2
    }, 900)
  },
  sayWithGlobalArrow: () => {
    setTimeout(() => {
      console.log('global id', this.id)   // undefined
    }, 1200)
  }
}

luke.say()  // undefined
luke.sayWithThis()   //  2
luke.sayWithArrow()   // 2
luke.sayWithGlobalArrow()  // undefined