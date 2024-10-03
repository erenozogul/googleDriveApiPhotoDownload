import multer from 'multer';
import nextConnect from 'next-connect';
import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const encryptedFilePath = path.join(process.cwd(), 'service-account-file.json.enc');

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

// Multer middleware setup for file uploads
const upload = multer({ dest: 'uploads/' });

// API route with next-connect for handling the file uploads
const apiRoute = nextConnect({
    onError(error, req, res) {
        res.status(501).json({ error: `Hata: ${error.message}` });
    },
    onNoMatch(req, res) {
        res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
    },
});

apiRoute.use(upload.array('files', 100)); // Aynı anda 100 dosyaya kadar izin veriyoruz

// Dosya yükleme işlemi için post isteği
apiRoute.post(async (req, res) => {
    try {
        const files = req.files; // Çoklu dosyaları alıyoruz
        if (!files || files.length === 0) {
            return res.status(400).send('Dosya yok.');
        }

        const fileIds = [];

        // Dosyaları Google Drive'a yükleme
        for (const file of files) {
            const fileMetadata = {
                name: file.originalname,
                parents: ['1cQC2kz4JmyqCrf205iBgQkjbKrkWRcd1'], // Drive dizin ID'si
            };
            const media = {
                mimeType: file.mimetype,
                body: fs.createReadStream(file.path),
            };

            const response = await driveService.files.create({
                resource: fileMetadata,
                media: media,
                fields: 'id',
            });

            fileIds.push(response.data.id);

            // Geçici dosyayı siliyoruz
            fs.unlinkSync(file.path);
        }

        // Başarılı yükleme sonucu
        res.status(200).json({ fileIds });
    } catch (error) {
        console.error('Hata:', error);
        res.status(500).send('Dosya yüklenemedi: ' + error.message);
    }
});

// Next.js API config - bodyParser'ı devre dışı bırakıyoruz çünkü multer kullanıyoruz
export const config = {
    api: {
        bodyParser: false,
    },
};

export default apiRoute;