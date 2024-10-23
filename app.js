const express = require('express');
const dotenv = require('dotenv');
const { errorResponse } = require('./utils/responseHandler');
var connectMongoDB =  require("./configs/mongodb.config.js");
var createError = require("http-errors");
const cors = require('cors');
const { authenticate, authorizeAdmin } = require('./middlewares/authMiddleware');
// const cors = require('cors');
// Thêm middleware CORS



const authRoutes = require('./routes/authRoutes');  // Import các route liên quan đến auth
const questionRoutes = require('./routes/questionRoutes');
const testRoutes = require('./routes/testRoutes');

dotenv.config();
const app = express();

app.use(cors());

// Hoặc tùy chọn cấu hình CORS cụ thể
app.use(cors({
    origin: 'http://localhost:3000', // Cho phép từ React app
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    next();
});
// Middleware
// app.use(cors());
app.use(express.json());

// Đăng ký route
app.use('/api/auth', authRoutes);  // Tất cả các route liên quan đến auth sẽ bắt đầu bằng /api/auth
app.use(authenticate);

app.use('/api/questions', questionRoutes);
app.use('/api/tests', testRoutes);

connectMongoDB()

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  const errorMessage = err.message || 'Đã có lỗi xảy ra';
  return errorResponse(res, err.status || 500, errorMessage);
});

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});
// module.exports = app;
