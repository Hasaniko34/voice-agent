'use client'

import { useState, useEffect } from 'react';
import { FiPhone, FiPhoneOff, FiVolume2, FiMic, FiMicOff, FiClock, FiUser, FiStar, FiXCircle, FiVolumeX, FiHeart, FiX } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

// Son aranan numaralar demo verisi
const recentCalls = [
  { id: '1', name: 'Ahmet Yılmaz', number: '+90 555 123 4567', time: '5 dk önce' },
  { id: '2', name: 'Ayşe Demir', number: '+90 532 987 6543', time: '2 saat önce' },
  { id: '3', name: 'Fatma Öztürk', number: '+90 541 456 7890', time: 'Dün' },
  { id: '4', name: 'Mehmet Aydın', number: '+90 505 789 0123', time: '2 gün önce' },
  { id: '5', name: null, number: '+90 553 159 7531', time: '3 gün önce' },
];

// Favori numaralar demo verisi
const favoriteContacts = [
  { id: '1', name: 'Annem', number: '+90 555 111 2222' },
  { id: '2', name: 'Babam', number: '+90 555 333 4444' },
  { id: '3', name: 'Eşim', number: '+90 555 555 6666' },
];

export default function CallPage() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [callStatus, setCallStatus] = useState<'idle' | 'calling' | 'connected' | 'ended'>('idle');
  const [callSid, setCallSid] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [callDuration, setCallDuration] = useState(0);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
  const [showDialpad, setShowDialpad] = useState(false);
  const [activeTone, setActiveTone] = useState<string | null>(null);
  const [showRecentCalls, setShowRecentCalls] = useState(true);
  const [showFavorites, setShowFavorites] = useState(false);
  const [callerName, setCallerName] = useState<string | null>(null);

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

  // Format phone number as it's being typed
  const formatPhoneNumber = (number: string) => {
    // Example Turkish format: +90 555 123 4567
    const cleaned = number.replace(/\D/g, '');
    
    if (cleaned.length === 0) return '';
    
    if (cleaned.startsWith('90') && cleaned.length > 2) {
      // If starts with country code
      let formatted = '+90 ';
      if (cleaned.length > 2) formatted += cleaned.slice(2, 5);
      if (cleaned.length > 5) formatted += ' ' + cleaned.slice(5, 8);
      if (cleaned.length > 8) formatted += ' ' + cleaned.slice(8, 12);
      return formatted.trim();
    } else {
      // Add +90 prefix if not present and number is long enough
      if (cleaned.length >= 10) {
        let formatted = '+90 ';
        formatted += cleaned.slice(0, 3);
        if (cleaned.length > 3) formatted += ' ' + cleaned.slice(3, 6);
        if (cleaned.length > 6) formatted += ' ' + cleaned.slice(6, 10);
        return formatted.trim();
      }
      return number;
    }
  };

  // Handle dialpad button press
  const handleDialpadPress = (digit: string) => {
    setActiveTone(digit);
    setTimeout(() => setActiveTone(null), 150);
    
    // Append the digit to the phone number
    setPhoneNumber(prev => prev + digit);
    
    // If in a call, send DTMF tone
    if (callStatus === 'connected') {
      sendDtmfTone(digit);
    }
  };

  // Send DTMF tone during active call
  const sendDtmfTone = async (digit: string) => {
    if (!callSid) return;

    try {
      const response = await fetch('/api/twilio/call/dtmf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          callSid,
          digits: digit
        }),
      });

      if (!response.ok) {
        console.error('DTMF tonu gönderilemedi');
      }
    } catch (err) {
      console.error('DTMF tonu hatası:', err);
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
    
    // Find caller name if it's in recent calls or favorites
    const recentCall = recentCalls.find(call => call.number.replace(/\s/g, '') === formattedNumber.replace(/\+/g, ''));
    const favoriteContact = favoriteContacts.find(contact => contact.number.replace(/\s/g, '') === formattedNumber.replace(/\+/g, ''));
    setCallerName(recentCall?.name || favoriteContact?.name || null);
    
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
        setCallerName(null);
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

  // Toggle speaker mode
  const toggleSpeaker = async () => {
    // Bu fonksiyon gerçekten Twilio API ile çalışabilmek için backend entegrasyonu gerektirir
    // Şu an yalnızca UI gösterimi için durum değişimini yapıyoruz
    setIsSpeaker(!isSpeaker);
  };

  // Select phone number from recent or favorite
  const selectPhoneNumber = (number: string) => {
    setPhoneNumber(number);
  };

  // Add to favorites 
  const addToFavorites = (number: string, name: string | null) => {
    // Bu aslında backend işlemi olacak - sadece UI gösterimi
    alert(`${name || number} favori kişilere eklendi`);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">Telefon Ara</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
            <div className="p-6">
              {/* Phone Input and Call Button */}
              <div className="relative mb-6">
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={handlePhoneNumberChange}
                  disabled={callStatus !== 'idle'}
                  placeholder="+90 555 123 4567"
                  className="w-full px-12 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xl text-gray-900 font-medium"
                />
                {phoneNumber && (
                  <button 
                    onClick={() => setPhoneNumber('')}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <FiXCircle size={20} />
                  </button>
                )}
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                  <FiPhone size={20} className="text-gray-400" />
                </div>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center">
                  <FiXCircle className="mr-2 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Call Status Display */}
              <AnimatePresence mode="wait">
                {callStatus === 'idle' ? (
                  <motion.div 
                    key="idle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="mb-6 text-center"
                  >
                    {!showDialpad && (
                      <button
                        onClick={() => setShowDialpad(true)}
                        className="mb-3 px-4 py-2 text-sm text-blue-600 rounded-md hover:bg-blue-50"
                      >
                        Tuş Takımını Göster
                      </button>
                    )}
                  </motion.div>
                ) : callStatus === 'calling' ? (
                  <motion.div 
                    key="calling"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="mb-6 text-center"
                  >
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-blue-500 relative flex items-center justify-center">
                      <FiPhone size={32} className="text-white" />
                      <div className="absolute inset-0 rounded-full border-4 border-blue-300 animate-ping"></div>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">
                      {callerName || phoneNumber}
                    </h3>
                    <p className="text-gray-700">Aranıyor...</p>
                  </motion.div>
                ) : callStatus === 'connected' ? (
                  <motion.div 
                    key="connected"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="mb-6 text-center"
                  >
                    <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-green-100 border-4 border-green-500 flex items-center justify-center">
                      {callerName ? (
                        <span className="text-3xl font-bold text-green-600">
                          {callerName.charAt(0).toUpperCase()}
                        </span>
                      ) : (
                        <FiUser size={40} className="text-green-600" />
                      )}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">
                      {callerName || phoneNumber}
                    </h3>
                    <div className="flex items-center justify-center text-green-600 mb-3">
                      <FiClock className="mr-1" />
                      <span>{formatDuration(callDuration)}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-6">Görüşme devam ediyor</p>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="ended"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="mb-6 text-center"
                  >
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
                      <FiPhoneOff size={32} className="text-red-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">
                      Arama Sonlandırıldı
                    </h3>
                    <p className="text-gray-700">Süre: {formatDuration(callDuration)}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Dial Pad */}
              <AnimatePresence>
                {showDialpad && callStatus === 'idle' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-6"
                  >
                    <div className="grid grid-cols-3 gap-4">
                      {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map((digit) => (
                        <button
                          key={digit}
                          onClick={() => handleDialpadPress(digit)}
                          className={`p-4 rounded-lg font-medium text-2xl ${
                            activeTone === digit 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                          }`}
                        >
                          {digit}
                        </button>
                      ))}
                    </div>
                    <div className="mt-4 text-right">
                      <button
                        onClick={() => setShowDialpad(false)}
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        Tuş Takımını Gizle
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Call Actions */}
              <div className="flex justify-center space-x-5">
                {callStatus === 'idle' ? (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={startCall}
                    disabled={!phoneNumber}
                    className={`w-16 h-16 rounded-full flex items-center justify-center text-white shadow-lg ${
                      phoneNumber ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-400 cursor-not-allowed'
                    }`}
                    aria-label="Ara"
                  >
                    <FiPhone size={28} />
                  </motion.button>
                ) : callStatus === 'connected' ? (
                  <div className="flex items-center space-x-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={toggleMute}
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-white ${
                        isMuted ? 'bg-red-500' : 'bg-gray-600 hover:bg-gray-700'
                      }`}
                      aria-label={isMuted ? 'Mikrofonu Aç' : 'Mikrofonu Kapat'}
                    >
                      {isMuted ? <FiMicOff size={20} /> : <FiMic size={20} />}
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={endCall}
                      className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center text-white shadow-lg"
                      aria-label="Aramayı Sonlandır"
                    >
                      <FiPhoneOff size={28} />
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={toggleSpeaker}
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-white ${
                        isSpeaker ? 'bg-blue-500' : 'bg-gray-600 hover:bg-gray-700'
                      }`}
                      aria-label={isSpeaker ? 'Hoparlörü Kapat' : 'Hoparlörü Aç'}
                    >
                      {isSpeaker ? <FiVolume2 size={20} /> : <FiVolumeX size={20} />}
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowDialpad(!showDialpad)}
                      className="w-12 h-12 rounded-full bg-gray-600 hover:bg-gray-700 flex items-center justify-center text-white"
                      aria-label="Tuş Takımı"
                    >
                      <span className="font-bold">#</span>
                    </motion.button>
                  </div>
                ) : callStatus === 'calling' ? (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={endCall}
                    className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center text-white shadow-lg"
                    aria-label="Aramayı İptal Et"
                  >
                    <FiPhoneOff size={28} />
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setCallStatus('idle')}
                    className="w-16 h-16 rounded-full bg-blue-500 hover:bg-blue-600 flex items-center justify-center text-white shadow-lg"
                    aria-label="Yeni Arama"
                  >
                    <FiPhone size={28} />
                  </motion.button>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Recent Calls and Favorites Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
            <div className="border-b border-gray-200">
              <nav className="flex">
                <button
                  className={`px-4 py-3 font-medium text-sm flex-1 ${
                    showRecentCalls 
                      ? 'text-blue-600 border-b-2 border-blue-600' 
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                  onClick={() => {
                    setShowRecentCalls(true);
                    setShowFavorites(false);
                  }}
                >
                  Son Aramalar
                </button>
                <button
                  className={`px-4 py-3 font-medium text-sm flex-1 ${
                    showFavorites 
                      ? 'text-blue-600 border-b-2 border-blue-600' 
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                  onClick={() => {
                    setShowRecentCalls(false);
                    setShowFavorites(true);
                  }}
                >
                  Favoriler
                </button>
              </nav>
            </div>
            
            <div className="p-4">
              {showRecentCalls && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Son Aramalar</h3>
                  <ul className="space-y-3">
                    {recentCalls.map((call) => (
                      <li key={call.id} className="group">
                        <div 
                          className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
                          onClick={() => selectPhoneNumber(call.number)}
                        >
                          <div className="flex items-center">
                            <div className="bg-gray-100 rounded-full w-10 h-10 flex items-center justify-center mr-3">
                              {call.name ? (
                                <span className="text-sm font-medium text-gray-700">
                                  {call.name.charAt(0).toUpperCase()}
                                </span>
                              ) : (
                                <FiUser className="text-gray-500" />
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{call.name || 'Bilinmeyen Numara'}</p>
                              <p className="text-sm text-gray-700">{call.number}</p>
                              <p className="text-xs text-gray-500">{call.time}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                addToFavorites(call.number, call.name);
                              }}
                              className="p-1 text-gray-400 hover:text-red-500 rounded"
                              title="Favorilere Ekle"
                            >
                              <FiHeart size={16} />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                selectPhoneNumber(call.number);
                                startCall();
                              }}
                              className="p-1 text-gray-400 hover:text-green-500 rounded"
                              title="Ara"
                            >
                              <FiPhone size={16} />
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {showFavorites && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Favori Kişiler</h3>
                  <ul className="space-y-3">
                    {favoriteContacts.map((contact) => (
                      <li key={contact.id} className="group">
                        <div 
                          className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
                          onClick={() => selectPhoneNumber(contact.number)}
                        >
                          <div className="flex items-center">
                            <div className="bg-red-100 rounded-full w-10 h-10 flex items-center justify-center mr-3">
                              <span className="text-sm font-medium text-red-700">
                                {contact.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{contact.name}</p>
                              <p className="text-sm text-gray-700">{contact.number}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                selectPhoneNumber(contact.number);
                                startCall();
                              }}
                              className="p-1 text-gray-400 hover:text-green-500 rounded"
                              title="Ara"
                            >
                              <FiPhone size={16} />
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 