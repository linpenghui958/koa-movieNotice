const baseUrl = 'https://movie.douban.com/subject/'
// const doubanId = '26366496'

const puppeteer = require('puppeteer')
const mongoose = require('mongoose')
const Movie = mongoose.model('Movie')

const sleep = time => new Promise(resolve => {
  setTimeout(resolve, time)
})

;(async () => {
  console.log('从服务器获取datalist')
  let movieData = await Movie.find({
    $or: [
      { video: { $exists: false} }
    ]
  })

  console.log(`需要爬取video的数据长度为${movieData.length}`)

  let datas = []

  const brower = await puppeteer.launch({
    args: ['--no-sanbox'],
    dumpio: false
  })
  const page = await brower.newPage()

  for ( let i = 0; i < movieData.length; i++) {
    let movie = movieData[i]
    const doubanId = movie.doubanId
    console.log(`Start trailer NO.${i} doubanId${doubanId} video source`)


    await page.goto(baseUrl + doubanId, {
      waitUntil: 'networkidle2'
    })
  
    sleep(1000)
  
    const result = await page.evaluate(() => {
      const $ = window.$
      const $video = $('.related-pic-video')
      if ($video && $video.length > 0) {
        var link = $video.attr('href')
      var image = $video.css('background-image').match(/(?<=").*(?=")/)[0]
      }
      return {link, image}
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
    const data = {
      video,
      link: result.link,
      image: result.image
    }
    movie.video = video
    movie.link = result.link
    movie.image = result.image

    if (video) {
      console.log(movie)
      console.log(`保存${movie.doubanId}数据`)
      await movie.save()
    }

    console.log(data)
  }

  

  
  await brower.close()
  console.log('trailer end')
  process.exit(0)

})()