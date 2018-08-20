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
import 'moment/locale/zh-cn'

const site = 'http://pbsrrj6nm.bkt.clouddn.com/'
const Meta = Card.Meta

moment.locale('zh-cn')

export default class Content extends Component {
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
      <Movie key={i} infos={movie}/>
    ))
    return (
      <div className='movies__container'>
        {moviesList}
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


const Rating = ({rating}) => {
  let stars = [];
  for (let i = 1; i < 11; i++) {
    let klass = "fa fa-star";
    if (rating >= i && rating !== null) {
      klass = "fa fa-star checked";
    }
    stars.push(
      <i
        style={{ direction: (i%2===0) ? "rtl" : "ltr"}}
        className={klass}
        />
    );
  }
  return (
    <div className="movie__rating">
      {stars}
    </div>
  );
}

const Movie = ({infos}) => {

  return(
    <div className='movie' style={{backgroundImage: `url(${infos.poster})`}}>
      
      <h2 className='movie__title'>{infos.title}</h2>
      
      <span className='movie__description'>{infos.summary.substring(0,80) + '...'}</span>
      
      <div className='movie__infos'>
        <MovieInfo name='duration' value={infos.duration} />
        <MovieInfo name='director' value={infos.director} />
        <MovieInfo name='year' value={infos.year} />
        <MovieInfo name='type' value={infos.movieTypes[0]} />
      </div>
      
      <div className='movie__imdb'>
        <Rating rating={Math.round(4)}/>
        <a  className='movie__imdb-button' target='blank'> Detail </a>
      </div>
      
    </div>
  )
} 

const MovieInfo = ({name,value}) => (
  <div className={`movie__${name}`}>
    <span className='info__head'>
      {name.replace(/\b\w/g, l => l.toUpperCase())}
    </span>
    {value}
  </div>
)