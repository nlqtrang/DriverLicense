const jwt = require('jsonwebtoken');
const { errorResponse } = require('../utils/responseHandler');

const authenticate = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return errorResponse(res, 401, 'Không có token, truy cập bị từ chối');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return errorResponse(res, 403, 'Token hết hạn hoặc không hợp lệ');
    }
};

const authorizeAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return errorResponse(res, 403, 'Bạn không có quyền truy cập. Chỉ dành cho admin.');
    }
    next();
};

module.exports = {
    authenticate,
    authorizeAdmin
};
