const mongoose = require('mongoose')
const Movie = mongoose.model('Movie')

export const getAllMovies = async (type, year) => {
  let query = {}
  query.posterKey = {
    $exists: true
  }
  if (type) {
    query.movieTypes = {
      $in: [type]
    }
  }

  if (year) {
    query.year = year
  }

  const movies = await Movie.find(query).limit(100)

  return movies
}

export const getMovieDetail = async (id) => {
  const movie = await Movie.findOne({_id: id})

  return movie
}

export const getRelativeMovies = async (movie) => {
  const movies = await Movie.find({
    movieTypes: {
      $in: movie.movieTypes
    },
    posterKey: {
      $exists: true
    }
  }).limit(50)

  return movies
}