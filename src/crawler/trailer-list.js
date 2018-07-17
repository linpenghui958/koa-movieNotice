const puppeteer = require('puppeteer')

const url = 'https://movie.douban.com/tag/#/?sort=R&range=6,10&tags='

const sleep = time => new Promise((resolve, reject) => {
  setTimeout(resolve, time)
})

;(async () => {
  console.log('Start puppeteer')
  const brower = await puppeteer.launch({
    args: ['--no-sanbox'],
    dumpio: false
  })
  const page = await brower.newPage()

  await page.goto(url, {
    waitUntil: 'networkidle2'
  })
  await sleep(3000)


  await page.waitForSelector('.more')

  for (let i = 0; i < 70; i++) {
    await sleep(3000)
    await page.click('.more')
    console.log('click more')
  }
  

  const result = await page.evaluate(() => {

    const $ = window.$
    const $content = $('.list-wp a')
    console.log($content)
    let links = []
    
    if ($content.length > 1) {
      $content.each((index, item) => {
        const it = $(item)
        const poster = it.find('img').attr('src').replace('s_ratio', 'l_ratio')
        // const poster = it.find('img').attr('src')
        const doubanId = it.find('.cover-wp').data('id')
        const title = it.find('img').attr('alt')
        const average = Number(it.find('.rate').text())
  
        links.push({
          poster,
          doubanId,
          title,
          average
        })
      })
    }

    return links
    
  })


  await brower.close()
  console.log('Visit end')
  process.send({result})
  process.exit(0)

})()