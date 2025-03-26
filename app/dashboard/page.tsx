'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  FiMic, 
  FiPhone, 
  FiUsers, 
  FiBarChart2, 
  FiPlus, 
  FiClock, 
  FiList, 
  FiArrowRight, 
  FiCheck, 
  FiSettings,
  FiAlertCircle
} from 'react-icons/fi';

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Yükleme animasyonu için 800ms bekletme
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

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

  // Demo veriler
  const stats = [
    { 
      title: 'Aktif Ses Asistanları', 
      value: '3', 
      change: '+2', 
      isPositive: true, 
      icon: <FiMic className="h-6 w-6 text-indigo-500" /> 
    },
    { 
      title: 'Bugünkü Aramalar', 
      value: '28', 
      change: '+12', 
      isPositive: true, 
      icon: <FiPhone className="h-6 w-6 text-blue-500" /> 
    },
    { 
      title: 'Bekleyen Planlı Aramalar', 
      value: '47', 
      change: '-5', 
      isPositive: false, 
      icon: <FiList className="h-6 w-6 text-purple-500" /> 
    },
    { 
      title: 'Ortalama Arama Süresi', 
      value: '2:34', 
      change: '-0:12', 
      isPositive: true, 
      icon: <FiClock className="h-6 w-6 text-green-500" /> 
    }
  ];

  const quickActions = [
    { 
      title: 'Yeni Ses Asistanı', 
      description: 'Özel yapay zeka ses asistanı oluşturun', 
      icon: <FiMic />, 
      bgColor: 'bg-indigo-50', 
      textColor: 'text-indigo-600',
      href: '/dashboard/voice-agents/create'
    },
    { 
      title: 'Telefonla Ara', 
      description: 'Hızlı sesli asistan araması başlatın', 
      icon: <FiPhone />, 
      bgColor: 'bg-blue-50', 
      textColor: 'text-blue-600',
      href: '/dashboard/call'
    },
    { 
      title: 'Planlı Arama Oluştur', 
      description: 'Toplu aramalar planlayın', 
      icon: <FiList />, 
      bgColor: 'bg-purple-50', 
      textColor: 'text-purple-600',
      href: '/dashboard/planned-calls'
    },
    { 
      title: 'Ayarları Düzenle', 
      description: 'Twilio ve API ayarlarını yapılandırın', 
      icon: <FiSettings />, 
      bgColor: 'bg-gray-50', 
      textColor: 'text-gray-600',
      href: '/dashboard/settings'
    }
  ];

  const recentCalls = [
    { 
      id: 1, 
      name: 'Ahmet Yılmaz', 
      phone: '+90 532 123 4567', 
      time: '12:35', 
      duration: '2:12', 
      status: 'Tamamlandı', 
      statusColor: 'bg-green-100 text-green-800' 
    },
    { 
      id: 2, 
      name: 'Ayşe Kaya', 
      phone: '+90 555 987 6543', 
      time: '11:20', 
      duration: '1:45', 
      status: 'Tamamlandı', 
      statusColor: 'bg-green-100 text-green-800' 
    },
    { 
      id: 3, 
      name: 'Mehmet Demir', 
      phone: '+90 542 456 7890', 
      time: '10:05', 
      duration: '0:47', 
      status: 'Yarıda Kesildi', 
      statusColor: 'bg-yellow-100 text-yellow-800' 
    },
    { 
      id: 4, 
      name: 'Zeynep Şahin', 
      phone: '+90 533 789 0123', 
      time: '09:12', 
      duration: '3:24', 
      status: 'Tamamlandı', 
      statusColor: 'bg-green-100 text-green-800' 
    }
  ];

  const plannedCalls = [
    { 
      id: 1, 
      title: 'Müşteri Memnuniyet Anketi', 
      scheduled: 'Bugün, 15:00',
      targetCount: 15,
      completedCount: 7,
      status: 'Devam Ediyor',
      statusColor: 'bg-blue-100 text-blue-800',
      progress: 47
    },
    { 
      id: 2, 
      title: 'Yeni Ürün Tanıtımı', 
      scheduled: 'Bugün, 16:30',
      targetCount: 8,
      completedCount: 0,
      status: 'Planlandı',
      statusColor: 'bg-indigo-100 text-indigo-800',
      progress: 0
    },
    { 
      id: 3, 
      title: 'Randevu Hatırlatması', 
      scheduled: 'Yarın, 09:00',
      targetCount: 22,
      completedCount: 0,
      status: 'Planlandı',
      statusColor: 'bg-indigo-100 text-indigo-800',
      progress: 0
    }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen w-full">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="p-6 max-w-7xl mx-auto"
    >
      {/* Başlık ve Tarih */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <motion.div variants={itemVariants}>
          <h1 className="text-2xl font-bold text-gray-900">Hoş Geldiniz</h1>
          <p className="text-gray-600">{new Date().toLocaleDateString('tr-TR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </motion.div>
        
        <motion.div variants={itemVariants} className="mt-4 md:mt-0">
          <div className="flex items-center space-x-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-lg">
            <FiAlertCircle />
            <span className="text-sm font-medium">Sistem Durumu: Normal</span>
          </div>
        </motion.div>
      </div>
      
      {/* İstatistikler */}
      <motion.div 
        variants={itemVariants}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        {stats.map((stat, index) => (
          <div 
            key={index} 
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <div className="p-3 rounded-lg bg-gray-50">{stat.icon}</div>
            </div>
            <div className={`mt-4 flex items-center text-sm ${stat.isPositive ? 'text-green-600' : 'text-red-600'}`}>
              <span>{stat.change}</span>
              <span className="ml-2 text-gray-600">son 24 saat</span>
            </div>
          </div>
        ))}
      </motion.div>
      
      {/* Hızlı Erişim Kartları */}
      <motion.div variants={itemVariants} className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-gray-900">Hızlı Erişim</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) => (
            <Link 
              href={action.href} 
              key={index}
              className={`${action.bgColor} ${action.textColor} p-6 rounded-xl border border-gray-100 hover:shadow-md transition-all group flex flex-col h-full`}
            >
              <div className={`p-3 rounded-full ${action.textColor} bg-white w-12 h-12 flex items-center justify-center mb-4`}>
                {action.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2">{action.title}</h3>
              <p className="text-sm opacity-80 mb-3">{action.description}</p>
              <div className="mt-auto flex items-center text-sm font-medium">
                <span>Başla</span>
                <FiArrowRight className="ml-2 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </motion.div>
      
      {/* İki Sütunlu Yapı - Son Aramalar ve Planlanmış Aramalar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Son Aramalar */}
        <motion.div variants={itemVariants} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-gray-900">Son Aramalar</h2>
            <Link 
              href="/dashboard/call-history" 
              className="text-sm font-medium text-indigo-600 hover:text-indigo-500 flex items-center"
            >
              Tümünü Gör <FiArrowRight className="ml-1" />
            </Link>
          </div>
          
          <div className="space-y-4">
            {recentCalls.map((call) => (
              <div key={call.id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-900">{call.name}</p>
                    <p className="text-sm text-gray-600">{call.phone}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${call.statusColor}`}>
                    {call.status}
                  </span>
                </div>
                <div className="mt-2 flex items-center text-sm text-gray-600">
                  <span className="mr-3">Saat: {call.time}</span>
                  <span>Süre: {call.duration}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
        
        {/* Planlanmış Aramalar */}
        <motion.div variants={itemVariants} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-gray-900">Planlı Aramalar</h2>
            <Link 
              href="/dashboard/planned-calls" 
              className="text-sm font-medium text-indigo-600 hover:text-indigo-500 flex items-center"
            >
              Tümünü Gör <FiArrowRight className="ml-1" />
            </Link>
          </div>
          
          <div className="space-y-5">
            {plannedCalls.map((call) => (
              <div key={call.id} className="border-b border-gray-100 pb-5 last:border-0 last:pb-0">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-900">{call.title}</p>
                    <p className="text-sm text-gray-600">Zaman: {call.scheduled}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${call.statusColor}`}>
                    {call.status}
                  </span>
                </div>
                <div className="mt-2 flex items-center justify-between text-sm text-gray-600">
                  <span>Hedef: {call.targetCount} kişi</span>
                  <span>Tamamlanan: {call.completedCount}</span>
                </div>
                <div className="mt-3 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-indigo-500 rounded-full"
                    style={{ width: `${call.progress}%` }}
                  ></div>
                </div>
                <div className="mt-1 text-xs text-right text-gray-600">
                  %{call.progress} tamamlandı
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
} 