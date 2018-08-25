import React, { Component } from 'react'

import MovieInfo from './MovieInfo'

export default class Movie extends Component{
  constructor(props) {
    super(props)
    this.clickFun = this.clickFun.bind(this)
  }
  clickFun () {
    console.log('click')
  }

  render () {
    const {infos} = this.props
    return (
      <div className='movie' style={{backgroundImage: `url(${infos.poster})`}}>
        
        <h2 className='movie__title'>{infos.title}</h2>
        
        <span className='movie__description'>{infos.summary.substring(0,80) + '...'}</span>
        
        <div className='movie__infos'>
          <MovieInfo name='duration' value={this.clickFun.bind(this)} />
          <MovieInfo name='director' value={infos.director} />
          <MovieInfo name='year' value={infos.year} />
          <MovieInfo name='type' value={infos.movieTypes[0]} />
        </div>
        
        <div className='movie__imdb'>
          <Rating rating={4}/>
          <span onClick={this.props.showModal}  className='movie__imdb-button'> Detail </span>
        </div>
        
      </div>
    )
  }
}


const Rating = ({rating}) => {
  rating = 8
  let stars = [];
  for (let i = 1; i < 11; i++) {
    let klass = "fa fa-star";
    if (rating >= i && rating !== null) {
      klass = "fa fa-star checked";
    }
    stars.push(
      <i
        style={{ direction: (i%2===0) ? "rtl" : "ltr"}}
        key={i}
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