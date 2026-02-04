const { GoogleGenerativeAI } = require("@google/generative-ai");
const config = require('../config');

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ message: 'Method Not Allowed' });

    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ reply: "Berikan perintah, Operator." });

    try {
        const genAI = new GoogleGenerativeAI(config.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        // Tambahkan instruksi dasar agar AI tahu perannya
        const systemInstruction = "Kamu adalah asisten AI dari LIBRARY_CORE. Balas dengan singkat, tegas, dan gaya futuristik cyberpunk.";
        
        const result = await model.generateContent(`${systemInstruction}\n\nUser: ${prompt}`);
        const response = await result.response;
        const text = response.text();

        res.status(200).json({ reply: text });
    } catch (error) {
        console.error(error);
        res.status(500).json({ reply: "Sistem AI mengalami malfungsi. Cek API Key Anda." });
    }
}
