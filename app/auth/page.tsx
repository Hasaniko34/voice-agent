'use client'

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiUser, FiArrowRight, FiChevronLeft, FiGlobe, FiEye, FiEyeOff, FiAlertCircle } from 'react-icons/fi';

export default function Auth() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    company: ''
  });
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    name: '',
    company: ''
  });

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Form doğrulama
    let isValid = true;
    const newErrors = {
      email: '',
      password: '',
      name: '',
      company: ''
    };
    
    if (!formData.email) {
      newErrors.email = 'E-posta adresi gerekli';
      isValid = false;
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Geçerli bir e-posta adresi girin';
      isValid = false;
    }
    
    if (!formData.password) {
      newErrors.password = 'Şifre gerekli';
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'Şifre en az 6 karakter olmalı';
      isValid = false;
    }
    
    if (!isLogin) {
      if (!formData.name) {
        newErrors.name = 'Ad Soyad gerekli';
        isValid = false;
      }
    }
    
    setErrors(newErrors);
    setApiError('');
    
    if (isValid) {
      // API'ye istek gönder
      setIsLoading(true);
      
      try {
        const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
        
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Bir hata oluştu');
        }
        
        // Token'ı yerel depolamaya kaydet
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        console.log(isLogin ? 'Giriş başarılı' : 'Kayıt başarılı');
        
        // Dashboard'a yönlendir
        router.push('/dashboard');
      } catch (error) {
        console.error('Auth error:', error);
        setApiError((error as Error).message);
        setIsLoading(false);
      }
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Kullanıcı yazmaya başladığında hataları temizle
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
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
    <div className="min-h-screen w-full flex flex-col md:flex-row">
      {/* Sol taraf - Görsel Bölüm */}
      <div className="bg-indigo-600 text-white md:w-2/5 p-8 md:p-12 flex flex-col justify-between relative overflow-hidden">
        {/* Dekoratif dalgalar */}
        <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-indigo-500 rounded-full opacity-50"></div>
        <div className="absolute top-32 -right-16 w-64 h-64 bg-purple-500 rounded-full opacity-30"></div>
        
        {/* Geri butonu */}
        <div className="z-10">
          <Link href="/" className="inline-flex items-center text-indigo-100 hover:text-white transition-colors">
            <FiChevronLeft className="mr-2" />
            <span>Ana Sayfaya Dön</span>
          </Link>
        </div>
        
        {/* Başlık ve açıklama */}
        <div className="z-10 my-auto py-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Sesli Asistanlarla İletişimi Dönüştürün</h1>
            <p className="text-indigo-100 text-lg mb-8">
              Twilio ve yapay zeka entegrasyonu ile sesli asistanlarınızı oluşturun ve müşteri deneyimini geliştirin.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="bg-indigo-500/30 p-2 rounded-full mr-4">
                  <FiUser className="text-indigo-100" />
                </div>
                <div>
                  <h3 className="font-medium">Kişiselleştirilmiş Deneyim</h3>
                  <p className="text-indigo-200 text-sm">Her müşteri için özel etkileşimler tasarlayın</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-indigo-500/30 p-2 rounded-full mr-4">
                  <FiGlobe className="text-indigo-100" />
                </div>
                <div>
                  <h3 className="font-medium">7/24 Hizmet</h3>
                  <p className="text-indigo-200 text-sm">Müşterilerinizle her zaman iletişimde kalın</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Alt bilgi */}
        <div className="text-sm text-indigo-200 z-10">
          &copy; {new Date().getFullYear()} Sesli Asistan. Tüm hakları saklıdır.
        </div>
      </div>
      
      {/* Sağ taraf - Form */}
      <motion.div 
        className="md:w-3/5 bg-white p-8 md:p-12 lg:p-16 flex items-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-md mx-auto w-full">
          <motion.div variants={itemVariants}>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {isLogin ? 'Hesabınıza Giriş Yapın' : 'Yeni Hesap Oluşturun'}
            </h2>
            <p className="text-gray-600 mb-8">
              {isLogin 
                ? 'Sesli asistan yönetim panelinize erişin' 
                : 'Sesli asistanları hemen kullanmaya başlayın'}
            </p>
          </motion.div>
          
          {/* API Hata Mesajı */}
          {apiError && (
            <motion.div 
              variants={itemVariants}
              className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start"
            >
              <FiAlertCircle className="text-red-500 mr-3 mt-0.5 flex-shrink-0" />
              <p className="text-red-700 text-sm">{apiError}</p>
            </motion.div>
          )}
          
          <form onSubmit={handleSubmit}>
            {/* Kayıt formu alanları */}
            {!isLogin && (
              <>
                <motion.div variants={itemVariants} className="mb-4">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Ad Soyad</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiUser className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`block w-full pl-10 pr-3 py-2.5 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-gray-900`}
                      placeholder="Adınız ve soyadınız"
                    />
                  </div>
                  {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                </motion.div>
                
                <motion.div variants={itemVariants} className="mb-4">
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">Şirket (İsteğe bağlı)</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiGlobe className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                      placeholder="Şirketinizin adı"
                    />
                  </div>
                </motion.div>
              </>
            )}
            
            {/* Email ve şifre alanları */}
            <motion.div variants={itemVariants} className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">E-posta Adresi</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-2.5 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-gray-900`}
                  placeholder="ornek@sirket.com"
                />
              </div>
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </motion.div>
            
            <motion.div variants={itemVariants} className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Şifre</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-10 py-2.5 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-gray-900`}
                  placeholder={isLogin ? "Şifreniz" : "En az 6 karakter"}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <FiEyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <FiEye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
              
              {isLogin && (
                <div className="text-right mt-1">
                  <a href="#" className="text-sm text-indigo-600 hover:text-indigo-500">
                    Şifrenizi mi unuttunuz?
                  </a>
                </div>
              )}
            </motion.div>
            
            {/* Giriş/Kayıt butonu */}
            <motion.div variants={itemVariants}>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-75 transition-colors"
              >
                {isLoading ? (
                  <>
                    <span className="mr-2 inline-block h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
                    <span>{isLogin ? 'Giriş Yapılıyor...' : 'Hesap Oluşturuluyor...'}</span>
                  </>
                ) : (
                  <>
                    <span>{isLogin ? 'Giriş Yap' : 'Hesap Oluştur'}</span>
                    <FiArrowRight className="ml-2" />
                  </>
                )}
              </button>
            </motion.div>
            
            {/* Form geçiş bağlantısı */}
            <motion.div variants={itemVariants} className="mt-6 text-center text-sm">
              <p className="text-gray-600">
                {isLogin ? 'Hesabınız yok mu?' : 'Zaten hesabınız var mı?'}{' '}
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-indigo-600 font-medium hover:text-indigo-500"
                >
                  {isLogin ? 'Hemen Kaydolun' : 'Giriş Yapın'}
                </button>
              </p>
            </motion.div>
          </form>
        </div>
      </motion.div>
    </div>
  );
} 