import { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import loadingImage from '../components/loading.gif'; // Yükleme simgesi dosya yolu

export default function SecondScreen({ selectedFiles, setSelectedFiles, goToNextStep }) {
    const [isUploading, setIsUploading] = useState(false); // Yükleme durumu
    const router = useRouter(); // Next.js yönlendirme için useRouter kullanıyoruz

    const handleRemoveFile = (index) => {
        const updatedFiles = selectedFiles.filter((_, i) => i !== index);
        setSelectedFiles(updatedFiles);
    };

    const handleUpload = async () => {
        const formData = new FormData();
        selectedFiles.forEach((file) => {
            formData.append('files', file);
        });

        setIsUploading(true); // Yükleme işlemi başlıyor

        try {
            // Sunucu URL'sini kontrol edin
            const response = await axios.post('http://localhost:8080/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            if (response.status === 200) {
                goToNextStep(); // Yükleme tamamlandığında üçüncü sayfaya yönlendirme
            } else {
                console.error('Yükleme hatası:', response.statusText);
            }
        } catch (error) {
            console.error('Yükleme hatası:', error);
        } finally {
            setIsUploading(false); // Yükleme işlemi tamamlandı
        }
    };

    return (
        <div className="second-screen">
            <p>Yüklemek istenilen dosyalar</p>
            {isUploading ? ( // Yükleme durumu
                <div className="uploading-message">
                    <img src={loadingImage} alt="Yükleniyor..." className="loading-image" />
                    <div>Yükleme tamamlanıyor, lütfen bekleyiniz...</div>
                </div>
            ) : (
                <>
                    <ul className="file-list">
                        {selectedFiles.map((file, index) => (
                            <li key={index} className="file-item">
                                <span className="file-preview">
                                    {file.type.startsWith('image/') ? (
                                        <img
                                            src={URL.createObjectURL(file)}
                                            alt={file.name}
                                            className="file-thumbnail"
                                        />
                                    ) : (
                                        <video
                                            src={URL.createObjectURL(file)}
                                            alt={file.name}
                                            className="file-thumbnail"
                                            controls
                                        />
                                    )}
                                </span>
                                <span className="file-name">{file.name}</span>
                                <span
                                    className="remove-icon"
                                    onClick={() => handleRemoveFile(index)}
                                    role="button"
                                    aria-label="Sil"
                                >
                                    &times; {/* Çarpı simgesi */}
                                </span>
                            </li>
                        ))}
                    </ul>
                    <div className="button-container">
                        <button onClick={handleUpload} className="upload-button">Yükle</button>
                        <button onClick={() => router.back()} style={{ backgroundColor: 'red', color: 'white' }}>
                            Geri Dön
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}