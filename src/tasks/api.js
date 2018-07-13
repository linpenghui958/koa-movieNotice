const requet = require('request-promise-native')
const baseUrl = 'http://api.douban.com/v2/movie/subject/'

async function fetchMovieData (item) {
  const res = await requet(baseUrl + item.id)
  return res
}

;(async () => {
  const obj = [
    { poster: 'https://img3.doubanio.com/view/photo/l_ratio_poster/public/p2526297221.jpg',
      id: 26366496,
      name: '邪不压正',
      average: 7.7 },
    { poster: 'https://img3.doubanio.com/view/photo/l_ratio_poster/public/p2526126781.jpg',
      id: 30232261,
      name: '高岭之花',
      average: 6.7 },
    { poster: 'https://img1.doubanio.com/view/photo/l_ratio_poster/public/p2512658449.jpg',
      id: 27015848,
      name: '魔道祖师',
      average: 8.7 },
    { poster: 'https://img3.doubanio.com/view/photo/l_ratio_poster/public/p2527060460.jpg',
      id: 30264953,
      name: '圆桌讲究派',
      average: 8.7 },
    { poster: 'https://img3.doubanio.com/view/photo/l_ratio_poster/public/p2524596871.jpg',
      id: 30224720,
      name: '绝对零度2018',
      average: 6.4 },
    { poster: 'https://img1.doubanio.com/view/photo/l_ratio_poster/public/p2524119829.jpg',
      id: 26252279,
      name: '利器',
    }
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