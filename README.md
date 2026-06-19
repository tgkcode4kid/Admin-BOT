# 🤖 Microservices AI Telegram Bot System

Hệ thống Telegram Bot cấp độ doanh nghiệp ứng dụng kiến trúc **Microservices** và mô hình **LLM Router**. Thay vì sử dụng các luồng điều kiện tĩnh (if/else), hệ thống sử dụng Trí tuệ nhân tạo (Google Gemini) để phân tích ngôn ngữ tự nhiên, phân loại ý định người dùng và điều phối tác vụ đến các Worker (Bot Con) chuyên trách một cách hoàn toàn tự động.

Dự án được thiết kế hướng tới khả năng xử lý dữ liệu quy mô lớn, tính mở rộng vô hạn và tích hợp sẵn hệ thống phòng thủ Code Injection toàn diện ngay tại cổng giao tiếp.

---

## ✨ Tính Năng Nổi Bật

* **🧠 AI API Gateway (Master Bot):** Sử dụng LLM (Gemini 1.5 Flash) để định tuyến yêu cầu. AI tự động học các endpoint khả dụng và điều hướng chính xác mà không cần cấu hình logic rẽ nhánh thủ công.
* **🛒 Bot Thu Mua (Relay to Apps Script):** Worker chuyên trách tiếp nhận yêu cầu báo giá, tự động chuyển tiếp tải trọng (payload) sang Google Apps Script để cào dữ liệu SerpAPI đa luồng và xử lý logic định giá.
* **🔍 Bot SEO:** Worker hỗ trợ các tác vụ phân tích, kiểm tra indexing và tối ưu hóa SEO kỹ thuật.
* **🔌 Kiến trúc Plug-and-Play:** Thêm mới Bot Con (Worker) chỉ với 1 dòng khai báo URL vào Bản đồ Định tuyến (Routing Registry) của Master Bot.
* **🛡️ Code Injection Defense (WAF):** Tường lửa 4 lớp án ngữ tại Gateway, ép kiểu dữ liệu đầu vào, lọc sạch thẻ HTML độc hại, chặn đứng các nỗ lực tấn công SQL/NoSQL Injection và kiểm soát giới hạn lưu lượng (Rate Limiting).
* **⚡ Non-blocking I/O:** Cơ chế giao tiếp "Fire and Forget" giữa Master và Child, ngăn chặn tình trạng nghẽn luồng (bottleneck) khi phải xử lý hàng ngàn yêu cầu đồng thời.

---

## 🛠 Công Nghệ Sử Dụng

* **Runtime/Framework:** Node.js, Express.js
* **Giao tiếp mạng:** Axios, Webhook (Telegram API)
* **AI Engine:** Google Gemini API
* **Bảo mật:** Helmet, express-validator, express-mongo-sanitize, xss-clean, express-rate-limit
* **Xử lý Serverless:** Google Apps Script

---

## 📂 Cấu Trúc Thư Mục

```text
telegram-bot-system/
├── .env                        # Chứa Tokens và API Keys (Bảo mật)
├── package.json                # Quản lý dependencies và scripts
├── master-gateway/             # MODULE 1: BOT CHA (CỔNG ĐIỀU PHỐI AI)
│   ├── master-bot.js           # Khởi chạy Gateway (Port 3000)
│   ├── middlewares/            # Lớp bảo vệ (Firewall, Validator)
│   └── services/               # Gemini AI Router Service
└── bot-child/                  # CỤM MODULE WORKER (BOT CON)
    ├── child-thumua/           # Xử lý báo giá & Relay qua Apps Script (Port 3001)
    │   └── thumua-bot.js       
    └── child-seo/              # Xử lý phân tích từ khóa (Port 3002)
        └── seo-bot.js