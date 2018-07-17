const baseUrl = 'https://movie.douban.com/subject/'
const doubanId = '26366496'

const puppeteer = require('puppeteer')

const sleep = time => new Promise(resolve => {
  setTimeout(resolve, time)
})

;(async () => {
  console.log('Start trailer video source')

  const brower = await puppeteer.launch({
    args: ['--no-sanbox'],
    dumpio: false
  })
  const page = await brower.newPage()

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
    image: result.image,
    doubanId
  }
  await brower.close()
  console.log('trailer end')
  process.send(data)
  process.exit(0)

})()