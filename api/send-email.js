// Vercel Serverless Function - E-posta Gönderimi
// Gmail SMTP kullanarak e-posta gönderir

import nodemailer from 'nodemailer';

export default async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { type, reservation, car } = req.body;
        const GMAIL_USER = process.env.GMAIL_USER; // ferdi@shipglobaltr.com
        const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD; // 16 haneli şifre
        const APPROVER_EMAIL = 'ferdi@shipglobaltr.com';

        if (!GMAIL_USER || !GMAIL_APP_PASSWORD) {
            throw new Error('Gmail credentials not configured');
        }

        // Gmail SMTP transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: GMAIL_USER,
                pass: GMAIL_APP_PASSWORD
            }
        });

        let subject, html, to;

        // E-posta şablonları
        switch (type) {
            case 'new':
                subject = 'Yeni Araç Rezervasyon Talebi';
                to = APPROVER_EMAIL;
                html = `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #2563EB;">Yeni Araç Rezervasyon Talebi</h2>
                        <p>Merhaba,</p>
                        <p>Yeni bir araç rezervasyon talebi alındı:</p>
                        
                        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                            <h3 style="margin-top: 0; color: #333;">Rezervasyon Detayları</h3>
                            <ul style="list-style: none; padding: 0;">
                                <li><strong>Kullanıcı:</strong> ${reservation.user_name}</li>
                                <li><strong>E-posta:</strong> ${reservation.user_email}</li>
                                <li><strong>Araç:</strong> ${car.brand} ${car.model} (${car.plate})</li>
                                <li><strong>Tarih:</strong> ${reservation.date}</li>
                                <li><strong>Saat:</strong> ${reservation.start_time} - ${reservation.end_time}</li>
                                <li><strong>Not:</strong> ${reservation.note || "Not belirtilmemiş"}</li>
                            </ul>
                        </div>
                        
                        <p>Lütfen sisteme giriş yaparak rezervasyonu onaylayın veya reddedin.</p>
                        <p>İyi çalışmalar,<br>Araç Rezervasyon Sistemi</p>
                    </div>
                `;
                break;

            case 'approved':
                subject = 'Araç Rezervasyonunuz Onaylandı ✅';
                to = reservation.user_email;
                html = `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #10B981;">Rezervasyonunuz Onaylandı!</h2>
                        <p>Merhaba ${reservation.user_name},</p>
                        <p>Araç rezervasyonunuz onaylanmıştır:</p>
                        
                        <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10B981;">
                            <h3 style="margin-top: 0; color: #333;">Rezervasyon Detayları</h3>
                            <ul style="list-style: none; padding: 0;">
                                <li><strong>Araç:</strong> ${car.brand} ${car.model} (${car.plate})</li>
                                <li><strong>Tarih:</strong> ${reservation.date}</li>
                                <li><strong>Saat:</strong> ${reservation.start_time} - ${reservation.end_time}</li>
                            </ul>
                        </div>
                        
                        <p>İyi yolculuklar!</p>
                    </div>
                `;
                break;

            case 'rejected':
                subject = 'Araç Rezervasyonunuz Reddedildi ❌';
                to = reservation.user_email;
                html = `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #EF4444;">Rezervasyonunuz Reddedildi</h2>
                        <p>Merhaba ${reservation.user_name},</p>
                        <p>Maalesef araç rezervasyonunuz reddedilmiştir:</p>
                        
                        <div style="background-color: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #EF4444;">
                            <h3 style="margin-top: 0; color: #333;">Rezervasyon Detayları</h3>
                            <ul style="list-style: none; padding: 0;">
                                <li><strong>Araç:</strong> ${car.brand} ${car.model} (${car.plate})</li>
                                <li><strong>Tarih:</strong> ${reservation.date}</li>
                                <li><strong>Saat:</strong> ${reservation.start_time} - ${reservation.end_time}</li>
                                <li><strong>Red Sebebi:</strong> ${reservation.rejection_reason || "Sebep belirtilmemiş"}</li>
                            </ul>
                        </div>
                        
                        <p>Başka bir tarih için yeni rezervasyon yapabilirsiniz.</p>
                    </div>
                `;
                break;

            case 'test':
                subject = 'Test E-postası';
                to = APPROVER_EMAIL;
                html = `
                    <h2>Resend + Vercel Test</h2>
                    <p>Bu bir test e-postasıdır.</p>
                    <p>Tarih: ${new Date().toLocaleString("tr-TR")}</p>
                `;
                break;

            default:
                throw new Error('Invalid email type');
        }

        // Gmail SMTP ile e-posta gönder
        const mailOptions = {
            from: `"Ship Araç Rezervasyon" <${GMAIL_USER}>`,
            to: to,
            subject: subject,
            html: html
        };

        const info = await transporter.sendMail(mailOptions);

        return res.status(200).json({
            success: true,
            message: `E-posta başarıyla ${to} adresine gönderildi`,
            messageId: info.messageId
        });

    } catch (error) {
        console.error('E-posta gönderme hatası:', error);
        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
}
