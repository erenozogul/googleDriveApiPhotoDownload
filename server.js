const express = require('express');
const multer = require('multer');
const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');
const cors = require('cors');  // CORS modülünü dahil et

// Google Drive API ayarları
const KEYFILEPATH = path.join(__dirname, 'service-account-file.json');  // Service Account JSON dosyasının yolu
const SCOPES = ['https://www.googleapis.com/auth/drive.file'];

// Google Drive istemcisi
const auth = new google.auth.GoogleAuth({
    keyFile: KEYFILEPATH,
    scopes: SCOPES,
});

const driveService = google.drive({ version: 'v3', auth });

// Express Uygulaması
const app = express();

// CORS'u etkinleştir
app.use(cors());  // Tüm kaynaklara izin verir
// Eğer sadece belirli bir origin'e izin vermek istersen:
// app.use(cors({ origin: 'http://localhost:3000' }));

const upload = multer({ dest: 'uploads/' });  // Dosyaları geçici olarak kaydet

// Google Drive'a dosya yükleme fonksiyonu
async function uploadFileToDrive(filePath, fileName) {
    try {
        const fileMetadata = {
            name: fileName,
            parents: ['1cQC2kz4JmyqCrf205iBgQkjbKrkWRcd1'] // Drive dizin ID'si
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
        res.status(500).send('Dosya yüklenemedi: ' + error.message);
    }
});

// Sunucuyu dinleme
const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Sunucu çalışıyor: http://localhost:${PORT}`);
});