const mongoose = require('mongoose');

const testSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    questions: [
        {
            question: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
            selectedAnswer: { type: String, default: null }, // Đáp án người dùng đã chọn
            isCorrect: { type: Boolean, default: null }  // Đáp án người dùng chọn có đúng không
        }
    ],
    score: { type: Number, required: true },  // Điểm số của bài thi
    totalQuestions: { type: Number, required: true },  // Tổng số câu hỏi trong bài thi
    // Các trường thời gian
    startTime: { type: Date, default: Date.now },  // Thời gian bắt đầu làm bài
    endTime: { type: Date },  // Thời gian kết thúc bài thi
    maxTimeAllowed: { type: Number },  // Thời gian tối đa cho phép (tính bằng phút)


}, { timestamps: true });

module.exports = mongoose.model('Test', testSchema);
