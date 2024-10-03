import '../styles/global.css'; // Global stilleri import et

export default function App({ Component, pageProps }) {
    return <Component {...pageProps} />; // Tüm sayfa bileşenlerini render et
}