const router = require('express').Router();

const { registerUser } = require('../controllers/users');

router.post('/signup', registerUser);

module.exports = router;
