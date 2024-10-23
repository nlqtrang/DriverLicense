// controllers/testController.js
const Test = require('../models/test.model');
const Question = require('../models/question.model');
const { successResponse, errorResponse } = require('../utils/responseHandler');
const { validationResult } = require('express-validator');

// Bắt đầu làm bài test
exports.takeTest = async (req, res) => {
    try {
        const {questions, startTime} = req.body;
        const userId = req.user.userId;
        // Tính toán tổng số câu hỏi và điểm số ban đầu (0)
        const totalQuestions = questions.length;
        let score = 0;

        // Tính điểm và xác định đáp án đúng
        const questionIds = questions.map(q => q.questionId);
        const questionDocs = await Question.find({_id: {$in: questionIds}});
        const answeredQuestions = questions.map((q) => {
            const questionDoc = questionDocs.find(qDoc => qDoc._id.equals(q.questionId));
            if (q.selectedAnswer == null) {
                return {
                    question: q.questionId,
                    selectedAnswer: null,
                    isCorrect: null,
                };
            }
            const isCorrect = questionDoc && (questionDoc.options.find(q => q.isCorrect).text === q.selectedAnswer);
            if (isCorrect) score++;
            return {
                question: q.questionId,
                selectedAnswer: q.selectedAnswer,
                isCorrect,
            };
        });
        // Tạo bài test mới
        const newTest = new Test({
            user: userId,
            questions: answeredQuestions,
            score,
            totalQuestions,
            startTime,
            endTime: new Date(),
            maxTimeAllowed: 30, // 30 phút
        });


        await newTest.save();
        successResponse(res, newTest._id, 'Nộp bài thành công');

    } catch (err) {
        errorResponse(res, 500, 'Nộp bài thất bại');
    }
}



// Xem lại các bài test đã làm
    exports.getUserTests = async (req, res) => {
        try {
            const userId = req.user.userId;
            const tests = await Test.find({user: userId}).select('-questions');
            successResponse(res, tests);
        } catch (err) {
            errorResponse(res, 500, 'Lỗi khi tải lịch sử làm bài');
        }
    };

// Xem chi tiết 1 bài test
    exports.getTestById = async (req, res) => {
        try {
            const { id } = req.params;
            const userId = req.user.userId;
            const test = await Test.findOne({ _id: id, user: userId }).populate({
                path: 'questions.question',
                select: 'questionText options category'
            });

            if (!test) {
                return errorResponse(res, 404, 'Không tìm thấy bài thi');
            }

            successResponse(res, test);
        } catch (err) {
            errorResponse(res, 500, 'Lỗi khi tải chi tiết bài thi');
        }
    };

// Xóa bài test của user
    exports.deleteTest = async (req, res) => {
        try {
            const {id} = req.params;
            const userId = req.user.userId;
            const deletedTest = await Test.findOneAndDelete({_id: id, user: userId});

            if (!deletedTest) {
                return errorResponse(res, 404, 'Không tìm thấy lịch sử bài thi để xóa');
            }

            successResponse(res, null,'Đã xóa lịch sử làm bài thành công');
        } catch (err) {
            errorResponse(res, 500, 'Lỗi khi xóa bài thi');
        }
    };

