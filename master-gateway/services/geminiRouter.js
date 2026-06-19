const axios = require('axios');

async function analyzeIntentWithGemini(userText, apiKey, servicesList) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    const validIntents = servicesList.join(', ');
    const systemPrompt = `Bạn là Trí tuệ Nhân tạo làm nhiệm vụ điều phối hệ thống Microservices.
Nhiệm vụ: Trả về JSON chứa khóa "intent" và "reply".
- "intent" BẮT BUỘC phải nằm trong danh sách các Bot đang hoạt động: [${validIntents}].
- Thu mua/báo giá/định giá -> {"intent": "thumua"}
- SEO/từ khóa/website -> {"intent": "seo"}
- Tán gẫu, chào hỏi -> {"intent": "chat", "reply": "Câu trả lời của bạn"}

Chỉ xuất JSON hợp lệ, không chứa văn bản thừa.`;

    try {
        const response = await axios.post(url, {
            contents: [{ parts: [{ text: `Câu của khách: "${userText}"\n\n${systemPrompt}` }] }],
            generationConfig: { response_mime_type: "application/json" }
        });
        return JSON.parse(response.data.candidates[0].content.parts[0].text);
    } catch (error) {
        console.error("[GEMINI ERROR]", error.message);
        return { intent: "error" };
    }
}

module.exports = { analyzeIntentWithGemini };