'use client'

import { useState, useEffect } from 'react';
import { FiPhone, FiPhoneOff, FiVolume2, FiMic, FiMicOff } from 'react-icons/fi';

export default function CallPage() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [callStatus, setCallStatus] = useState<'idle' | 'calling' | 'connected' | 'ended'>('idle');
  const [callSid, setCallSid] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [callDuration, setCallDuration] = useState(0);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  // Call timer
  useEffect(() => {
    if (callStatus === 'connected' && !intervalId) {
      const id = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
      setIntervalId(id);
    } else if (callStatus !== 'connected' && intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
      if (callStatus === 'idle') {
        setCallDuration(0);
      }
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [callStatus, intervalId]);

  // Format call duration as mm:ss
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle phone number input
  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Allow only numbers, +, and spaces
    if (/^[0-9+\s]*$/.test(value) || value === '') {
      setPhoneNumber(value);
    }
  };

  // Initiate a call
  const startCall = async () => {
    if (!phoneNumber) {
      setError('Lütfen bir telefon numarası girin');
      return;
    }

    // Format phone number (remove spaces)
    const formattedNumber = phoneNumber.replace(/\s/g, '');
    
    try {
      setCallStatus('calling');
      setError(null);
      
      const response = await fetch('/api/twilio/call', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: formattedNumber
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Arama başlatılamadı');
      }

      const { callSid } = await response.json();
      setCallSid(callSid);
      setCallStatus('connected');
    } catch (err) {
      console.error('Arama hatası:', err);
      setError(`Arama yapılırken bir hata oluştu: ${(err as Error).message}`);
      setCallStatus('idle');
    }
  };

  // End the call
  const endCall = async () => {
    if (!callSid) return;

    try {
      const response = await fetch('/api/twilio/call', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          callSid
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Arama sonlandırılamadı');
      }

      setCallStatus('ended');
      
      // Reset after 3 seconds
      setTimeout(() => {
        setCallStatus('idle');
        setCallSid(null);
      }, 3000);
    } catch (err) {
      console.error('Arama sonlandırma hatası:', err);
      setError(`Arama sonlandırılırken bir hata oluştu: ${(err as Error).message}`);
    }
  };

  // Toggle mute
  const toggleMute = async () => {
    if (!callSid) return;

    try {
      const response = await fetch('/api/twilio/call/mute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          callSid,
          mute: !isMuted
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Mikrofon durumu değiştirilemedi');
      }

      setIsMuted(!isMuted);
    } catch (err) {
      console.error('Mikrofon değiştirme hatası:', err);
      setError(`Mikrofon durumu değiştirilirken bir hata oluştu: ${(err as Error).message}`);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8">Telefon Ara</h1>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 max-w-lg mx-auto">
        <div className="mb-6">
          <label htmlFor="phoneNumber" className="block text-gray-700 font-medium mb-2">
            Telefon Numarası
          </label>
          <input
            type="tel"
            id="phoneNumber"
            value={phoneNumber}
            onChange={handlePhoneNumberChange}
            disabled={callStatus !== 'idle'}
            placeholder="+90 555 123 4567"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
          />
          <p className="mt-2 text-sm text-gray-500">
            Örnek: +90 555 123 4567 (Uluslararası format)
          </p>
        </div>
        
        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
            {error}
          </div>
        )}
        
        <div className="flex flex-col items-center">
          {callStatus === 'idle' && (
            <button
              onClick={startCall}
              className="w-16 h-16 rounded-full bg-green-500 hover:bg-green-600 flex items-center justify-center text-white"
              aria-label="Ara"
            >
              <FiPhone size={28} />
            </button>
          )}
          
          {callStatus === 'calling' && (
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center text-white mx-auto mb-4 animate-pulse">
                <FiPhone size={28} />
              </div>
              <p className="text-gray-700">Aranıyor...</p>
            </div>
          )}
          
          {callStatus === 'connected' && (
            <div className="text-center">
              <div className="flex gap-4 mb-4">
                <button
                  onClick={toggleMute}
                  className={`w-12 h-12 rounded-full ${isMuted ? 'bg-red-500' : 'bg-gray-500'} flex items-center justify-center text-white`}
                  aria-label={isMuted ? 'Mikrofonu Aç' : 'Mikrofonu Kapat'}
                >
                  {isMuted ? <FiMicOff size={20} /> : <FiMic size={20} />}
                </button>
                
                <button
                  onClick={endCall}
                  className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center text-white"
                  aria-label="Aramayı Sonlandır"
                >
                  <FiPhoneOff size={28} />
                </button>
                
                <div
                  className="w-12 h-12 rounded-full bg-gray-500 flex items-center justify-center text-white"
                  aria-label="Ses"
                >
                  <FiVolume2 size={20} />
                </div>
              </div>
              
              <div>
                <p className="text-green-600 font-semibold">Bağlandı</p>
                <p className="text-gray-700">Süre: {formatDuration(callDuration)}</p>
              </div>
            </div>
          )}
          
          {callStatus === 'ended' && (
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-gray-400 flex items-center justify-center text-white mx-auto mb-4">
                <FiPhoneOff size={28} />
              </div>
              <p className="text-gray-700">Arama sonlandırıldı</p>
              <p className="text-gray-500">Süre: {formatDuration(callDuration)}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 