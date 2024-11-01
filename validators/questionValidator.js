// validators/questionValidator.js
const { body } = require('express-validator');

exports.validateCreateOrUpdateQuestion = [
    body('questionText').notEmpty().withMessage('Nội dung câu hỏi là bắt buộc'),
    body('options').isArray({ min: 2 }).withMessage('Phải có ít nhất 2 đáp án'),
    body('options.*.text').notEmpty().withMessage('Nội dung đáp án không được để trống'),
    body('options.*.isCorrect').isBoolean().withMessage('Trạng thái đúng/sai của đáp án phải là boolean'),
    body('options').custom((options) => {
        const uniqueOptions = new Set(options?.map(option => option.text));
        if (uniqueOptions.size !== options.length) {
            throw new Error('Các đáp án không được trùng lặp');
        }
        return true;
    }),
    body('options').custom((options) => {
        const correctOptions = options.filter(option => option.isCorrect);
        if (correctOptions.length !== 1) {
            throw new Error('Phải có duy nhất một đáp án đúng');
        }
        return true;
    }),
    // body('options').custom((options) => {
    //     const correctOptions = options.filter(option => option.isCorrect);
    //     if (correctOptions.length < 1) {
    //         throw new Error('Phải có ít nhất một đáp án đúng');
    //     }
    //     return true;
    // })
];
