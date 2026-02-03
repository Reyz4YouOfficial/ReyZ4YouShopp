const config = require('./config');

export default async function handler(req, res) {
    const { amount, itemName } = req.body;
    const API_KEY = config.PAKASIR_API_KEY;
    const SLUG = config.SLUG_PAKASIR;

    const payUrl = `https://app.pakasir.com/pay/${SLUG}/${amount}?item=${itemName}&apikey=${API_KEY}`;
    res.status(200).json({ url: payUrl });
}
