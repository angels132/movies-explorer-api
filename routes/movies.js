const router = require('express').Router();

const { createMovieValidation, deleteMovieValidation } = require('../utils/validation');
const {
  createMovie,
  receiveMovies,
  deleteMovie,
} = require('../controllers/movies');

router.post('/', createMovieValidation, createMovie);
router.get('/', receiveMovies);
router.delete('/:id', deleteMovieValidation, deleteMovie);

module.exports = router;
