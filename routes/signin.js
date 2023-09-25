const router = require('express').Router();

const { loginUserValidation } = require('../utils/validation');
const { loginUser } = require('../controllers/users');

router.post('/signin', loginUserValidation, loginUser);

module.exports = router;
