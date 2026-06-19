require('dotenv').config({ path: '../.env' });
const express = require('express');
const axios = require('axios');
const firewall = require('./middlewares/firewall');
const { validateTelegramInput } = require('./middlewares/validator');
const { analyzeIntentWithGemini } = require('./services/geminiRouter');

const app = express();
app.use(express.json());
app.use(firewall); 

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// ==========================================
// BẢN ĐỒ ĐỊNH TUYẾN (ROUTING REGISTRY)
// Thêm bao nhiêu Bot Con tùy thích mà không cần viết thêm if/else
// ==========================================
const CHILD_SERVICES = {
    'thumua': `http://localhost:${process.env.PORT_THUMUA}/api/thumua`,
    'seo': `http://localhost:${process.env.PORT_SEO}/api/seo`
    // 'invoice': `http://localhost:${process.env.PORT_INVOICE}/api/invoice`
};

app.post('/webhook', validateTelegramInput, async (req, res) => {
    res.sendStatus(200); 

    const { id: chatId } = req.body.message.chat;
    const text = req.body.message.text;
    console.log(`[MASTER GATEWAY] Đã nhận lệnh: "${text}"`);

    // Gửi danh sách các bot đang sống lên cho Gemini phân tích
    const activeServices = Object.keys(CHILD_SERVICES);
    const aiAnalysis = await analyzeIntentWithGemini(text, GEMINI_API_KEY, activeServices);
    
    console.log(`[ROUTER] Quyết định điều hướng:`, aiAnalysis);

    // ==========================================
    // CƠ CHẾ BẮN LỆNH ĐA LUỒNG (NON-BLOCKING)
    // ==========================================
    const targetWebhook = CHILD_SERVICES[aiAnalysis.intent];

    if (targetWebhook) {
        // Master ném việc cho Bot Con ở background, không dùng await để tránh block luồng chính
        axios.post(targetWebhook, { chatId, text, token: TELEGRAM_TOKEN })
             .catch(err => console.error(`[CRITICAL] Bot con [${aiAnalysis.intent}] mất kết nối!`));
    } 
    else if (aiAnalysis.intent === 'chat' && aiAnalysis.reply) {
        // Tán gẫu tự nhiên
        axios.post(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, { chat_id: chatId, text: aiAnalysis.reply })
             .catch(err => console.error(err.message));
    } 
    else {
        // Chặn bắt ngoại lệ nếu AI xử lý hỏng
        axios.post(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, { 
            chat_id: chatId, 
            text: "🤖 Hiện tại tôi chưa được huấn luyện để xử lý yêu cầu này." 
        }).catch(err => console.error(err.message));
    }
});

const PORT = process.env.PORT_MASTER || 3000;
app.listen(PORT, () => console.log(`🧠 Master API Gateway đang lắng nghe tại cổng ${PORT}`));
