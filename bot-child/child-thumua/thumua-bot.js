require('dotenv').config({ path: '../../.env' });
const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

const APPSCRIPT_URL = process.env.APPSCRIPT_URL;

app.post('/api/thumua', async (req, res) => {
    // 1. Trả lời 200 OK ngay lập tức cho Master Bot để giải phóng luồng định tuyến
    res.sendStatus(200);
    
    const { chatId, text, token } = req.body;
    console.log(`[BOT THU MUA] Đang chuyển tiếp lệnh "${text}" sang Apps Script...`);

    // 2. Đóng gói dữ liệu giả lập cấu trúc chuẩn của Telegram Webhook
    // Apps Script sẽ tưởng đây là tin nhắn do Telegram gửi tới và xử lý bình thường
    const payloadToAppScript = {
        message: {
            message_id: Date.now().toString(), // Tạo ID ảo để chống lỗi cache
            chat: {
                id: chatId
            },
            text: text
        }
    };

    try {
        // 3. Bắn dữ liệu sang Google Apps Script (Bypass Node.js Backend)
        await axios.post(APPSCRIPT_URL, payloadToAppScript);
        console.log(`[BOT THU MUA] Đã đẩy thành công lệnh "${text}" sang Google Apps Script.`);
        
    } catch (error) {
        console.error(`[CRITICAL] Không thể kết nối với Apps Script:`, error.message);
        
        // 4. Cơ chế dự phòng: Báo lỗi cho khách nếu máy chủ Google Apps Script bị treo
        axios.post(`https://api.telegram.org/bot${token}/sendMessage`, {
            chat_id: chatId,
            text: "⚠️ Hệ thống tra cứu giá đang bảo trì nội bộ. Bạn vui lòng thử lại sau ít phút nhé!"
        }).catch(err => console.error("Lỗi gửi tin báo lỗi", err.message));
    }
});

const PORT = process.env.PORT_THUMUA || 3001;
app.listen(PORT, () => console.log(`🛒 Worker Thu Mua (Relay to Apps Script) đang chạy tại cổng ${PORT}`));