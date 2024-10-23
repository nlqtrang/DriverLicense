const baseResponse = {
    data: null,
    resultCode: 0,
    message: null,
    errorCode: null
};

// Hàm trả về response thành công
exports.successResponse = (res, data = null, message = null) => {
    res.status(200).json({
        ...baseResponse,
        data,
        resultCode: 0,
        message
    });
};

// Hàm trả về response lỗi
exports.errorResponse = (res, errorCode, message) => {
    res.status(200).json({
        ...baseResponse,
        resultCode: -1,
        message,
        errorCode
    });
};