const router = require('express').Router();

const {
  getCurrentUser,
  updateUserInfo,
} = require('../controllers/users');

const validation = require('../middlewares/validation');

router.get('/me', getCurrentUser);
router.patch('/me', validation.updateUserInfo, updateUserInfo);

module.exports = router;
