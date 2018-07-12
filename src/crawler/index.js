const puppeteer = require('puppeteer')

const url = 'https://movie.douban.com/tag/#/?sort=R&range=6,10&tags='

const sleep = time => new Promise((resolve, reject) => {
  setTimeout(resolve, time)
})

;(async () => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()

  await page.goto(url, {
    waitUntil: 'networkidle2'
  })

  const result = await page.evaluate(() => {
    var $ = window.$
    const res = $('.list-wp a').eq(0).find('img').attr('src')
    return Promise.resolve(res)
  })

  browser.close()
  console.log(result)
})()