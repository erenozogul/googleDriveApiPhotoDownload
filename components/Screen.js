import { useState } from 'react';
import axios from 'axios';

// Ana bileşen
export default function Screens() {
    const [currentScreen, setCurrentScreen] = useState('first'); // Başlangıç ekranı
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [isSelectingFiles, setIsSelectingFiles] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [localSelectedFiles, setLocalSelectedFiles] = useState([]);

    const handleFileChange = (event) => {
        const files = Array.from(event.target.files);
        setLocalSelectedFiles(files);
    };

    const handleUploadClick = () => {
        if (localSelectedFiles.length > 0) {
            setSelectedFiles(localSelectedFiles);
            setCurrentScreen('second'); // İkinci ekrana geçiş
        } else {
            alert('Lütfen en az bir dosya seçin.');
        }
    };

    const handleRemoveFile = (index) => {
        const updatedFiles = selectedFiles.filter((_, i) => i !== index);
        setSelectedFiles(updatedFiles);
    };

    const handleUpload = async () => {
        const formData = new FormData();
        selectedFiles.forEach((file) => {
            formData.append('files', file);
        });

        setIsUploading(true);

        try {
            const response = await axios.post('http://localhost:8080/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            if (response.status === 200) {
                setCurrentScreen('third'); // Yükleme tamamlandıktan sonra üçüncü ekrana geçiş
            } else {
                console.error('Yükleme hatası:', response.statusText);
            }
        } catch (error) {
            console.error('Yükleme hatası:', error);
        } finally {
            setIsUploading(false);
        }
    };

    const handleReset = () => {
        setSelectedFiles([]);
        setCurrentScreen('first'); // İlk ekrana geri dön
    };

    return (
        <div className="screens-wrapper">
            {currentScreen === 'first' && (
                <div className="first-screen">
                    <div className="header-text">
                        <p>ÇAĞLA & İRFAN</p>
                    </div>

                    {isSelectingFiles ? (
                        <>
                            <input
                                type="file"
                                multiple
                                name="files"
                                accept="image/*, video/*"
                                onChange={handleFileChange}
                            />
                            <b>Tek seferde en fazla 50 adet fotoğraf 10 adet video yükleyebilirsiniz.</b>
                            <button onClick={handleUploadClick}>Devam Et</button>
                            <button
                                onClick={() => setIsSelectingFiles(false)}
                                className="vazgeç-button"
                            >
                                Vazgeç
                            </button>
                        </>
                    ) : (
                        <div className="footer-content">
                            <h3 className="footer-content2">
                                Bu mutlu günümüzde bizi yalnız bırakmadığın için sana çok teşekkür ediyoruz
                            </h3>
                            <button onClick={() => setIsSelectingFiles(true)}>
                                Fotoğraf ya da Video Yükle
                            </button>
                        </div>
                    )}
                </div>
            )}

            {currentScreen === 'second' && (
                <div className="second-screen">
                    <p>Yüklemek istenilen dosyalar</p>
                    {isUploading ? (
                        <div className="uploading-message">
                            <img src="/loading.gif" alt="Yükleniyor..." className="loading-image" />
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
                                            &times;
                                        </span>
                                    </li>
                                ))}
                            </ul>
                            <div className="button-container">
                                <button onClick={handleUpload} className="upload-button">Yükle</button>
                                <button
                                    onClick={() => setCurrentScreen('first')}
                                    style={{ backgroundColor: 'red', color: 'white' }}
                                >
                                    Geri Dön
                                </button>
                            </div>
                        </>
                    )}
                </div>
            )}

            {currentScreen === 'third' && (
                <div className="third-screen">
                    <h2>Yükleme Tamamlandı, Teşekkürler!</h2>
                    <button onClick={handleReset}>Yeniden Yükle</button>
                </div>
            )}
        </div>
    );
}