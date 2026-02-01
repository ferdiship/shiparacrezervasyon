/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import {onRequest} from "firebase-functions/v2/https";
import {onValueCreated, onValueUpdated} from "firebase-functions/v2/database";
import {logger} from "firebase-functions";
import * as admin from "firebase-admin";
import * as nodemailer from "nodemailer";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

// Firebase Admin SDK'yı başlat
admin.initializeApp({
  databaseURL: "https://arazrezervasyon-default-rtdb.firebaseio.com"
});

// E-posta konfigürasyonu
const EMAIL_CONFIG = {
  host: "smtp.gmail.com", // Gmail/Google Workspace SMTP sunucusu
  port: 587, // SMTP portu
  secure: false, // TLS için `false` (port 587), SSL için `true` (port 465)
  user: "ferdi@shipglobaltr.com", // Gönderen e-posta adresi
  pass: "ohzn tizt agvz hevp", // Uygulama Şifresi (App Password)
  approverEmail: "ferdi@shipglobaltr.com", // Onay e-postalarının gideceği tek adres
  approverName: "Araç Rezervasyon Yöneticisi",
};

// Nodemailer transporter oluştur
const createTransporter = () => {
  return nodemailer.createTransport({
    host: EMAIL_CONFIG.host,
    port: EMAIL_CONFIG.port,
    secure: EMAIL_CONFIG.secure, // true for 465, false for other ports
    auth: {
      user: EMAIL_CONFIG.user,
      pass: EMAIL_CONFIG.pass,
    },
    tls: {
      rejectUnauthorized: true,
    },
  });
};

// E-posta şablonları
const emailTemplates = {
  newReservation: (reservation: any, car: any) => ({
    subject: "Yeni Araç Rezervasyon Talebi",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563EB;">Yeni Araç Rezervasyon Talebi</h2>
        <p>Merhaba ${EMAIL_CONFIG.approverName},</p>
        <p>Yeni bir araç rezervasyon talebi alındı:</p>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #333;">Rezervasyon Detayları</h3>
          <ul style="list-style: none; padding: 0;">
            <li><strong>Kullanıcı:</strong> ${reservation.userName}</li>
            <li><strong>E-posta:</strong> ${reservation.userEmail}</li>
            <li><strong>Araç:</strong> ${car.brand} ${car.model} (${car.plate})</li>
            <li><strong>Tarih:</strong> ${reservation.date}</li>
            <li><strong>Saat:</strong> ${reservation.startTime} - ${reservation.endTime}</li>
            <li><strong>Not:</strong> ${reservation.note || "Not belirtilmemiş"}</li>
          </ul>
        </div>
        
        <p>Lütfen sisteme giriş yaparak rezervasyonu onaylayın veya reddedin.</p>
        <p>İyi çalışmalar,<br>Araç Rezervasyon Sistemi</p>
      </div>
    `,
  }),

  approved: (reservation: any, car: any) => ({
    subject: "Araç Rezervasyonunuz Onaylandı ✅",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #10B981;">Rezervasyonunuz Onaylandı!</h2>
        <p>Merhaba ${reservation.userName},</p>
        <p>Araç rezervasyonunuz onaylanmıştır:</p>
        
        <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10B981;">
          <h3 style="margin-top: 0; color: #333;">Rezervasyon Detayları</h3>
          <ul style="list-style: none; padding: 0;">
            <li><strong>Araç:</strong> ${car.brand} ${car.model} (${car.plate})</li>
            <li><strong>Tarih:</strong> ${reservation.date}</li>
            <li><strong>Saat:</strong> ${reservation.startTime} - ${reservation.endTime}</li>
          </ul>
        </div>
        
        <p><strong>Onaylayan:</strong> ${EMAIL_CONFIG.approverName}</p>
        <p>İyi yolculuklar!</p>
      </div>
    `,
  }),

  rejected: (reservation: any, car: any) => ({
    subject: "Araç Rezervasyonunuz Reddedildi ❌",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #EF4444;">Rezervasyonunuz Reddedildi</h2>
        <p>Merhaba ${reservation.userName},</p>
        <p>Maalesef araç rezervasyonunuz reddedilmiştir:</p>
        
        <div style="background-color: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #EF4444;">
          <h3 style="margin-top: 0; color: #333;">Rezervasyon Detayları</h3>
          <ul style="list-style: none; padding: 0;">
            <li><strong>Araç:</strong> ${car.brand} ${car.model} (${car.plate})</li>
            <li><strong>Tarih:</strong> ${reservation.date}</li>
            <li><strong>Saat:</strong> ${reservation.startTime} - ${reservation.endTime}</li>
            <li><strong>Red Sebebi:</strong> ${reservation.rejectionReason || "Sebep belirtilmemiş"}</li>
          </ul>
        </div>
        
        <p>Başka bir tarih için yeni rezervasyon yapabilirsiniz.</p>
        <p>Saygılarımızla,<br>${EMAIL_CONFIG.approverName}</p>
      </div>
    `,
  }),
};

// E-posta gönderme fonksiyonu
const sendEmail = async (to: string | string[], template: any) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"Araç Rezervasyon Sistemi" <${EMAIL_CONFIG.user}>`,
      to: to,
      subject: template.subject,
      html: template.html,
    };

    const result = await transporter.sendMail(mailOptions);
    logger.info("E-posta başarıyla gönderildi:", result.messageId);
    return result;
  } catch (error) {
    logger.error("E-posta gönderme hatası:", error);
    throw error;
  }
};

