'use client'

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { FiMic, FiSlash } from 'react-icons/fi';
import Link from 'next/link';

// Basit bir sesli asistan arayüzü bileşeni
export default function VoiceInterface() {
  const [isListening, setIsListening] = useState(false);
  const [message, setMessage] = useState('Mikrofona tıklayarak konuşmaya başlayın');
  
  const toggleMicrophone = () => {
    // Mikrofon durumunu değiştir
    setIsListening(!isListening);
    
    if (!isListening) {
      setMessage('Dinleniyor... (Bu demo sürümünde gerçek konuşma tanıma devre dışı)');
      
      // Demo: 3 saniye sonra yanıt ver
      setTimeout(() => {
        setMessage('Size nasıl yardımcı olabilirim?');
        setIsListening(false);
      }, 3000);
    } else {
      setMessage('Mikrofona tıklayarak konuşmaya başlayın');
    }
  };
  
  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col items-center justify-center">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Sesli Asistanınız</h2>
        <p className="text-gray-600">
          Özelleştirilmiş asistanlarınızı kullanmak için{' '}
          <Link href="/dashboard/voice-agents" className="text-blue-600 hover:underline">
            Voice Agents
          </Link>{' '}
          bölümüne gidin.
        </p>
      </div>
      
      <div className="mb-10">
        <button 
          onClick={toggleMicrophone}
          className={`w-24 h-24 rounded-full flex items-center justify-center transition-colors ${
            isListening ? 'bg-red-100' : 'bg-blue-100 hover:bg-blue-200'
          }`}
        >
          {isListening ? (
            <FiSlash size={40} className="text-red-500" />
          ) : (
            <FiMic size={40} className="text-blue-600" />
          )}
        </button>
      </div>
      
      <div className="p-6 w-full bg-white rounded-lg shadow-sm border border-gray-200 min-h-[120px]">
        <p className="text-xl text-center text-gray-800">
          {message}
        </p>
      </div>
    </div>
  );
} 