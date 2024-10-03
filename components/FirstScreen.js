import { useState } from 'react';
//import { useRouter } from 'next/router';

export default function FirstScreen({ setSelectedFiles, goToNextStep }) {
    const [isSelectingFiles, setIsSelectingFiles] = useState(false); // Dosya seçim ekranının görünürlüğü
    //const router = useRouter(); // Next.js'in yönlendirme hook'u
    const [localSelectedFiles, setLocalSelectedFiles] = useState([]); // Geçici dosya listesi

    const handleFileChange = (event) => {
        const files = Array.from(event.target.files);
        setLocalSelectedFiles(files); // Geçici dosyaları state'e ayarlama
    };

    const handleUploadClick = () => {
        if (localSelectedFiles.length > 0) {
            setSelectedFiles(localSelectedFiles); // Seçilen dosyaları ana state'e ayarlama
            goToNextStep(); // İkinci sayfaya yönlendirme
        } else {
            alert('Lütfen en az bir dosya seçin.');
        }
    };

    return (
        <div className="first-screen">
            <div className="header-text">
                <p>ÇAĞLA & İRFAN</p>
            </div>

            {isSelectingFiles ? ( // Dosya seçim ekranı
                <>
                    <input
                        type="file"
                        multiple
                        accept="image/*, video/*"
                        onChange={handleFileChange}
                    />
                    <b>Tek seferde en fazla 50 adet fotoğraf 10 adet video yükleyebilirsiniz.</b>
                    <button onClick={handleUploadClick}>Devam Et</button>
                    <button onClick={() => setIsSelectingFiles(false)}>Vazgeç</button>
                </>
            ) : ( // İlk ekran
                <>
                    <div className="footer-content">
                        <h3 className="footer-content2">
                            Bu mutlu günümüzde bizi yalnız bırakmadığın için sana çok teşekkür ediyoruz
                        </h3>
                        <button onClick={() => setIsSelectingFiles(true)}>
                            Fotoğraf ya da Video Yükle
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}