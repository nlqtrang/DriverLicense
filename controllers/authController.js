const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const { successResponse, errorResponse } = require('../utils/responseHandler');


const saltRounds = 10;

// Đăng ký người dùng
exports.register = async (req, res) => {
    try {
        const { username, password, role } = req.body;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = new User({
            username,
            password: hashedPassword,
            role
        });

        await newUser.save();
        successResponse(res, null,'Đăng ký thành công');
    } catch (err) {
        errorResponse(res, 500, 'Lỗi đăng ký người dùng');
    }
};

// Đăng nhập người dùng
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });

        if (!user) {
            return errorResponse(res, 400, 'Sai tên đăng nhập hoặc mật khẩu');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return errorResponse(res, 400, 'Sai tên đăng nhập hoặc mật khẩu');
        }

        // Tạo AccessToken
        const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '8h' });

        successResponse(res, token, "Đăng nhập thành công");
    } catch (err) {
        errorResponse(res, 500, 'Lỗi đăng nhập');
    }
};

exports.verifyToken = async (req, res) => {
    const token = req.headers['authorization'];

    if (!token) {
        return errorResponse(res, 401, 'Không có token, truy cập bị từ chối');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).select('username role _id');

        successResponse(res, user);
    } catch (err) {
        errorResponse(res, 403, 'Token hết hạn hoặc không hợp lệ');
    }
}
