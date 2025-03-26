'use client'

import { useState } from 'react';
import { FiPhone, FiInfo, FiArrowRight, FiCalendar, FiClock, FiSearch, FiFilter, FiInbox } from 'react-icons/fi';
import Link from 'next/link';
import EmptyState from '@/app/components/ui/EmptyState';
import Button from '@/app/components/ui/Button';
import Input from '@/app/components/ui/Input';

// Demo arama geçmişi verileri
const demoCallHistory = [
  {
    id: '1',
    phoneNumber: '+90 555 123 4567',
    name: 'Ahmet Yılmaz',
    date: '2023-03-25',
    time: '14:30',
    duration: '5:23',
    status: 'completed',
    direction: 'outgoing',
  },
  {
    id: '2',
    phoneNumber: '+90 532 987 6543',
    name: 'Ayşe Demir',
    date: '2023-03-24',
    time: '11:15',
    duration: '3:45',
    status: 'completed',
    direction: 'outgoing',
  },
  {
    id: '3',
    phoneNumber: '+90 541 456 7890',
    name: 'Mehmet Kaya',
    date: '2023-03-23',
    time: '09:20',
    duration: '7:12',
    status: 'missed',
    direction: 'incoming',
  },
  {
    id: '4',
    phoneNumber: '+90 505 789 0123',
    name: 'Zeynep Özkan',
    date: '2023-03-22',
    time: '16:45',
    duration: '2:30',
    status: 'completed',
    direction: 'outgoing',
  },
  {
    id: '5',
    phoneNumber: '+90 533 246 8135',
    name: 'Mustafa Çelik',
    date: '2023-03-21',
    time: '13:10',
    duration: '9:15',
    status: 'completed',
    direction: 'outgoing',
  },
  {
    id: '6',
    phoneNumber: '+90 542 975 3108',
    name: 'Fatma Yıldız',
    date: '2023-03-20',
    time: '10:05',
    duration: '4:50',
    status: 'missed',
    direction: 'incoming',
  },
  {
    id: '7',
    phoneNumber: '+90 553 159 7531',
    name: 'Emre Şahin',
    date: '2023-03-19',
    time: '15:30',
    duration: '1:45',
    status: 'completed',
    direction: 'outgoing',
  },
];

