const router = require('express').Router();

const {
  createMovie,
  deleteMovie,
  getMovies,
} = require('../controllers/movies');

const validation = require('../middlewares/validation');

router.get('/', getMovies);
router.post('/', validation.createMovie, createMovie);
router.delete('/:movieId', validation.chekIdMovie, deleteMovie);

module.exports = router;
