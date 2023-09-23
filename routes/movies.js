const router = require('express').Router();

const {
  createMovie,
  receiveMovies,
  deleteMovie,
} = require('../controllers/movies');

router.post('/', createMovie);
router.get('/', receiveMovies);
router.delete('/:id', deleteMovie);

module.exports = router;
