const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questionController');
const { authenticate, authorizeAdmin } = require('../middlewares/authMiddleware');
const { validateCreateOrUpdateQuestion } = require('../validators/questionValidator');

// Định nghĩa route
router.post(
    '/create',
    authorizeAdmin,
    validateCreateOrUpdateQuestion,
    questionController.createQuestion
);

router.get('/',authorizeAdmin, questionController.getQuestions);
router.get('/random', questionController.getListQuestionToTest);
router.get('/:id', authorizeAdmin, questionController.getQuestionById);
router.put(
    '/:id',
    authorizeAdmin,
    validateCreateOrUpdateQuestion,
    questionController.updateQuestion
);
router.delete('/:id', authorizeAdmin, questionController.deleteQuestion);

module.exports = router;
