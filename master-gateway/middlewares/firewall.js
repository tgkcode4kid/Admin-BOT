const helmet = require('helmet');
const xssClean = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 100, 
    message: "Hệ thống đang quá tải, vui lòng chậm lại."
});

module.exports = [
    helmet(),
    xssClean(),
    mongoSanitize(),
    limiter
];