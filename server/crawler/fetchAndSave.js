const puppeteer = require('puppeteer')

const listUrl = `https://movie.douban.com/tag/#/?sort=R&range=6,10&tags=`

const sleep = time => new Promise(resolve => {
  setTimeout(resolve, time)
})

;(async () => {
  console.log('Start crawle moive list')

  const browser = await puppeteer.launch({
    args: ['--no-sanbox'],
    dumpio: false
  })

  const page = await browser.newPage()
  await page.goto(listUrl, {
    waitUntil: 'networkidle2'
  })

  await page.waitForSelector('.more')

})