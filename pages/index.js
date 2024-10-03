import FirstScreen from '../components/FirstScreen';
import SecondScreen from '../components/SecondScreen';
import ThirdScreen from '../components/ThirdScreen';
import { useState } from 'react';

export default function Home() {
    const [selectedFiles, setSelectedFiles] = useState([]); // Seçilen dosyaların state'i
    const [currentStep, setCurrentStep] = useState(1); // Geçerli adım

    // Adım değiştirici
    const goToNextStep = () => {
        setCurrentStep(currentStep + 1);
    };

    // Yeniden yükleme işlemi
    const handleReset = () => {
        setSelectedFiles([]); // Seçilen dosyaları temizle
        setCurrentStep(1); // İlk adıma geri dön
    };
    
    return (
        <>
            {currentStep === 1 && <FirstScreen setSelectedFiles={setSelectedFiles} goToNextStep={goToNextStep} />}
            {currentStep === 2 && <SecondScreen selectedFiles={selectedFiles} setSelectedFiles={setSelectedFiles} goToNextStep={goToNextStep} />}
            {currentStep === 3 && <ThirdScreen onReset={handleReset} />}
        </>
    );
}