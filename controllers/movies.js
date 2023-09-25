const RESPONSE_MESSAGES = require('../utils/constants');

const INACCURATE_DATA_ERROR = require('../utils/errors/InaccurateDataError'); // 400
const FORBIDDEN_ERROR = require('../utils/errors/ForbiddenError'); // 403
const NOT_FOUND_ERROR = require('../utils/errors/NotFoundError'); // 404

const { deletionFavourite } = RESPONSE_MESSAGES[200].movies;
const { addingFavourite } = RESPONSE_MESSAGES[201].movies;

const { cast } = RESPONSE_MESSAGES[400].users;
const { validationSaving } = RESPONSE_MESSAGES[400].movies;
const { accessRightsDeletion } = RESPONSE_MESSAGES[403].movies;
const { userIdNotFound, dataNotFound } = RESPONSE_MESSAGES[404].movies;

const Movie = require('../models/movie');

function createMovie(req, res, next) {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;

  const { _id } = req.user;

  Movie
    .create({
      country,
      director,
      duration,
      year,
      description,
      image,
      trailerLink,
      thumbnail,
      owner: _id,
      movieId,
      nameRU,
      nameEN,
    })
    .then(() => res.status(201).send({ message: addingFavourite }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new INACCURATE_DATA_ERROR(validationSaving));
      } else {
        next(err);
      }
    });
}

function receiveMovies(req, res, next) {
  const { _id } = req.user;

  Movie
    .find({ owner: _id })
    .populate('owner', '_id')
    .then((movies) => {
      if (movies) return res.send(movies);

      throw new NOT_FOUND_ERROR(userIdNotFound);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new INACCURATE_DATA_ERROR(cast));
      } else {
        next(err);
      }
    });
}

function deleteMovie(req, res, next) {
  const { id: movieId } = req.params;
  const { _id: userId } = req.user;

  Movie
    .findById(movieId)
    .then((movie) => {
      if (!movie) throw new NOT_FOUND_ERROR(dataNotFound);

      const { owner: movieOwnerId } = movie;
      if (movieOwnerId.valueOf() !== userId) {
        throw new FORBIDDEN_ERROR(accessRightsDeletion);
      }

      movie
        .deleteOne()
        .then(() => res.send({ message: deletionFavourite }))
        .catch(next);
    })
    .catch(next);
}

module.exports = {
  createMovie,
  receiveMovies,
  deleteMovie,
};
