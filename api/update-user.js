const mongoose = require('mongoose');
const config = require('../config');

// Inisialisasi Koneksi (Penting untuk Vercel Serverless)
let cachedDb = null;

async function connectToDatabase() {
    if (cachedDb) return cachedDb;
    const db = await mongoose.connect(config.MONGODB_URI || config.url);
    cachedDb = db;
    return db;
}

// Skema User
const UserSchema = new mongoose.Schema({
    name: String,
    photo: String,
    // Tambahkan field lain jika perlu
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ message: 'Method Not Allowed' });

    try {
        await connectToDatabase();
        const { name, photo } = req.body;

        // Mencari dan mengupdate user pertama (karena ini dashboard personal)
        // Atau kamu bisa gunakan filter berdasarkan ID jika sudah ada sistem login
        const updatedUser = await User.findOneAndUpdate(
            {}, 
            { name, photo }, 
            { upsert: true, new: true }
        );

        res.status(200).json({ success: true, data: updatedUser });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}
