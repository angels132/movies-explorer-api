const router = require('express').Router();

const { setCurrentUserInfoValidation } = require('../utils/validation');
const { getCurrentUserInfo, setCurrentUserInfo } = require('../controllers/users');

router.get('/me', getCurrentUserInfo);
router.patch('/me', setCurrentUserInfoValidation, setCurrentUserInfo);

module.exports = router;