// Yeni rezervasyon oluşturulduğunda tetiklenir
export const onReservationCreated = onValueCreated(
  "/reservations/{reservationId}",
  async (event) => {
    try {
      const reservation = event.data.val();
      const reservationId = event.params.reservationId;
      
      logger.info("Yeni rezervasyon oluşturuldu:", reservationId);
      
      // Sadece pending durumundaki rezervasyonlar için e-posta gönder
      if (reservation.status !== "pending") {
        logger.info("Rezervasyon pending durumunda değil, e-posta gönderilmiyor");
        return;
      }
      
      // Araç bilgilerini al
      const carSnapshot = await admin.database()
        .ref(`/cars/${reservation.carId}`)
        .once("value");
      const car = carSnapshot.val();
      
      if (!car) {
        logger.error("Araç bilgisi bulunamadı:", reservation.carId);
        return;
      }
      
      // Yöneticiye e-posta gönder
      const template = emailTemplates.newReservation(reservation, car);
      await sendEmail(EMAIL_CONFIG.approverEmail, template);
      
      logger.info(`Yeni rezervasyon bildirimi ${EMAIL_CONFIG.approverEmail} adresine gönderildi.`);
    } catch (error) {
      logger.error("Rezervasyon oluşturma bildirimi hatası:", error);
    }
  }
);

// Rezervasyon durumu güncellendiğinde tetiklenir
export const onReservationUpdated = onValueUpdated(
  "/reservations/{reservationId}",
  async (event) => {
    try {
      const beforeData = event.data.before.val();
      const afterData = event.data.after.val();
      const reservationId = event.params.reservationId;
      
      logger.info("Rezervasyon güncellendi:", reservationId);
      
      // Durum değişikliği kontrolü
      if (beforeData.status === afterData.status) {
        logger.info("Durum değişikliği yok, e-posta gönderilmiyor");
        return;
      }
      
      // Sadece onay/red durumları için e-posta gönder
      if (!["approved", "rejected"].includes(afterData.status)) {
        logger.info("Durum onay/red değil, e-posta gönderilmiyor");
        return;
      }
      
      // Araç bilgilerini al
      const carSnapshot = await admin.database()
        .ref(`/cars/${afterData.carId}`)
        .once("value");
      const car = carSnapshot.val();
      
      if (!car) {
        logger.error("Araç bilgisi bulunamadı:", afterData.carId);
        return;
      }
      
      // Kullanıcıya e-posta gönder
      let template;
      if (afterData.status === "approved") {
        template = emailTemplates.approved(afterData, car);
      } else if (afterData.status === "rejected") {
        template = emailTemplates.rejected(afterData, car);
      }
      
      if (template) {
        await sendEmail(afterData.userEmail, template);
        logger.info(`Rezervasyon ${afterData.status} bildirimi gönderildi`);
      }
    } catch (error) {
      logger.error("Rezervasyon güncelleme bildirimi hatası:", error);
    }
  }
);

// Test e-postası gönderme endpoint'i
export const sendTestEmail = onRequest(async (req, res) => {
  // CORS header'larını ekle
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type");
  
  // OPTIONS isteği için hemen cevap ver
  if (req.method === "OPTIONS") {
    res.status(204).send("");
    return;
  }
  
  try {
    const testTemplate = {
      subject: "Test E-postası",
      html: `
        <h2>Firebase Functions + Nodemailer Test</h2>
        <p>Bu bir test e-postasıdır.</p>
        <p>Tarih: ${new Date().toLocaleString("tr-TR")}</p>
      `,
    };
    
    await sendEmail(EMAIL_CONFIG.approverEmail, testTemplate);
    
    res.json({
      success: true,
      message: `Test e-postası başarıyla ${EMAIL_CONFIG.approverEmail} adresine gönderildi.`,
    });
  } catch (error: any) {
    logger.error("Test e-postası gönderme hatası:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Bilinmeyen bir hata oluştu",
    });
  }
});
