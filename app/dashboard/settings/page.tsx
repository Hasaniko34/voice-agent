'use client'

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  FiUser, 
  FiLock, 
  FiKey, 
  FiSave, 
  FiRefreshCw, 
  FiSliders, 
  FiPhoneCall, 
  FiAlertCircle,
  FiCheck,
  FiMic
} from 'react-icons/fi';

export default function SettingsPage() {
  const router = useRouter();
  
  // State değişkenleri
  const [activeTab, setActiveTab] = useState<'profile' | 'api' | 'preferences'>('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');
  
  // Profil ayarları
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    company: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // API ayarları
  const [apiSettings, setApiSettings] = useState({
    twilioAccountSid: '',
    twilioAuthToken: '',
    twilioPhoneNumber: '',
    openaiApiKey: ''
  });
  
  // Tercih ayarları
  const [preferences, setPreferences] = useState({
    defaultVoice: 'shimmer',
    defaultLanguage: 'tr',
    darkMode: false,
    emailNotifications: true,
    saveTranscripts: true
  });
  
  // Kullanıcı bilgilerini yükle
  useEffect(() => {
    const loadUserData = () => {
      try {
        const userData = localStorage.getItem('user');
        if (userData) {
          const user = JSON.parse(userData);
          setProfile(prev => ({
            ...prev,
            name: user.name || '',
            email: user.email || '',
            company: user.company || ''
          }));
        }
      } catch (error) {
        console.error('Kullanıcı bilgileri yüklenemedi:', error);
      }
    };
    
    loadUserData();
  }, []);
  
  // Form değişiklik işleyicileri
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };
  
  const handleApiChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setApiSettings(prev => ({ ...prev, [name]: value }));
  };
  
  const handlePreferenceChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setPreferences(prev => ({ ...prev, [name]: checked }));
    } else {
      setPreferences(prev => ({ ...prev, [name]: value }));
    }
  };
  
  // Form gönderme işleyicileri
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSaveSuccess(false);
    setSaveError('');
    
    // Şifre değişikliği kontrolü
    if (profile.newPassword && profile.newPassword !== profile.confirmPassword) {
      setSaveError('Yeni şifre ve onay şifresi eşleşmiyor.');
      setIsLoading(false);
      return;
    }
    
    try {
      // Burada gerçek bir API çağrısı yapılabilir
      // Şimdilik sadece bir bekleme süresi ekleyeceğiz
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Başarılı sonuç
      setSaveSuccess(true);
      
      // Şifre alanlarını temizle
      setProfile(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
      
      // Kullanıcı bilgilerini localStorage'a kaydet
      const userData = localStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        localStorage.setItem('user', JSON.stringify({
          ...user,
          name: profile.name,
          company: profile.company
        }));
      }
    } catch (error) {
      console.error('Profil güncellenirken hata:', error);
      setSaveError('Profil güncellenirken bir hata oluştu.');
    } finally {
      setIsLoading(false);
      
      // 3 saniye sonra başarı mesajını kaldır
      if (saveSuccess) {
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    }
  };
  
  const handleApiSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSaveSuccess(false);
    setSaveError('');
    
    try {
      // Burada gerçek bir API çağrısı yapılabilir
      // Şimdilik sadece bir bekleme süresi ekleyeceğiz
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Başarılı sonuç
      setSaveSuccess(true);
      
      // API ayarlarını localStorage'a kaydet
      localStorage.setItem('apiSettings', JSON.stringify(apiSettings));
    } catch (error) {
      console.error('API ayarları güncellenirken hata:', error);
      setSaveError('API ayarları güncellenirken bir hata oluştu.');
    } finally {
      setIsLoading(false);
      
      // 3 saniye sonra başarı mesajını kaldır
      if (saveSuccess) {
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    }
  };
  
  const handlePreferencesSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSaveSuccess(false);
    setSaveError('');
    
    try {
      // Burada gerçek bir API çağrısı yapılabilir
      // Şimdilik sadece bir bekleme süresi ekleyeceğiz
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Başarılı sonuç
      setSaveSuccess(true);
      
      // Tercihleri localStorage'a kaydet
      localStorage.setItem('preferences', JSON.stringify(preferences));
    } catch (error) {
      console.error('Tercihler güncellenirken hata:', error);
      setSaveError('Tercihler güncellenirken bir hata oluştu.');
    } finally {
      setIsLoading(false);
      
      // 3 saniye sonra başarı mesajını kaldır
      if (saveSuccess) {
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    }
  };
  
  // Animasyon varyantları
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 }
    }
  };
  
  return (
    <motion.div 
      className="p-6 max-w-7xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Ayarlar</h1>
        <p className="text-gray-600 mb-8">
          Hesap ayarlarınızı ve uygulama tercihlerinizi yönetin
        </p>
      </motion.div>
      
      {/* Başarı / Hata Mesajları */}
      {saveSuccess && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center"
        >
          <FiCheck className="mr-2 text-green-500" />
          <span>Değişiklikler başarıyla kaydedildi.</span>
        </motion.div>
      )}
      
      {saveError && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center"
        >
          <FiAlertCircle className="mr-2 text-red-500" />
          <span>{saveError}</span>
        </motion.div>
      )}
      
      {/* Sekmeler */}
      <div className="border-b border-gray-200 mb-8">
        <div className="flex flex-wrap -mb-px">
          <button
            className={`mr-8 inline-block pb-4 font-medium text-sm border-b-2 ${
              activeTab === 'profile' 
                ? 'border-indigo-600 text-indigo-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('profile')}
          >
            <div className="flex items-center">
              <FiUser className="mr-2" />
              <span>Profil</span>
            </div>
          </button>
          
          <button
            className={`mr-8 inline-block pb-4 font-medium text-sm border-b-2 ${
              activeTab === 'api' 
                ? 'border-indigo-600 text-indigo-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('api')}
          >
            <div className="flex items-center">
              <FiKey className="mr-2" />
              <span>API Ayarları</span>
            </div>
          </button>
          
          <button
            className={`mr-8 inline-block pb-4 font-medium text-sm border-b-2 ${
              activeTab === 'preferences' 
                ? 'border-indigo-600 text-indigo-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('preferences')}
          >
            <div className="flex items-center">
              <FiSliders className="mr-2" />
              <span>Tercihler</span>
            </div>
          </button>
        </div>
      </div>
      
      {/* Profil Formu */}
      {activeTab === 'profile' && (
        <motion.div 
          variants={itemVariants}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Profil Bilgileri</h2>
          
          <form onSubmit={handleProfileSubmit}>
            <div className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Ad Soyad
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={profile.name}
                  onChange={handleProfileChange}
                  className="block w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                  placeholder="Adınız ve soyadınız"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  E-posta Adresi
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={profile.email}
                  onChange={handleProfileChange}
                  className="block w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 bg-gray-100"
                  placeholder="E-posta adresiniz"
                  disabled
                />
                <p className="mt-1 text-xs text-gray-500">E-posta adresi değiştirilemez.</p>
              </div>
              
              <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                  Şirket
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={profile.company}
                  onChange={handleProfileChange}
                  className="block w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                  placeholder="Şirketinizin adı"
                />
              </div>
              
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-md font-medium text-gray-900 mb-4">Şifre Değiştir</h3>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      Mevcut Şifre
                    </label>
                    <input
                      type="password"
                      id="currentPassword"
                      name="currentPassword"
                      value={profile.currentPassword}
                      onChange={handleProfileChange}
                      className="block w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                      placeholder="Mevcut şifreniz"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      Yeni Şifre
                    </label>
                    <input
                      type="password"
                      id="newPassword"
                      name="newPassword"
                      value={profile.newPassword}
                      onChange={handleProfileChange}
                      className="block w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                      placeholder="Yeni şifreniz"
                    />
                    <p className="mt-1 text-xs text-gray-500">Şifreniz en az 6 karakter olmalıdır.</p>
                  </div>
                  
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      Şifre Tekrar
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={profile.confirmPassword}
                      onChange={handleProfileChange}
                      className="block w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                      placeholder="Yeni şifrenizi tekrar girin"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 flex justify-end">
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-indigo-400 disabled:cursor-not-allowed flex items-center"
              >
                {isLoading ? (
                  <>
                    <FiRefreshCw className="animate-spin mr-2" />
                    <span>Kaydediliyor...</span>
                  </>
                ) : (
                  <>
                    <FiSave className="mr-2" />
                    <span>Değişiklikleri Kaydet</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      )}
      
      {/* API Ayarları Formu */}
      {activeTab === 'api' && (
        <motion.div 
          variants={itemVariants}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-6">API Ayarları</h2>
          
          <form onSubmit={handleApiSubmit}>
            <div className="space-y-6">
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-md font-medium text-gray-900 mb-4 flex items-center">
                  <FiPhoneCall className="mr-2 text-indigo-600" />
                  Twilio Ayarları
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="twilioAccountSid" className="block text-sm font-medium text-gray-700 mb-1">
                      Twilio Account SID
                    </label>
                    <input
                      type="text"
                      id="twilioAccountSid"
                      name="twilioAccountSid"
                      value={apiSettings.twilioAccountSid}
                      onChange={handleApiChange}
                      className="block w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                      placeholder="AC..."
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="twilioAuthToken" className="block text-sm font-medium text-gray-700 mb-1">
                      Twilio Auth Token
                    </label>
                    <input
                      type="password"
                      id="twilioAuthToken"
                      name="twilioAuthToken"
                      value={apiSettings.twilioAuthToken}
                      onChange={handleApiChange}
                      className="block w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                      placeholder="Twilio Auth Token"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="twilioPhoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                      Twilio Telefon Numarası
                    </label>
                    <input
                      type="text"
                      id="twilioPhoneNumber"
                      name="twilioPhoneNumber"
                      value={apiSettings.twilioPhoneNumber}
                      onChange={handleApiChange}
                      className="block w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                      placeholder="+1..."
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-md font-medium text-gray-900 mb-4 flex items-center">
                  <FiMic className="mr-2 text-indigo-600" />
                  AI API Ayarları
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="openaiApiKey" className="block text-sm font-medium text-gray-700 mb-1">
                      OpenAI API Key
                    </label>
                    <input
                      type="password"
                      id="openaiApiKey"
                      name="openaiApiKey"
                      value={apiSettings.openaiApiKey}
                      onChange={handleApiChange}
                      className="block w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                      placeholder="sk-..."
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 flex justify-end">
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-indigo-400 disabled:cursor-not-allowed flex items-center"
              >
                {isLoading ? (
                  <>
                    <FiRefreshCw className="animate-spin mr-2" />
                    <span>Kaydediliyor...</span>
                  </>
                ) : (
                  <>
                    <FiSave className="mr-2" />
                    <span>API Ayarlarını Kaydet</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      )}
      
      {/* Tercihler Formu */}
      {activeTab === 'preferences' && (
        <motion.div 
          variants={itemVariants}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Uygulama Tercihleri</h2>
          
          <form onSubmit={handlePreferencesSubmit}>
            <div className="space-y-6">
              <h3 className="text-md font-medium text-gray-900 mb-4">Ses Asistanı Ayarları</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="defaultVoice" className="block text-sm font-medium text-gray-700 mb-1">
                    Varsayılan Ses
                  </label>
                  <select
                    id="defaultVoice"
                    name="defaultVoice"
                    value={preferences.defaultVoice}
                    onChange={handlePreferenceChange}
                    className="block w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                  >
                    <option value="alloy">Alloy</option>
                    <option value="echo">Echo</option>
                    <option value="fable">Fable</option>
                    <option value="onyx">Onyx</option>
                    <option value="nova">Nova</option>
                    <option value="shimmer">Shimmer</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="defaultLanguage" className="block text-sm font-medium text-gray-700 mb-1">
                    Varsayılan Dil
                  </label>
                  <select
                    id="defaultLanguage"
                    name="defaultLanguage"
                    value={preferences.defaultLanguage}
                    onChange={handlePreferenceChange}
                    className="block w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                  >
                    <option value="tr">Türkçe</option>
                    <option value="en">İngilizce</option>
                  </select>
                </div>
              </div>
              
              <h3 className="text-md font-medium text-gray-900 mt-6 mb-4">Kullanıcı Arayüzü</h3>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="darkMode"
                    name="darkMode"
                    checked={preferences.darkMode}
                    onChange={handlePreferenceChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="darkMode" className="ml-2 block text-sm text-gray-900">
                    Karanlık Mod
                  </label>
                </div>
              </div>
              
              <h3 className="text-md font-medium text-gray-900 mt-6 mb-4">Bildirimler ve Veri</h3>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="emailNotifications"
                    name="emailNotifications"
                    checked={preferences.emailNotifications}
                    onChange={handlePreferenceChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="emailNotifications" className="ml-2 block text-sm text-gray-900">
                    E-posta Bildirimleri
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="saveTranscripts"
                    name="saveTranscripts"
                    checked={preferences.saveTranscripts}
                    onChange={handlePreferenceChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="saveTranscripts" className="ml-2 block text-sm text-gray-900">
                    Arama Transkriptlerini Kaydet
                  </label>
                </div>
              </div>
            </div>
            
            <div className="mt-8 flex justify-end">
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-indigo-400 disabled:cursor-not-allowed flex items-center"
              >
                {isLoading ? (
                  <>
                    <FiRefreshCw className="animate-spin mr-2" />
                    <span>Kaydediliyor...</span>
                  </>
                ) : (
                  <>
                    <FiSave className="mr-2" />
                    <span>Tercihleri Kaydet</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      )}
    </motion.div>
  );
} 