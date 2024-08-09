import axios from 'axios';

export async function sendMessage(msg) {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    
    await axios.post(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        chat_id: chatId,
        text: msg
    }, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
}