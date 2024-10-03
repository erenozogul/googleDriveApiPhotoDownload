import SecondScreen from '../components/SecondScreen';
import { useState } from 'react';

export default function Second() {
    const [selectedFiles, setSelectedFiles] = useState([]); // Seçilen dosyaların state'i

    return <SecondScreen selectedFiles={selectedFiles} setSelectedFiles={setSelectedFiles} />;
}