import React, { Component } from 'react'
import moment from 'moment'
import {
  Card,
  Row,
  Col,
  Badge,
  Modal,
  Spin,
  Icon
} from 'antd'
import { Link } from 'react-router-dom'

import Movie from './component/Movie'
import 'moment/locale/zh-cn'

const site = 'http://pbsrrj6nm.bkt.clouddn.com/'
const Meta = Card.Meta

moment.locale('zh-cn')

export default class Content extends Component {

  constructor(props) {
    super(props)
    this._showModal = this._showModal.bind(this)
  }
  state = { visible: false }

  _handleClose = (e) => {
    if (this.player && this.player.pause) {
      this.player.pause()
    }
  }

  _handleCancel = (e) => {
    this.setState({
      visible: false
    })
  }

  _jumpToDetail = () => {
    const { url } = this.props

    url && window.open(url)
  }

  _showModal = (movie) => {
    this.setState({
      visible: true
    })

    const video = site + movie.videoKey
    const pic = site + movie.coverKey

    if (!this.player) {
      setTimeout(() => {
        this.player = new DPlayer({
          container: document.getElementsByClassName('videoModal')[0],
          screenshot: true,
          autoplay: true,
          video: {
            url: video,
            pic: pic,
            thumbnails: pic
          }
        })
      }, 500)
    } else {
      if (this.player.video.currentSrc !== video) {
        this.player.switchVideo({
          url: video,
          autoplay: true,
          pic: pic,
          type: 'auto'
        })
      }

      this.player.play()
    }
  }

  _renderContent = () => {
    const { movies } = this.props

    const moviesList = movies.map((movie,i)=> (
      <Movie key={i} infos={movie} showModal={this._showModal}/>
    ))
    return (
      <div className='movies__container'>
        {moviesList}
        <Modal
          className='videoModal'
          footer={null}
          visible={this.state.visible}
          afterClose={this._handleClose}
          onCancel={this._handleCancel}
        >
          <Spin size='large' />
        </Modal>
      </div>
    )
  }

  render () {
    return (
      <div style={{ padding: 10 }}>
        {this._renderContent()}
      </div>
    )
  }
}



// const Movie = ({infos}) => {
//   const ratingNum = 4
//   return(
//     <div className='movie' style={{backgroundImage: `url(${infos.poster})`}}>
      
//       <h2 className='movie__title'>{infos.title}</h2>
      
//       <span className='movie__description'>{infos.summary.substring(0,80) + '...'}</span>
      
//       <div className='movie__infos'>
//         <MovieInfo name='duration' value={infos.duration} />
//         <MovieInfo name='director' value={infos.director} />
//         <MovieInfo name='year' value={infos.year} />
//         <MovieInfo name='type' value={infos.movieTypes[0]} />
//       </div>
      
//       <div className='movie__imdb'>
//         <Rating rating={ratingNum}/>
//         <a  className='movie__imdb-button' target='blank'> Detail </a>
//       </div>
      
//     </div>
//   )
// } 
