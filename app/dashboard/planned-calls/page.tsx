'use client'

import { useState } from 'react';
import { FiCalendar, FiClock, FiPhone, FiPlus, FiTrash2, FiEdit, FiUsers, FiRepeat, FiX, FiCheck, FiSearch, FiUpload, FiDownload, FiMic, FiFile } from 'react-icons/fi';

// Demo voice agent verileri
const demoVoiceAgents = [
  { id: '1', name: 'Doğal Satış Asistanı', description: 'Satış görüşmeleri için optimize edilmiş ses asistanı' },
  { id: '2', name: 'Müşteri Hizmetleri Asistanı', description: 'Müşteri sorunlarını çözmek için tasarlanmış asistan' },
  { id: '3', name: 'Anket Asistanı', description: 'Anket ve geri bildirim toplamak için özelleştirilmiş asistan' },
  { id: '4', name: 'Bilgi Verme Asistanı', description: 'Ürün ve hizmet bilgilendirmesi yapmak için tasarlanmış asistan' },
];

// Demo planlı arama verileri
const demoPlannedCalls = [
  {
    id: '1',
    name: 'Müşteri Memnuniyet Anketi',
    description: 'Mevcut müşterilerimize memnuniyet anketi yapılacak',
    scheduledDate: '2023-04-05',
    scheduledTime: '10:00',
    targetCount: 150,
    completedCount: 0,
    status: 'scheduled',
    frequency: 'once',
    voiceAgentId: '3',
    contacts: [
      { id: '1', name: 'Ahmet Yılmaz', phoneNumber: '+90 555 123 4567' },
      { id: '2', name: 'Ayşe Demir', phoneNumber: '+90 532 987 6543' },
      { id: '3', name: 'Mehmet Kaya', phoneNumber: '+90 541 456 7890' },
      // ... ve diğer kişiler
    ]
  },
  {
    id: '2',
    name: 'Ürün Tanıtımı',
    description: 'Yeni ürün tanıtımı için potansiyel müşterilere arama',
    scheduledDate: '2023-04-10',
    scheduledTime: '14:30',
    targetCount: 75,
    completedCount: 0,
    status: 'scheduled',
    frequency: 'once',
    voiceAgentId: '1',
    contacts: [
      { id: '4', name: 'Zeynep Özkan', phoneNumber: '+90 505 789 0123' },
      { id: '5', name: 'Mustafa Çelik', phoneNumber: '+90 533 246 8135' },
      // ... ve diğer kişiler
    ]
  },
  {
    id: '3',
    name: 'Aylık Hizmet Hatırlatması',
    description: 'Abonelere aylık hizmet hatırlatması',
    scheduledDate: '2023-04-01',
    scheduledTime: '09:00',
    targetCount: 200,
    completedCount: 45,
    status: 'in_progress',
    frequency: 'monthly',
    voiceAgentId: '4',
    contacts: [
      { id: '6', name: 'Fatma Yıldız', phoneNumber: '+90 542 975 3108' },
      { id: '7', name: 'Emre Şahin', phoneNumber: '+90 553 159 7531' },
      // ... ve diğer kişiler
    ]
  },
  {
    id: '4',
    name: 'Borç Hatırlatması',
    description: 'Ödemesi gecikmiş müşterilere hatırlatma',
    scheduledDate: '2023-03-28',
    scheduledTime: '11:15',
    targetCount: 50,
    completedCount: 50,
    status: 'completed',
    frequency: 'once',
    voiceAgentId: '2',
    contacts: [
      // ... kişi listesi
    ]
  },
  {
    id: '5',
    name: 'Yıllık Kontrol Araması',
    description: 'VIP müşterilerimize yıllık kontrol araması',
    scheduledDate: '2023-05-15',
    scheduledTime: '13:00',
    targetCount: 25,
    completedCount: 0,
    status: 'scheduled',
    frequency: 'yearly',
    voiceAgentId: '4',
    contacts: [
      // ... kişi listesi
    ]
  }
];

