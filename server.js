const express = require('express');
const multer = require('multer');
const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const crypto = require('crypto');
require('dotenv').config(); // .env dosyasını yükleyin

// Şifreli dosyanın yolu
const encryptedFilePath = path.join(__dirname, 'service-account-file.json.enc'); // .enc uzantısını ekleyin

// Deşifre fonksiyonu
function decryptFile(encryptedFilePath, password) {
    const encryptedData = fs.readFileSync(encryptedFilePath);

    const iv = encryptedData.slice(0, 16); // İlk 16 byte IV
    const encryptedText = encryptedData.slice(16);

    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(password), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return decrypted.toString();
}

// Şifreyi .env dosyasından al
const password = process.env.SERVICE_ACCOUNT_PASSWORD;
const decryptedJson = decryptFile(encryptedFilePath, password);

// Deşifre edilmiş JSON'u kullan
const serviceAccount = JSON.parse(decryptedJson);

// Google Drive API ayarları
const SCOPES = ['https://www.googleapis.com/auth/drive.file'];

// Google Drive istemcisi
const auth = new google.auth.GoogleAuth({
    credentials: serviceAccount, // Deşifre edilmiş bilgileri kullan
    scopes: SCOPES,
});

const driveService = google.drive({ version: 'v3', auth });

// Express Uygulaması
const app = express();

// CORS'u etkinleştir
app.use(cors()); // Tüm kaynaklara izin verir

// Middleware for parsing multipart/form-data
app.use(express.json()); // JSON verileri için

const upload = multer({ dest: 'uploads/' }); // Dosyaları geçici olarak kaydet

// Google Drive'a dosya yükleme fonksiyonu
async function uploadFileToDrive(filePath, fileName) {
    try {
        const fileMetadata = {
            name: fileName,
            parents: ['1cQC2kz4JmyqCrf205iBgQkjbKrkWRcd1'], // Drive dizin ID'si
        };
        const media = {
            mimeType: 'image/jpeg', // Dosya tipine göre değiştir
            body: fs.createReadStream(filePath),
        };

        const response = await driveService.files.create({
            resource: fileMetadata,
            media: media,
            fields: 'id',
        });

        return response.data.id;
    } catch (error) {
        console.error('Hata:', error);
        throw error;
    }
}

// POST isteğiyle gelen dosyaları yükle
app.post('/upload', upload.array('files', 100), async (req, res) => {
    try {
        const files = req.files; // Çoklu dosyaları al
        if (!files || files.length === 0) {
            return res.status(400).send('Dosya yok.'); // Hata mesajı güncellendi
        }

        const fileIds = [];

        for (const file of files) {
            const fileId = await uploadFileToDrive(file.path, file.originalname);
            fileIds.push(fileId);

            // Geçici dosyayı sil
            fs.unlinkSync(file.path);
        }

        res.send({ fileIds }); // Tüm dosya ID'lerini döndür
    } catch (error) {
        console.error('Hata:', error); // Hata logu
        res.status(500).send('Dosya yüklenemedi: ' + error.message);
    }
});

// Sunucuyu dinleme
const PORT = process.env.PORT || 8080; // Port'u çevresel değişkenden al
app.listen(PORT, () => {
    console.log(`Sunucu çalışıyor: http://localhost:${PORT}`);
});