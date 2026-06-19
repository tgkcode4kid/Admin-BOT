require('dotenv').config({ path: '../.env' });
const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

app.post('/api/seo', async (req, res) => {
    res.sendStatus(200);
    const { chatId, text, token } = req.body;
    console.log(`[BOT SEO] Đang phân tích: ${text}`);

    const replyText = `🔍 BOT SEO: Đang kiểm tra mật độ từ khóa và Index...`;
    axios.post(`https://api.telegram.org/bot${token}/sendMessage`, { chat_id: chatId, text: replyText });
});

const PORT = process.env.PORT_SEO || 3002;
app.listen(PORT, () => console.log(`🔍 Worker SEO đang chạy tại cổng ${PORT}`));
