// const movieData = [
//   { poster: 'https://img3.doubanio.com/view/photo/l_ratio_poster/public/p2526297221.jpg',
//     id: 26366496,
//     name: '邪不压正',
//     video: 'http://vt1.doubanio.com/201807131543/797235af0449e2e79427591d1304180d/view/movie/M/402330091.mp4',
//     link: 'https://movie.douban.com/trailer/233091/#content',
//     cover: 'https://img3.doubanio.com/img/trailer/medium/2526489612.jpg?1530244322',
//     average: 7.7 
//   }
// ]


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