export default function PlannedCallsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFileUploadModalOpen, setIsFileUploadModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'scheduled' | 'in_progress' | 'completed'>('all');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  // Filtreleme fonksiyonu
  const filteredCalls = demoPlannedCalls.filter(call => {
    const matchesSearch = 
      call.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      call.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      filterStatus === 'all' || 
      call.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });
  
  // Durum badge renkleri
  const getStatusBadgeClass = (status: string) => {
    switch(status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Durum metni
  const getStatusText = (status: string) => {
    switch(status) {
      case 'scheduled':
        return 'Planlandı';
      case 'in_progress':
        return 'Devam Ediyor';
      case 'completed':
        return 'Tamamlandı';
      default:
        return status;
    }
  };
  
  // Frekans metni
  const getFrequencyText = (frequency: string) => {
    switch(frequency) {
      case 'once':
        return 'Bir Kez';
      case 'daily':
        return 'Günlük';
      case 'weekly':
        return 'Haftalık';
      case 'monthly':
        return 'Aylık';
      case 'yearly':
        return 'Yıllık';
      default:
        return frequency;
    }
  };

  // Dosya seçimi işleyicisi
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };
  
  // Voice Agent adını al
  const getVoiceAgentName = (agentId: string) => {
    const agent = demoVoiceAgents.find(a => a.id === agentId);
    return agent ? agent.name : 'Ses Asistanı';
  };
  
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">Planlı Aramalar</h1>
      
      {/* Arama ve Filtreleme */}
      <div className="flex flex-col md:flex-row justify-between gap-4 bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-1 max-w-md">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Planlı arama ara..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <select
            className="border border-gray-300 rounded-md py-2 px-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
          >
            <option value="all">Tüm Durumlar</option>
            <option value="scheduled">Planlandı</option>
            <option value="in_progress">Devam Ediyor</option>
            <option value="completed">Tamamlandı</option>
          </select>
          
          <button
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onClick={() => setIsModalOpen(true)}
          >
            <FiPlus className="mr-2" />
            Yeni Planlı Arama
          </button>
        </div>
      </div>
      
      {/* Planlı Aramalar Listesi */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredCalls.length === 0 ? (
          <div className="col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center text-gray-600">
            <p>Görüntülenecek planlı arama bulunamadı.</p>
          </div>
        ) : (
          filteredCalls.map((call) => (
            <div key={call.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{call.name}</h2>
                    <p className="mt-1 text-gray-700">{call.description}</p>
                    <div className="mt-2 flex items-center">
                      <FiMic className="text-blue-500 mr-1" />
                      <span className="text-sm text-gray-700">
                        {getVoiceAgentName(call.voiceAgentId)}
                      </span>
                    </div>
                  </div>
                  <span 
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(call.status)}`}
                  >
                    {getStatusText(call.status)}
                  </span>
                </div>
                
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="flex items-center text-sm text-gray-700">
                    <FiCalendar className="mr-2 text-gray-500" />
                    <span>{call.scheduledDate}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-700">
                    <FiClock className="mr-2 text-gray-500" />
                    <span>{call.scheduledTime}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-700">
                    <FiUsers className="mr-2 text-gray-500" />
                    <span>{call.targetCount} Kişi</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-700">
                    <FiRepeat className="mr-2 text-gray-500" />
                    <span>{getFrequencyText(call.frequency)}</span>
                  </div>
                </div>
                
                <div className="mt-4">
                  <div className="relative pt-1">
                    <div className="flex mb-2 items-center justify-between">
                      <div>
                        <span className="text-xs font-semibold inline-block text-blue-700">
                          İlerleme
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-semibold inline-block text-blue-700">
                          {Math.round((call.completedCount / call.targetCount) * 100)}%
                        </span>
                      </div>
                    </div>
                    <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
                      <div 
                        style={{ width: `${(call.completedCount / call.targetCount) * 100}%` }} 
                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                      ></div>
                    </div>
                    <span className="text-xs text-gray-700">{call.completedCount} / {call.targetCount} tamamlandı</span>
                  </div>
                </div>
              </div>
              
              <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex justify-between">
                <button
                  className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  onClick={() => {/* Kişileri görüntüle */}}
                >
                  <FiUsers className="mr-1" /> Kişileri Görüntüle
                </button>
                
                <div className="flex space-x-2">
                  <button
                    className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    onClick={() => {/* Düzenle */}}
                  >
                    <FiEdit className="mr-1" />
                  </button>
                  
                  {call.status !== 'completed' && (
                    <button
                      className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      onClick={() => {/* Aramaları başlat */}}
                    >
                      <FiPhone className="mr-1" /> {call.status === 'in_progress' ? 'Devam Et' : 'Başlat'}
                    </button>
                  )}
                  
                  <button
                    className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    onClick={() => {/* Sil */}}
                  >
                    <FiTrash2 className="mr-1" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      {/* Yeni Planlı Arama Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">Yeni Planlı Arama Oluştur</h3>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setIsModalOpen(false)}
              >
                <FiX size={24} />
              </button>
            </div>
            
            <div className="p-6">
              <form>
                <div className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Arama Adı
                    </label>
                    <input
                      type="text"
                      id="name"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900"
                      placeholder="Örn: Müşteri Memnuniyet Anketi"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                      Açıklama
                    </label>
                    <textarea
                      id="description"
                      rows={3}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900"
                      placeholder="Bu planlı aramanın amacı ve detayları..."
                    ></textarea>
                  </div>
                  
                  {/* Voice Agent Seçimi */}
                  <div>
                    <label htmlFor="voiceAgent" className="block text-sm font-medium text-gray-700">
                      Ses Asistanı
                    </label>
                    <select
                      id="voiceAgent"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900"
                    >
                      <option value="">Ses Asistanı Seçin</option>
                      {demoVoiceAgents.map(agent => (
                        <option key={agent.id} value={agent.id}>
                          {agent.name} - {agent.description}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                        Tarih
                      </label>
                      <input
                        type="date"
                        id="date"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="time" className="block text-sm font-medium text-gray-700">
                        Saat
                      </label>
                      <input
                        type="time"
                        id="time"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="frequency" className="block text-sm font-medium text-gray-700">
                      Tekrarlama
                    </label>
                    <select
                      id="frequency"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900"
                    >
                      <option value="once">Bir Kez</option>
                      <option value="daily">Günlük</option>
                      <option value="weekly">Haftalık</option>
                      <option value="monthly">Aylık</option>
                      <option value="yearly">Yıllık</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Kişiler
                    </label>
                    <div className="border border-gray-300 rounded-md p-4 h-48 overflow-y-auto">
                      <div className="flex justify-between items-center mb-4">
                        <div className="relative flex-1 max-w-sm">
                          <input
                            type="text"
                            placeholder="Kişi ara..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                          />
                          <FiSearch className="absolute left-3 top-3 text-gray-400" />
                        </div>
                        <div className="flex ml-3 gap-2">
                          <button
                            type="button"
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            onClick={() => {/* Kişi ekle */}}
                          >
                            <FiPlus className="mr-1" /> Kişi Ekle
                          </button>
                          <button
                            type="button"
                            className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            onClick={() => setIsFileUploadModalOpen(true)}
                          >
                            <FiUpload className="mr-1" /> Dosyadan Aktar
                          </button>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-md">
                          <div>
                            <p className="font-medium text-gray-800">Ahmet Yılmaz</p>
                            <p className="text-sm text-gray-700">+90 555 123 4567</p>
                          </div>
                          <button className="text-red-500 hover:text-red-700">
                            <FiX />
                          </button>
                        </div>
                        <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-md">
                          <div>
                            <p className="font-medium text-gray-800">Ayşe Demir</p>
                            <p className="text-sm text-gray-700">+90 532 987 6543</p>
                          </div>
                          <button className="text-red-500 hover:text-red-700">
                            <FiX />
                          </button>
                        </div>
                        <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-md">
                          <div>
                            <p className="font-medium text-gray-800">Mehmet Kaya</p>
                            <p className="text-sm text-gray-700">+90 541 456 7890</p>
                          </div>
                          <button className="text-red-500 hover:text-red-700">
                            <FiX />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
            
            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={() => setIsModalOpen(false)}
              >
                İptal
              </button>
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={() => {
                  // Planlı arama oluşturma işlemleri
                  setIsModalOpen(false);
                }}
              >
                <FiCheck className="mr-2" /> Oluştur
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Dosya Yükleme Modal */}
      {isFileUploadModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">Kişileri Dosyadan Aktar</h3>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setIsFileUploadModalOpen(false)}
              >
                <FiX size={24} />
              </button>
            </div>
            
            <div className="p-6">
              <div className="space-y-6">
                <div>
                  <p className="text-sm text-gray-700 mb-4">
                    Excel (.xlsx) veya CSV (.csv) formatında bir dosya yükleyin. Dosyanız en az &quot;isim&quot; ve &quot;telefon&quot; sütunları içermelidir.
                  </p>
                  
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <input
                      type="file"
                      id="fileUpload"
                      className="hidden"
                      accept=".csv,.xlsx,.xls"
                      onChange={handleFileChange}
                    />
                    
                    {!selectedFile ? (
                      <div>
                        <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
                        <p className="mt-2 text-sm text-gray-700">
                          Dosya yüklemek için tıklayın veya sürükleyip bırakın
                        </p>
                        <label
                          htmlFor="fileUpload"
                          className="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
                        >
                          Dosya Seç
                        </label>
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-center justify-center">
                          <FiFile className="h-8 w-8 text-blue-500 mr-2" />
                          <span className="text-gray-900 font-medium">{selectedFile.name}</span>
                        </div>
                        <button
                          type="button"
                          className="mt-4 inline-flex items-center px-3 py-1 border border-gray-300 rounded-md shadow-sm text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          onClick={() => setSelectedFile(null)}
                        >
                          <FiX className="mr-1" /> Kaldır
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Şablon</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    Doğru formatta bir şablon indirmek için:
                  </p>
                  <button
                    type="button"
                    className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    onClick={() => {/* Şablon indir */}}
                  >
                    <FiDownload className="mr-1" /> Excel Şablonu İndir
                  </button>
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={() => setIsFileUploadModalOpen(false)}
              >
                İptal
              </button>
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!selectedFile}
                onClick={() => {
                  // Dosya işleme ve kişileri aktarma
                  setIsFileUploadModalOpen(false);
                  // Başarılı mesajı göster
                }}
              >
                <FiCheck className="mr-2" /> Kişileri Aktar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 