const puppeteer = require('puppeteer')
const mongoose = require('mongoose')


const movieListUrl = 'https://movie.douban.com/tag/#/?sort=R&range=6,10&tags='
const videoBaseUrl = 'https://movie.douban.com/subject/'

const { connect, initSchemas } = require('../database/init')

const sleep = time => new Promise((resolve, reject) => {
  setTimeout(resolve, time)
})

;(async() => {
  await connect()
  await initSchemas()
  console.log('Start crawle Movie List...')
  const Movie = mongoose.model('Movie')
  const browser = await puppeteer.launch({
    args: ['--no-sandbox'],
    dumpio: false
  })

  const page = await browser.newPage()
  await page.goto(movieListUrl, {
    waitUntil: 'networkidle2'
  })

  await page.waitForSelector('.more')

  for(let i = 0; i < 1; i++) {
    await sleep(3000)
    await page.click('.more')
  }

  // 爬取页面数据
  const result = await page.evaluate(() => {
    var $ = window.$
    var items = $('.list-wp a')
    var links = []

    if (items.length >= 1) {
      items.each((index, item) => {
        let it = $(item)
        let doubanId = it.find('div').data('id')
        let title = it.find('.title').text()
        let rate = it.find('.rate').text()
        let poster = it.find('img').attr('src').replace('s_ratio', 'l_ratio')

        links.push({
          doubanId,
          rate,
          title,
          poster
        })
      })
    }
    return links
  })

  // 数据库不存在，则新建并保存
  await result.forEach(async item => {
    let movie = await Movie.findOne({
      doubanId: movie.doubanId
    })
    if (!movie) {
      let movieItem = new Movie(item)
      await movieItem.save()
    }
  })

  //从数据库中获取movieList
  let movieDataList = await Movie.find({
    $or: [
      { video: { $exists: false} }
    ]
  })

  console.log(`需要爬取video的数据长度为${movieData.length}`)

  let fetchMovieDataList = []

  for ( let i = 0; i < movieDataList.length; i++) {
    let movie = movieData[i]
    const doubanId = movie.doubanId
    console.log(`Start trailer NO.${i} doubanId${doubanId}-${movie.title} video source`)

    await page.goto(videoBaseUrl + doubanId, {
      waitUntil: 'networkidle2'
    })

    await sleep(1000)

    const result = await page.evaluate(() => {
      const $ = window.$
      const $video = $('.related-pic-video')
      if ($video && $video.length > 0) {
        var link = $video.attr('href')
        var coverImg = $video.css('background-image').match(/(?<=").*(?=")/)[0]
      }
      return {link, coverImg}
    })
    let video
    if (result.link) {
      await page.goto(result.link, {
        waitUntil: 'networkidle2'
      })
      video = await page.evaluate(() => {
        const $ = window.$
        const $source = $('source')
        if ($source && $source.length > 0) {
          return $source.attr('src')
        }
      })
    }
    if (video) {
      movie.video = video
      movie.link = result.link
      movie.image = result.image
      console.log(`保存${movie.title}数据`)
      await movie.save()
    }


  }

  await brower.close()
  console.log('trailer end')

})()