export default function CallHistoryPage() {
  const [selectedCall, setSelectedCall] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'missed'>('all');
  const [filterDirection, setFilterDirection] = useState<'all' | 'incoming' | 'outgoing'>('all');

  // Filtreleme ve arama fonksiyonu
  const filteredCalls = demoCallHistory.filter(call => {
    // Arama terimiyle filtreleme
    const matchesSearch = 
      call.phoneNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      call.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Durum ile filtreleme
    const matchesStatus = 
      filterStatus === 'all' || 
      call.status === filterStatus;
    
    // Yön ile filtreleme
    const matchesDirection = 
      filterDirection === 'all' || 
      call.direction === filterDirection;
    
    return matchesSearch && matchesStatus && matchesDirection;
  });

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">Geçmiş Aramalar</h1>
      
      {/* Arama ve Filtreleme */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Arama Kutusu */}
          <div className="flex-1">
            <Input
              placeholder="İsim veya numara ara..."
              leftIcon={FiSearch}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          
          {/* Filtreler */}
          <div className="flex gap-4">
            <div className="flex items-center">
              <FiFilter className="mr-2 text-gray-500" />
              <select
                className="border border-gray-300 rounded-md py-2 px-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
              >
                <option value="all">Tüm Durumlar</option>
                <option value="completed">Tamamlanan</option>
                <option value="missed">Cevapsız</option>
              </select>
            </div>
            
            <div className="flex items-center">
              <FiArrowRight className="mr-2 text-gray-500" />
              <select
                className="border border-gray-300 rounded-md py-2 px-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                value={filterDirection}
                onChange={(e) => setFilterDirection(e.target.value as any)}
              >
                <option value="all">Tüm Yönler</option>
                <option value="incoming">Gelen</option>
                <option value="outgoing">Giden</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Arama Geçmişi Listesi */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-[calc(100vh-240px)] overflow-y-auto">
            <h2 className="p-4 border-b border-gray-200 font-semibold text-lg text-gray-900">Aramalar</h2>
            
            {filteredCalls.length === 0 ? (
              <div className="p-4">
                <EmptyState
                  icon={FiInbox}
                  title="Arama Kaydı Bulunamadı"
                  description="Filtreyi değiştirmeyi veya yeni aramalar yapmayı deneyebilirsiniz."
                />
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {filteredCalls.map((call) => (
                  <li 
                    key={call.id}
                    className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${selectedCall === call.id ? 'bg-blue-50' : ''}`}
                    onClick={() => setSelectedCall(call.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">{call.name}</h3>
                        <p className="text-sm text-gray-700">{call.phoneNumber}</p>
                        <div className="flex items-center mt-2 text-xs text-gray-700">
                          <FiCalendar className="mr-1" size={12} />
                          <span className="mr-3">{call.date}</span>
                          <FiClock className="mr-1" size={12} />
                          <span>{call.time}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <span 
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                            ${call.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                        >
                          {call.status === 'completed' ? 'Tamamlandı' : 'Cevapsız'}
                        </span>
                        <span 
                          className={`mt-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium
                            ${call.direction === 'outgoing' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}`}
                        >
                          {call.direction === 'outgoing' ? 'Giden' : 'Gelen'}
                        </span>
                        <span className="mt-2 text-xs text-gray-700">
                          {call.duration}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        
        {/* Arama Detayları */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-[calc(100vh-240px)] overflow-y-auto">
            {!selectedCall ? (
              <div className="h-full flex flex-col items-center justify-center p-6">
                <EmptyState
                  icon={FiInfo}
                  title="Arama Detayları"
                  description="Detayları görüntülemek için soldan bir arama seçin"
                />
              </div>
            ) : (
              <>
                {/* Arama Bilgileri */}
                {demoCallHistory.filter(call => call.id === selectedCall).map(call => (
                  <div key={call.id}>
                    <div className="p-6 border-b border-gray-200">
                      <div className="flex justify-between items-start">
                        <div>
                          <h2 className="text-2xl font-bold text-gray-900">{call.name}</h2>
                          <p className="text-gray-700">{call.phoneNumber}</p>
                          <div className="flex items-center mt-3">
                            <span 
                              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mr-3
                                ${call.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                            >
                              {call.status === 'completed' ? 'Tamamlandı' : 'Cevapsız'}
                            </span>
                            <span 
                              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
                                ${call.direction === 'outgoing' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}`}
                            >
                              {call.direction === 'outgoing' ? 'Giden Arama' : 'Gelen Arama'}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="bg-gray-100 rounded-lg p-3">
                            <div className="flex items-center text-sm text-gray-700 mb-1">
                              <FiCalendar className="mr-2" />
                              <span>{call.date}</span>
                            </div>
                            <div className="flex items-center text-sm text-gray-700 mb-1">
                              <FiClock className="mr-2" />
                              <span>{call.time}</span>
                            </div>
                            <div className="text-sm font-medium text-gray-800">
                              Süre: {call.duration}
                            </div>
                          </div>
                          <Button
                            variant="primary"
                            icon={FiPhone}
                            className="mt-4"
                            onClick={() => {}}
                          >
                            Tekrar Ara
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Konuşma Dökümü */}
                    <div className="p-6">
                      <h3 className="text-lg font-medium mb-4 text-gray-900">Görüşme Dökümü</h3>
                      
                      <div className="space-y-4">
                        {/* Giden Mesaj */}
                        <div className="flex">
                          <div className="flex-shrink-0 bg-blue-500 text-white rounded-full p-2 mr-3">
                            <span className="text-xs font-bold">SİZ</span>
                          </div>
                          <div className="bg-blue-50 rounded-lg p-3 max-w-md">
                            <p className="text-sm text-gray-800">Merhaba, nasılsınız? Size ABC şirketi hakkında bilgi vermek istiyorum. Ürünlerimizle ilgilenir misiniz?</p>
                            <span className="text-xs text-gray-700 block mt-1">14:32</span>
                          </div>
                        </div>
                        
                        {/* Gelen Mesaj */}
                        <div className="flex">
                          <div className="flex-shrink-0 bg-gray-500 text-white rounded-full p-2 mr-3">
                            <span className="text-xs font-bold">MÜŞ</span>
                          </div>
                          <div className="bg-gray-100 rounded-lg p-3 max-w-md">
                            <p className="text-sm text-gray-800">Merhaba, teşekkür ederim, iyiyim. Evet, ürünleriniz hakkında biraz bilgi alabilir miyim?</p>
                            <span className="text-xs text-gray-700 block mt-1">14:33</span>
                          </div>
                        </div>
                        
                        {/* Giden Mesaj */}
                        <div className="flex">
                          <div className="flex-shrink-0 bg-blue-500 text-white rounded-full p-2 mr-3">
                            <span className="text-xs font-bold">SİZ</span>
                          </div>
                          <div className="bg-blue-50 rounded-lg p-3 max-w-md">
                            <p className="text-sm text-gray-800">Tabii ki. Ürünlerimiz %100 doğal içeriklerden üretilmiştir ve sektörde en yüksek kaliteye sahiptir. Size özel %15 indirim sunabiliriz.</p>
                            <span className="text-xs text-gray-700 block mt-1">14:34</span>
                          </div>
                        </div>
                        
                        {/* Gelen Mesaj */}
                        <div className="flex">
                          <div className="flex-shrink-0 bg-gray-500 text-white rounded-full p-2 mr-3">
                            <span className="text-xs font-bold">MÜŞ</span>
                          </div>
                          <div className="bg-gray-100 rounded-lg p-3 max-w-md">
                            <p className="text-sm text-gray-800">Bu çok iyi. Fiyatları öğrenebilir miyim? Ve bir de teslimat süresi ne kadar?</p>
                            <span className="text-xs text-gray-700 block mt-1">14:35</span>
                          </div>
                        </div>
                        
                        {/* Daha fazla mesaj */}
                        <div className="flex">
                          <div className="flex-shrink-0 bg-blue-500 text-white rounded-full p-2 mr-3">
                            <span className="text-xs font-bold">SİZ</span>
                          </div>
                          <div className="bg-blue-50 rounded-lg p-3 max-w-md">
                            <p className="text-sm text-gray-800">Elbette, temel paketimiz 1500 TL&apos;den başlıyor. Teslimat süremiz genelde 2-3 iş günü içerisinde. Size bir katalog gönderebilir miyim?</p>
                            <span className="text-xs text-gray-700 block mt-1">14:36</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 