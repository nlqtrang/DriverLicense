const Question = require('../models/question.model');
const { successResponse, errorResponse } = require('../utils/responseHandler');
const { validationResult } = require('express-validator');

// Tạo câu hỏi mới
exports.createQuestion = async (req, res) => {
    // Kiểm tra lỗi validation từ request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return errorResponse(res, 400, errors.array().map(error => error.msg).join(', '));
    }

    try {
        const { questionText, options, category } = req.body;

        // Tạo mới câu hỏi
        const newQuestion = new Question({
            questionText,
            options,
            category,
            createdBy: req.user.userId // ID của admin đã tạo câu hỏi
        });

        await newQuestion.save();
        successResponse(res, newQuestion, 'Tạo câu hỏi thành công');
    } catch (err) {
        errorResponse(res, 500, 'Lỗi khi tạo câu hỏi');
    }
};

// Lấy danh sách câu hỏi
exports.getListQuestionToTest = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || parseInt(process.env.DEFAULT_LIMIT) || 30;
        const totalQuestions = await Question.countDocuments();
        const size = totalQuestions < limit ? totalQuestions : limit;
        const questions = await Question.aggregate([
            { $sample: { size: size } }, 
            {
                $project: {
                    "options.isCorrect": 0,
                    "createdBy": 0,
                    "createdAt": 0,
                    "updatedAt": 0,
                    "__v": 0
                }
            }
        ]);
        successResponse(res, questions);
    } catch (err) {
        errorResponse(res, 500, 'Lỗi khi lấy danh sách câu hỏi cho bài thi');
    }
};
exports.getQuestions = async (req, res) => {
    try {
        const questions = await Question.find();
        successResponse(res, questions);
    } catch (err) {
        errorResponse(res, 500, 'Lỗi khi lấy danh sách câu hỏi');
    }
};

// Lấy chi tiết câu hỏi
exports.getQuestionById = async (req, res) => {
    try {
        const question = await Question.findById(req.params.id);
        if (!question) {
            return errorResponse(res, 404, 'Không tìm thấy câu hỏi');
        }
        successResponse(res, question);
    } catch (err) {
        errorResponse(res, 500, 'Lỗi khi lấy chi tiết câu hỏi');
    }
};

// Cập nhật câu hỏi
exports.updateQuestion = async (req, res) => {
    // Kiểm tra lỗi validation từ request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return errorResponse(res, 400, errors.array().map(error => error.msg).join(', '));
    }

    try {
        const { questionText, options, category } = req.body;
        const question = await Question.findByIdAndUpdate(
            req.params.id,
            { questionText, options, category },
            { new: true }
        );
        if (!question) {
            return errorResponse(res, 404, 'Không tìm thấy câu hỏi');
        }
        successResponse(res, question, 'Cập nhật câu hỏi thành công');
    } catch (err) {
        errorResponse(res, 500, 'Lỗi khi cập nhật câu hỏi');
    }
};

// Xóa câu hỏi
exports.deleteQuestion = async (req, res) => {
    try {
        const question = await Question.findByIdAndDelete(req.params.id);
        if (!question) {
            return errorResponse(res, 404, 'Không tìm thấy câu hỏi');
        }
        successResponse(res, null, 'Xóa câu hỏi thành công');
    } catch (err) {
        errorResponse(res, 500, 'Lỗi khi xóa câu hỏi');
    }
};