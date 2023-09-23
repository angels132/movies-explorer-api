const router = require('express').Router();

const { getCurrentUserInfo, setCurrentUserInfo } = require('../controllers/users');

router.get('/me', getCurrentUserInfo);
router.patch('/me', setCurrentUserInfo);

module.exports = router;
