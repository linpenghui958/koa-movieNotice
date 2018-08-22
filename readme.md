### koa-movieNotice

> 基于koa2的电影预告网站
> 从豆瓣爬取数据

## Build Setup

##### [Online Preview](http://movie.linph.cc)

##### 预览效果

![](https://i.imgur.com/9QcR5NF.jpg)

##### 点击播放

![](https://i.imgur.com/NkbAf5x.png)

##### crawler部分

- 从豆瓣列表页获取基本数据




	  // 使用puppeteer进行数据爬取
	  const puppeteer = require('puppeteer')
	  // 豆瓣电影列表页
	  const url = `https://movie.douban.com/tag/#/?sort=R&range=6,10&tags=`
	
	  const sleep = time => new Promise(resolve => {
	    setTimeout(resolve, time)
	  })
	
	  ;(async () => {
	    console.log('Start visit the target page')
	    // 初始化puppeteer
	   const browser = await puppeteer.launch({
	     args: ['--no-sandbox'],
	     dumpio: false
	   })
	
	  const page = await browser.newPage()
	  await page.goto(url, {
	    waitUntil: 'networkidle2'
	  })
	
	  await sleep(3000)
	  // 点击加载更多	
	  await page.waitForSelector('.more')
	
	  for (let i = 0; i < 1; i++) {
	    await sleep(3000)
	    await page.click('.more')
	  }
	  // 爬取页面中的数据
	  const result = await page.evaluate(() => {
	    var $ = window.$
	    var items = $('.list-wp a')
	    var links = []
	
	    if (items.length >= 1) {
	      items.each((index, item) => {
	        let it = $(item)
	        let doubanId = it.find('div').data('id')
	        let title = it.find('.title').text()
	        let rate = Number(it.find('.rate').text())
	        let poster = it.find('img').attr('src').replace('s_ratio', 'l_ratio')
	
	        links.push({
	          doubanId,
	          title,
	          rate,
	          poster
	        })
	      })
	    }
	
	    return links
	  })
	
	  browser.close()
	
	  console.log(result)
	})()

- 爬取对应电影预告片的地址



	  const baseUrl = 'https://movie.douban.com/subject/'

	  const puppeteer = require('puppeteer')
	  const mongoose = require('mongoose')
	  const Movie = mongoose.model('Movie')
	
	  const sleep = time => new Promise(resolve => {
	    setTimeout(resolve, time)
	  })
	
	  ;(async () => {
	    console.log('从数据库获取需要爬取的datalist')
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
	  	// 抓取预告片页面的数据
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

- 完善电影数据


	
	  const requet = require('request-promise-native')
	  const mongoose = require('mongoose')
	  const Movie = mongoose.model('Movie')
	  const Category = mongoose.model('Category')
	  const baseUrl = 'http://api.douban.com/v2/movie/'

	  const sleep = time => new Promise((resolve, reject) => {
	    setTimeout(resolve, time)
	  })
 
	  async function fetchMovieData (item) {
            const res = await requet(baseUrl + item.doubanId)
	    let body

	   try {
	     body = JSON.parse(res)
	   } catch (e) {
	     console.log(e)
	   }
	     return body
	   }
 
	  ;(async () => {
	    let movies = await Movie.find({
	      $or: [
	        { summary: { $exists: false } },
	        { summary: null },
	        { year: { $exists: false } },
	        { title: '' },
	        { summary: '' }
	      ]
	  })
	
	  console.log(movies.length)
	
	  for (let i = 0; i < 70; i++) {
	  // for (let i = 0; i < 1; i++) {
	    await sleep(1000)
	    let movie = movies[i]
	    let movieData = await fetchMovieData(movie)
	
	    if (movieData) {
	      let tags = movieData.tags || []
	
	      movie.tags = movie.tags || []
	      movie.summary = movieData.summary || ''
	      movie.title = movieData.alt_title || movieData.title || ''
	      movie.rawTitle = movieData.title || ''
	
	      if (movieData.attrs) {
	        movie.movieTypes = movieData.attrs.movie_type || []
	        movie.year = movieData.attrs.year[0] || 2500
	
	        for (let i = 0; i < movie.movieTypes.length; i++) {
	          let item = movie.movieTypes[i]
	          let cat = await Category.findOne({
	            name: item
	          })
	
	          if (!cat) {
	            cat = new Category({
	              name: item,
	              movies: [movie._id]
	            })
	          } else {
	            if (cat.movies.indexOf(movie._id) === -1) {
	              cat.movies.push(movie._id)
	            }
	          }
	
	          await cat.save()
	
	          if (!movie.category) {
	            movie.category.push(cat._id)
	          } else {
	            if (movie.category.indexOf(cat._id) === -1) {
	              movie.category.push(cat._id)
	            }
	          }
	        }
	
	        let dates = movieData.attrs.pubdate || []
	        let pubdates = []
	        dates.map(item => {
	          if (item && item.split('(').length > 0) {
	            let parts = item.split('(')
	            let date = parts[0]
	            let country = '未知'
	
	            if (parts[1]) {
	              country = parts[1].split(')')[0]            
	            }
	
	            pubdates.push({
	              date: new Date(date),
	              country
	            })
	
	          }
	          movie.pubdate = pubdates
	        })
	
	        tags.forEach(tag => {
	          movie.tags.push(tag.name)
	        })
	
	        await movie.save()
	      }
	    }
	  }
	
	  console.log('爬取api结束')
	
   	})()


- 将网络数据上传到七牛云

	
		const sleep = time => new Promise(resolve => {
		  setTimeout(resolve, time)
		})
		
		const mongoose = require('mongoose')
		const Movie = mongoose.model('Movie')
		
		const qiniuConfig = require('../config')
		
		const qiniu = require('qiniu')
		// 获取随机数
		const nanoid = require('nanoid')
		
		const mac = new qiniu.auth.digest.Mac(qiniuConfig.qiniu.accessKey, qiniuConfig.qiniu.secretKey)
		
		const options = {
		  scope: qiniuConfig.qiniu.bucket
		}
		const bucket = qiniuConfig.qiniu.bucket
		
		// 配置上传config, zone为上传空间（Zone_z0对应华东）
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
		
		// 测试上传
		;(async () => {
		  // 拿到需要补充数据的movieList
		  const movieData = await Movie.find({
		    $or: [
		      { 
		        videoKey: { $exists: false },
		        video: { $exists: true }
		      }
		    ]
		  })
	  
	  console.log('需要爬取的movieList长度为' + movieData.length)
	
	  for (let i = 0; i < movieData.length; i++) {
	    let item = movieData[i]
	    console.log(`fetch upload NO. ${i} movie resource`)
	    await sleep(3000)
	    // 如果没有key数据，则fetch并且upload
	    if (item.video && !item.key) {
	      try {
	        console.log('start upload doubanId' + item.doubanId + 'resource')
	        let videoData = await fetchAndUploadToQiniu(item.video, nanoid() + '.mp4')
	        let coverData = await fetchAndUploadToQiniu(item.image, nanoid() + '.png')
	        let posterData = await fetchAndUploadToQiniu(item.poster, nanoid() + '.png')
	      
	        if (videoData.key)
	        videoData.key && (item.videoKey = videoData.key)
	        coverData.key && (item.coverKey = coverData.key)
	        posterData.key && (item.posterKey = posterData.key)
	
	        console.log(item)
	        await item.save()
	      } catch (e) {
	        console.log(e)
	      }
	      
	    }
	  }
	
	  console.log('fetch upload end')
	
	
	  })()


``` bash
# install dependencies
$ npm install # Or yarn install*[see note below]

# serve with hot reload at localhost:2333
$ npm start

# build for production
$ npm run build
