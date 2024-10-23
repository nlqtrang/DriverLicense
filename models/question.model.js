const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    questionText: { type: String, required: true },
    options: [
        {
            text: { type: String, required: true },
            image: { type: String, default: null },
            isCorrect: { type: Boolean, required: true }
        }
    ],
    category: { type: String },  // Có thể thêm phân loại câu hỏi (lý thuyết, biển báo, tình huống...)
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }  // ID của admin đã tạo câu hỏi
}, { timestamps: true });

module.exports = mongoose.model('Question', questionSchema);
