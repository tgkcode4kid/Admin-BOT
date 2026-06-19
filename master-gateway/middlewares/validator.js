const { body, validationResult } = require('express-validator');

const validateTelegramInput = [
    body('message.chat.id').isNumeric().withMessage('Chat ID sai định dạng'),
    body('message.text').isString().trim(), // Gỡ bỏ .escape() để tránh làm hỏng các ký tự tiếng Việt của người dùng
    
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.error("[VALIDATOR BLOCK] Phát hiện gói tin lỗi/bẩn.");
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

module.exports = { validateTelegramInput };
