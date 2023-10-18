const router = require('express').Router();

const { registerUserValidation } = require('../utils/validation');
const { registerUser } = require('../controllers/users');

router.post('/signup', registerUserValidation, registerUser);

module.exports = router;
