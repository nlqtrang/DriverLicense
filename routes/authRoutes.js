const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Endpoint đăng ký người dùng
router.post('/register', authController.register);

// Endpoint đăng nhập người dùng
router.post('/login', authController.login);
router.get('/verifytoken', authController.verifyToken);

module.exports = router;
