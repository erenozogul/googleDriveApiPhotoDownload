
export default function ThirdScreen({ onReset }) {
    return (
        <div className="third-screen">
            <h2>Yükleme Tamamlandı, Teşekkürler!</h2>
            <button onClick={onReset}>Yeniden Yükle</button>
        </div>
    );
}