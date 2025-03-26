'use client'

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiMic, FiPhone, FiUsers, FiBarChart2, FiHeadphones, FiArrowRight, FiCheck, FiPlayCircle } from 'react-icons/fi';

export default function Home() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const features = [
    {
      icon: <FiMic size={24} className="text-indigo-600" />,
      title: 'Sesli Asistanlar',
      description: 'Özelleştirilmiş sesli asistanlarla işlerinizi otomatize edin ve kullanıcı deneyimini geliştirin.'
    },
    {
      icon: <FiPhone size={24} className="text-indigo-600" />,
      title: 'Telefon Çağrıları',
      description: 'Twilio entegrasyonu ile otomatik telefon görüşmeleri yapın ve yönetin.'
    },
    {
      icon: <FiUsers size={24} className="text-indigo-600" />,
      title: 'Müşteri Hizmetleri',
      description: 'Müşteri sorguları ve destek taleplerini yapay zeka ile yanıtlayın.'
    },
    {
      icon: <FiBarChart2 size={24} className="text-indigo-600" />,
      title: 'Analitik Veriler',
      description: 'Görüşme analizleri ve istatistiklerle performansı ölçün ve optimizasyon yapın.'
    }
  ];

  const useCases = [
    {
      title: 'Satış Otomasyonu',
      description: 'Potansiyel müşteri aramaları, ürün tanıtımları ve satış takibi için sesli asistanları kullanın.',
      icon: <FiHeadphones size={48} className="text-indigo-500" />,
      color: 'bg-indigo-50',
      borderColor: 'border-indigo-200'
    },
    {
      title: 'Müşteri Desteği',
      description: 'Teknik sorunlar, sorular ve şikayetlere anında yanıt veren sesli destekle müşteri memnuniyetini arttırın.',
      icon: <FiUsers size={48} className="text-blue-500" />,
      color: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      title: 'Hatırlatmalar & Bilgilendirmeler',
      description: 'Randevu hatırlatmaları, bilgilendirme aramaları ve anketler için otomatik sesli aramalar yapın.',
      icon: <FiPhone size={48} className="text-purple-500" />,
      color: 'bg-purple-50',
      borderColor: 'border-purple-200'
    }
  ];

  // Ses dalgası animasyonu için noktalar
  const wavePoints = Array.from({ length: 64 }).map((_, i) => i);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-indigo-50">
      {/* Hero Section */}
      <header className="relative overflow-hidden">
        {/* Gradyanlı arka plan yuvarlakları */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-100 rounded-full opacity-70 blur-3xl"></div>
        <div className="absolute top-96 -left-24 w-64 h-64 bg-blue-100 rounded-full opacity-70 blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 sm:pt-24 sm:pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={fadeIn}
            >
              <div className="inline-block px-4 py-1 rounded-full bg-indigo-100 text-indigo-700 font-medium text-sm mb-6">
                Gerçek Zamanlı Sesli Asistan
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Yapay Zeka ile <span className="text-indigo-600">Sesli İletişim</span> Deneyimini Dönüştürün
              </h1>
              <p className="mt-6 text-xl text-gray-600 max-w-2xl">
                Twilio ve GPT entegrasyonu ile güçlendirilmiş yapay zeka sesli asistanlarınızı oluşturun, yönetin ve ölçekleyin.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link 
                  href="/auth"
                  className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Başlayın
                  <FiArrowRight className="ml-2 inline" />
                </Link>
                <button 
                  className="px-6 py-3 bg-white text-indigo-600 font-medium rounded-lg border border-indigo-200 hover:bg-indigo-50 transition-colors flex items-center"
                  onClick={() => setIsVideoModalOpen(true)}
                >
                  <FiPlayCircle className="mr-2" />
                  Nasıl Çalışır?
                </button>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative flex justify-center"
            >
              <div className="relative w-full max-w-md">
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-2xl opacity-10 blur-xl transform -rotate-6"></div>
                <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                  <div className="px-6 py-4 bg-indigo-600 text-white">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">Sesli Asistan Demo</div>
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 rounded-full bg-red-400"></div>
                        <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                        <div className="w-2 h-2 rounded-full bg-green-400"></div>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 bg-gray-50">
                    <div className="flex items-start space-x-4 mb-4">
                      <div className="flex-shrink-0 bg-indigo-100 rounded-full p-2">
                        <FiMic className="text-indigo-600" size={20} />
                      </div>
                      <div className="flex-1 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                        <p className="text-gray-800">Merhaba, size nasıl yardımcı olabilirim?</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4 mb-4 justify-end">
                      <div className="flex-1 bg-indigo-600 p-4 rounded-lg shadow-sm text-white">
                        <p>Bugün için planlanmış aramalarımı göster.</p>
                      </div>
                      <div className="flex-shrink-0 bg-indigo-100 rounded-full p-2">
                        <FiUsers className="text-indigo-600" size={20} />
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 bg-indigo-100 rounded-full p-2">
                        <FiMic className="text-indigo-600" size={20} />
                      </div>
                      <div className="flex-1 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                        <div className="font-medium text-gray-900 mb-2">Bugünkü Planlanmış Aramalar:</div>
                        <ul className="space-y-2 text-sm text-gray-700">
                          <li className="flex items-center">
                            <FiCheck className="text-green-500 mr-2" /> Müşteri Memnuniyet Anketi - 15 kişi
                          </li>
                          <li className="flex items-center">
                            <FiCheck className="text-green-500 mr-2" /> Yeni Ürün Tanıtımı - 8 kişi
                          </li>
                        </ul>
                      </div>
                    </div>
                    
                    {/* Ses Dalgası Animasyonu */}
                    <div className="mt-6 flex justify-center items-center">
                      <div className="flex items-center space-x-1 h-10">
                        {wavePoints.map((i) => (
                          <motion.div
                            key={i}
                            className="w-1 bg-indigo-500 rounded-full"
                            animate={{
                              height: isPlaying 
                                ? `${Math.sin(Date.now() / 200 + i / 5) * 8 + 10}px` 
                                : "4px"
                            }}
                            transition={{
                              duration: 0.15,
                              repeat: Infinity,
                              repeatType: "reverse"
                            }}
                            style={{ opacity: isPlaying ? 0.7 : 0.3 }}
                          />
                        ))}
                      </div>
                      <button 
                        className="ml-4 p-2 rounded-full bg-indigo-100 text-indigo-600 hover:bg-indigo-200 transition-colors"
                        onClick={() => setIsPlaying(!isPlaying)}
                      >
                        {isPlaying ? <FiMic /> : <FiMic />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </header>

      {/* Özellikler Bölümü */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Güçlü Özellikler
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              Yapay zeka ses asistanlarımızın sunduğu özelliklerle iş süreçlerinizi otomatikleştirin.
            </p>
          </div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                variants={fadeIn}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* İstatistikler Bölümü */}
      <section className="py-16 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="text-4xl font-bold">%40</div>
              <div className="mt-2 text-indigo-100">Operasyonel Verimlilik Artışı</div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <div className="text-4xl font-bold">%35</div>
              <div className="mt-2 text-indigo-100">Müşteri Memnuniyeti Artışı</div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="text-4xl font-bold">24/7</div>
              <div className="mt-2 text-indigo-100">Kesintisiz Hizmet</div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <div className="text-4xl font-bold">+1000</div>
              <div className="mt-2 text-indigo-100">Günlük Otomatik Çağrı</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Kullanım Senaryoları */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Kullanım Senaryoları
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              Yapay zeka sesli asistanlarımızın çeşitli sektörlerde nasıl kullanılabileceğini keşfedin.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {useCases.map((useCase, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true, margin: "-50px" }}
                className={`${useCase.color} border ${useCase.borderColor} rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow`}
              >
                <div className="mb-4">
                  {useCase.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{useCase.title}</h3>
                <p className="text-gray-700">{useCase.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-2xl shadow-xl overflow-hidden">
            <div className="px-6 py-12 md:p-12 md:flex md:items-center md:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white sm:text-3xl">
                  Yapay Zeka Sesli Asistanlarınızı Oluşturmaya Başlayın
                </h2>
                <p className="mt-3 max-w-3xl text-indigo-100">
                  Gelişmiş yapay zeka teknolojisi ve Twilio entegrasyonu ile işlerinizi otomatikleştirin ve müşteri deneyimini geliştirin.
                </p>
              </div>
              <div className="mt-8 md:mt-0 flex flex-shrink-0">
                <Link 
                  href="/auth"
                  className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-indigo-600 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-white"
                >
                  Hemen Başlayın
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Realtime Voice Assistant</h3>
              <p className="text-gray-400">
                Yapay zeka tabanlı sesli asistanlarla iş süreçlerinizi otomatikleştirin.
              </p>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">Özellikler</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Sesli Asistanlar</li>
                <li>Telefon Çağrıları</li>
                <li>Müşteri Hizmetleri</li>
                <li>Analitik</li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">Kaynaklar</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Dokümantasyon</li>
                <li>API Referansı</li>
                <li>Blog</li>
                <li>SSS</li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">İletişim</h4>
              <ul className="space-y-2 text-gray-400">
                <li>info@example.com</li>
                <li>+90 (212) 555 12 34</li>
                <li>İstanbul, Türkiye</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400 text-sm">
            <p>&copy; {new Date().getFullYear()} Realtime Voice Assistant. Tüm hakları saklıdır.</p>
          </div>
        </div>
      </footer>

      {/* Video Modal */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-medium">Nasıl Çalışır?</h3>
              <button 
                onClick={() => setIsVideoModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4">
              <div className="aspect-w-16 aspect-h-9">
                <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center">
                  <p className="text-gray-500">Video burada görüntülenecek</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
