const express = require('express');
const router = express.Router();
const testController = require('../controllers/testController');

// Bắt đầu làm bài test
router.post('/taketest', testController.takeTest);

// Xem lại các bài test đã làm
router.get('/', testController.getUserTests);

// Xem chi tiết 1 bài test
router.get('/:id', testController.getTestById);

// Xóa bài test của user
router.delete('/:id', testController.deleteTest);

module.exports = router;