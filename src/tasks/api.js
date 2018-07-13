const requet = require('request-promise-native')
const baseUrl = 'http://api.douban.com/v2/movie/subject/'

async function fetchMovieData (item) {
  const res = await requet(baseUrl + item.id)
  return res
}

;(async () => {
  const obj = [
    { poster: 'https://img3.doubanio.com/view/photo/l_ratio_poster/public/p2524762163.jpg',
      id: 30232339,
      name: '你的孩子不是你的孩子',
      average: 8.1 
    },
    { poster: 'https://img3.doubanio.com/view/photo/l_ratio_poster/public/p2526126803.jpg',
      id: 27059183,
      name: '阳光先生',
      average: 7.7 
    },
  ]
  let movieData = []
  await obj.forEach(async item => {
    let res = await fetchMovieData(item)
    try {
      res = JSON.parse(res)
      console.log(res.aka)
      console.log(res.summary)
    } catch (e) {
      console.log(e)
    }
    await movieData.push(res.summary)
  })


})()