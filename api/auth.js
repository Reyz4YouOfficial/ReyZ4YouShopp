const { MongoClient } = require('mongodb');
const config = require('./config'); // Ambil dari config.js

const client = new MongoClient(config.MONGODB_URI);

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ msg: 'Method Not Allowed' });
    
    try {
        await client.connect();
        const users = client.db('reyz_db').collection('users');
        const { type, username, password } = req.body;

        if (type === 'register') {
            const exists = await users.findOne({ username });
            if (exists) return res.status(400).json({ msg: 'NODE_EXISTS' });
            await users.insertOne({ username, password, createdAt: new Date() });
            return res.status(200).json({ msg: 'SUCCESS' });
        } 

        if (type === 'login') {
            const user = await users.findOne({ username, password });
            if (!user) return res.status(401).json({ msg: 'ACCESS_DENIED' });
            return res.status(200).json({ success: true, username: user.username });
        }
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}
