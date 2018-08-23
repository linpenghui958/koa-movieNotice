import React, { Component } from 'react'

export default class MovieInfo extends Component{

  _renderMovieInfo = () => {
    const {name, value} = this.props

    return (
      <div className={`movie__${name}`}>
        <span className='info__head'>
          {name.replace(/\b\w/g, l => l.toUpperCase())}
        </span>
        {value}
      </div>
    )

  }

  render() {
    return (
      <div>
        {this._renderMovieInfo()}
      </div>
    )
  }
}