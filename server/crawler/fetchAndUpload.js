const puppeteer = require('puppeteer')
const mongoose = require('mongoose')
const requet = require('request-promise-native')


const movieListUrl = 'https://movie.douban.com/tag/#/?sort=R&range=6,10&tags='
const videoBaseUrl = 'https://movie.douban.com/subject/'
const doubanBaseUrl = 'http://api.douban.com/v2/movie/'

const { connect, initSchemas } = require('../database/init')

const sleep = time => new Promise((resolve, reject) => {
  setTimeout(resolve, time)
})

// 初始化上传七牛方法
const qiniuConfig = require('../config')

const qiniu = require('qiniu')

const nanoid = require('nanoid')

const mac = new qiniu.auth.digest.Mac(qiniuConfig.qiniu.accessKey, qiniuConfig.qiniu.secretKey)

const bucket = qiniuConfig.qiniu.bucket

let config = new qiniu.conf.Config()
config.zone = qiniu.zone.Zone_z0

const bucketManager = new qiniu.rs.BucketManager(mac, config)

/**
 * 抓取资源并上传到七牛云
 * @param {抓取资源的地址}} url 
 * @param {保存在服务器的名称} key 
 */
const fetchAndUploadToQiniu = async (url, key) => {
  return new Promise((resolve, reject) => {
    // 抓紧网络资源到空间
    bucketManager.fetch(url, bucket, key, (err, respBody, respInfo) => {
      if (err) {
        reject(err)
      } else {
        if (respInfo.statusCode == 200) {
          resolve({key})
        } else {
          reject(respInfo)
        }
      }
    })
  })
}

/**
 * 从豆瓣api丰富本地数据
 * @param {电影对象} item 
 */
async function fetchMovieData (item) {
  const res = await requet(doubanBaseUrl + item.doubanId)
  let body

  try {
    body = JSON.parse(res)
  } catch (e) {
    console.log(e)
  }
  return body
}

;(async() => {
  await connect()
  await initSchemas()
  console.log('Start crawle Movie List...')
  const Movie = mongoose.model('Movie')
  const Category = mongoose.model('Category')

  const browser = await puppeteer.launch({
    args: ['--no-sandbox'],
    dumpio: false
  })

  const page = await browser.newPage()
  // await page.goto(movieListUrl, {
  //   waitUntil: 'networkidle2'
  // })

  // await page.waitForSelector('.more')

  // for(let i = 0; i < 2; i++) {
  //   await sleep(3000)
  //   await page.click('.more')
  // }

  // // 爬取页面数据
  // const result = await page.evaluate(() => {
  //   var $ = window.$
  //   var items = $('.list-wp a')
  //   var links = []

  //   if (items.length >= 1) {
  //     items.each((index, item) => {
  //       let it = $(item)
  //       let doubanId = it.find('div').data('id')
  //       let title = it.find('.title').text()
  //       let rate = it.find('.rate').text()
  //       let poster = it.find('img').attr('src').replace('s_ratio', 'l_ratio')

  //       links.push({
  //         doubanId,
  //         rate,
  //         title,
  //         poster
  //       })
  //     })
  //   }
  //   return links
  // })

  // console.log(`爬取到的movieList长度为${result.length}`)

  // // 数据库不存在，则新建并保存
  // await result.forEach(async item => {
  //   let movie = await Movie.findOne({
  //     doubanId: item.doubanId
  //   })
  //   if (!movie) {
  //     let movieItem = new Movie(item)
  //     await movieItem.save()
  //   }
  // })

  //从数据库中获取movieList
  let movieDataList = await Movie.find({
    $or: [
      { video: { $exists: false} }
    ]
  }).sort({meta: -1}).limit(100)

  console.log(`需要爬取video的数据长度为${movieDataList.length}`)

  let fetchMovieDataList = []

  for ( let i = 0; i < movieDataList.length; i++) {
    let movie = movieDataList[i]
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
      movie.image = result.coverImg
      console.log(`保存${movie.title}数据`)
      await movie.save()
    }

    // 上传对应数据至qiniu
    console.log(`fetch upload NO. ${i} movie resource`)
    try {
      console.log('start upload doubanId' + movie.doubanId + 'resource')
      let videoData = await fetchAndUploadToQiniu(movie.video, nanoid() + '.mp4')
      let coverData = await fetchAndUploadToQiniu(movie.image, nanoid() + '.png')
      let posterData = await fetchAndUploadToQiniu(movie.poster, nanoid() + '.png')
    
      if (videoData.key)
      videoData.key && (movie.videoKey = videoData.key)
      coverData.key && (movie.coverKey = coverData.key)
      posterData.key && (movie.posterKey = posterData.key)

      console.log(`上传七牛并保存${movie.doubanid}-${movie.title}   resource`)
      await movie.save()
    } catch (e) {
      console.log(e)
    }

    //从豆瓣api完善电影数据
    
    // 获取需要完善的电影列表
    // let movies = await Movie.find({
    //   $or: [
    //     { summary: { $exists: false } },
    //     { summary: null },
    //     { year: { $exists: false } },
    //     { title: '' },
    //     { summary: '' }
    //   ]
    // })

    // for (let i = 0; i < 70; i++) {
    //   // for (let i = 0; i < 1; i++) {
    //     await sleep(5000)
    //     let movie = movies[i]
    //     let movieData = await fetchMovieData(movie)
    
    //     if (movieData) {
    //       let tags = movieData.tags || []
    
    //       movie.tags = movie.tags || []
    //       movie.summary = movieData.summary || ''
    //       movie.title = movieData.alt_title || movieData.title || ''
    //       movie.rawTitle = movieData.title || ''
    
    //       if (movieData.attrs) {
    //         movie.movieTypes = movieData.attrs.movie_type || []
    //         movie.year = movieData.attrs.year[0] || 2500
    
    //         for (let i = 0; i < movie.movieTypes.length; i++) {
    //           let item = movie.movieTypes[i]
    //           let cat = await Category.findOne({
    //             name: item
    //           })
    
    //           if (!cat) {
    //             cat = new Category({
    //               name: item,
    //               movies: [movie._id]
    //             })
    //           } else {
    //             if (cat.movies.indexOf(movie._id) === -1) {
    //               cat.movies.push(movie._id)
    //             }
    //           }
    
    //           await cat.save()
    
    //           if (!movie.category) {
    //             movie.category.push(cat._id)
    //           } else {
    //             if (movie.category.indexOf(cat._id) === -1) {
    //               movie.category.push(cat._id)
    //             }
    //           }
    //         }
    
    //         let dates = movieData.attrs.pubdate || []
    //         let pubdates = []
    //         dates.map(item => {
    //           if (item && item.split('(').length > 0) {
    //             let parts = item.split('(')
    //             let date = parts[0]
    //             let country = '未知'
    
    //             if (parts[1]) {
    //               country = parts[1].split(')')[0]            
    //             }
    
    //             pubdates.push({
    //               date: new Date(date),
    //               country
    //             })
    
    //           }
    //           movie.pubdate = pubdates
    //         })
    
    //         tags.forEach(tag => {
    //           movie.tags.push(tag.name)
    //         })
    
    //         await movie.save()
    //       }
    //     }
    //   }






  }

  await browser.close()
  console.log('trailer end')

})()