'use client'

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { FiPlus, FiMic, FiMessageSquare, FiEdit, FiTrash2, FiSearch, FiFilter, FiBarChart2, FiClock, FiStar, FiGrid, FiList, FiInfo, FiActivity } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

// Voice Agent tipi
type VoiceAgent = {
  _id?: string;
  id?: string;
  name: string;
  description: string;
  prompt: string;
  voice: string;
  createdAt: Date;
  category?: string;
  usageCount?: number;
  lastUsed?: Date;
  isFavorite?: boolean;
};

// Kategori listesi
const categories = [
  { id: 'all', name: 'Tümü' },
  { id: 'customer-service', name: 'Müşteri Hizmetleri' },
  { id: 'sales', name: 'Satış' },
  { id: 'support', name: 'Destek' },
  { id: 'survey', name: 'Anket' },
  { id: 'other', name: 'Diğer' }
];

export default function VoiceAgents() {
  const router = useRouter();
  const [agents, setAgents] = useState<VoiceAgent[]>([]);
  const [filteredAgents, setFilteredAgents] = useState<VoiceAgent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState<'name' | 'createdAt' | 'usageCount'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showDetails, setShowDetails] = useState<string | null>(null);
  
  // Voice Agent'ları getir
  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await fetch('/api/voice-agents');
        
        if (!response.ok) {
          throw new Error('Voice Agent\'lar getirilemedi');
        }
        
        const data = await response.json();
        
        // Demo veriler için ek alanlar (gerçek uygulamada API'den gelecek)
        const enhancedData = data.map((agent: VoiceAgent, index: number) => ({
          ...agent,
          category: ['customer-service', 'sales', 'support', 'survey', 'other'][index % 5],
          usageCount: Math.floor(Math.random() * 100),
          lastUsed: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000),
          isFavorite: index % 3 === 0
        }));
        
        setAgents(enhancedData);
        setFilteredAgents(enhancedData);
        setIsLoading(false);
      } catch (error) {
        console.error('Voice Agent\'lar yüklenirken hata:', error);
        setIsLoading(false);
      }
    };
    
    fetchAgents();
  }, []);
  
  // Arama ve filtreleme
  useEffect(() => {
    let result = [...agents];
    
    // Arama filtresi
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(agent => 
        agent.name.toLowerCase().includes(lowerQuery) || 
        agent.description.toLowerCase().includes(lowerQuery)
      );
    }
    
    // Kategori filtresi
    if (selectedCategory !== 'all') {
      result = result.filter(agent => agent.category === selectedCategory);
    }
    
    // Sıralama
    result = result.sort((a, b) => {
      if (sortBy === 'name') {
        return sortOrder === 'asc' 
          ? a.name.localeCompare(b.name) 
          : b.name.localeCompare(a.name);
      } else if (sortBy === 'usageCount') {
        const aCount = a.usageCount || 0;
        const bCount = b.usageCount || 0;
        return sortOrder === 'asc' ? aCount - bCount : bCount - aCount;
      } else {
        const aDate = new Date(a.createdAt).getTime();
        const bDate = new Date(b.createdAt).getTime();
        return sortOrder === 'asc' ? aDate - bDate : bDate - aDate;
      }
    });
    
    setFilteredAgents(result);
  }, [agents, searchQuery, selectedCategory, sortBy, sortOrder]);
  
  // Favori durumunu değiştir
  const toggleFavorite = (id: string) => {
    setAgents(agents.map(agent => {
      const agentId = agent._id || agent.id;
      if (agentId === id) {
        return { ...agent, isFavorite: !agent.isFavorite };
      }
      return agent;
    }));
  };
  
  // Agent silme işlevi
  const deleteAgent = async (id: string) => {
    if (!id) {
      alert('Agent ID bulunamadı');
      return;
    }
    
    if (!confirm('Bu Voice Agent\'ı silmek istediğinizden emin misiniz?')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/voice-agents?id=${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Voice Agent silinirken bir hata oluştu');
      }
      
      // UI'dan kaldır
      setAgents(agents.filter(agent => {
        const agentId = agent._id || agent.id;
        return agentId !== id;
      }));
    } catch (error) {
      console.error('Agent silme hatası:', error);
      alert(`Agent silinemedi: ${(error as Error).message}`);
    }
  };
  
  // Kategori adını almak için yardımcı fonksiyon
  const getCategoryName = (categoryId: string): string => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : 'Diğer';
  };
  
  // Formatlanmış tarih ve zaman
  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Son kullanım zamanını formatla
  const formatLastUsed = (date: Date): string => {
    const now = new Date();
    const lastUsed = new Date(date);
    const diffTime = Math.abs(now.getTime() - lastUsed.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Bugün';
    } else if (diffDays === 1) {
      return 'Dün';
    } else if (diffDays < 7) {
      return `${diffDays} gün önce`;
    } else if (diffDays < 30) {
      return `${Math.floor(diffDays / 7)} hafta önce`;
    } else {
      return formatDate(date);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-blue-500 font-medium">Yükleniyor...</span>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Voice Agents</h1>
          <p className="text-gray-600 mt-1">Sesli asistanlarınızı yönetin ve yenilerini oluşturun</p>
        </div>
        
        <Link
          href="/dashboard/voice-agents/create"
          className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors shadow-sm"
        >
          <FiPlus className="mr-2" />
          Voice Agent Oluştur
        </Link>
      </div>
      
      {/* Araç Çubuğu */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Arama Kutusu */}
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Agent ara..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {/* Filtreler ve Sıralama */}
          <div className="flex flex-wrap gap-2">
            {/* Kategori Filtresi */}
            <div className="relative">
              <select
                className="appearance-none pl-10 pr-8 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiFilter className="text-gray-400" />
              </div>
            </div>
            
            {/* Sıralama */}
            <div className="relative">
              <select
                className="appearance-none pl-10 pr-8 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'name' | 'createdAt' | 'usageCount')}
              >
                <option value="createdAt">Oluşturma Tarihi</option>
                <option value="name">İsim</option>
                <option value="usageCount">Kullanım Sayısı</option>
              </select>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiBarChart2 className="text-gray-400" />
              </div>
              <button
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                aria-label="Sıralama Yönünü Değiştir"
              >
                {sortOrder === 'asc' ? 
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg> : 
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                }
              </button>
            </div>
            
            {/* Görünüm Seçenekleri */}
            <div className="flex border border-gray-300 rounded-md overflow-hidden">
              <button
                className={`p-2 ${viewMode === 'grid' ? 'bg-blue-50 text-blue-600' : 'bg-white text-gray-600'}`}
                onClick={() => setViewMode('grid')}
                aria-label="Grid Görünüm"
              >
                <FiGrid size={18} />
              </button>
              <button
                className={`p-2 ${viewMode === 'list' ? 'bg-blue-50 text-blue-600' : 'bg-white text-gray-600'}`}
                onClick={() => setViewMode('list')}
                aria-label="Liste Görünüm"
              >
                <FiList size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Sonuç Bilgisi */}
      <div className="flex items-center text-sm text-gray-600">
        <FiInfo className="mr-2" />
        {filteredAgents.length} agent bulundu
        {selectedCategory !== 'all' && ` (${getCategoryName(selectedCategory)} kategorisinde)`}
        {searchQuery && ` "${searchQuery}" araması için`}
      </div>
      
      {filteredAgents.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200 shadow-sm">
          <FiMic className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-lg font-medium text-gray-800 mb-2">
            {agents.length === 0 ? 'Henüz Voice Agent Yok' : 'Eşleşen Voice Agent Bulunamadı'}
          </h3>
          <p className="text-gray-600 mb-6">
            {agents.length === 0 
              ? 'İlk voice agent\'ınızı oluşturmak için "Voice Agent Oluştur" butonuna tıklayın.' 
              : 'Arama kriterlerinize uygun voice agent bulunamadı. Farklı filtreler deneyin.'}
          </p>
          {agents.length === 0 && (
            <Link
              href="/dashboard/voice-agents/create"
              className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors shadow-sm"
            >
              <FiPlus className="mr-2" />
              Voice Agent Oluştur
            </Link>
          )}
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredAgents.map(agent => {
              // MongoDB veya demo verilerden gelen agent ID'sini belirle
              const agentId = agent._id || agent.id || '';
              
              return (
                <motion.div
                  key={agentId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{agent.name}</h3>
                      <button
                        onClick={() => toggleFavorite(agentId)}
                        className={`p-1 rounded-full ${agent.isFavorite ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'}`}
                        aria-label={agent.isFavorite ? 'Favorilerden Çıkar' : 'Favorilere Ekle'}
                      >
                        <FiStar className={agent.isFavorite ? 'fill-current' : ''} />
                      </button>
                    </div>
                    
                    <p className="text-gray-700 mb-4 line-clamp-2">{agent.description}</p>
                    
                    <div className="flex flex-wrap gap-y-2 mb-4">
                      <span className="mr-3 flex items-center text-sm text-gray-600">
                        <FiMic className="mr-1 text-gray-500" />
                        {agent.voice}
                      </span>
                      <span className="mr-3 flex items-center text-sm text-gray-600">
                        <FiActivity className="mr-1 text-gray-500" />
                        {agent.usageCount} kullanım
                      </span>
                      <span className="flex items-center text-sm text-gray-600">
                        <FiClock className="mr-1 text-gray-500" />
                        {formatLastUsed(agent.lastUsed as Date)}
                      </span>
                    </div>
                    
                    <div className="text-xs font-medium text-gray-500 mb-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
                        {getCategoryName(agent.category || 'other')}
                      </span>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 bg-gray-50 p-4 flex justify-between items-center">
                    <div className="flex space-x-2">
                      <button 
                        className="p-2 text-gray-600 hover:text-blue-600 rounded hover:bg-gray-100"
                        onClick={() => router.push(`/dashboard/voice-agents/${agentId}/edit`)}
                        aria-label="Düzenle"
                      >
                        <FiEdit size={18} />
                      </button>
                      <button 
                        className="p-2 text-gray-600 hover:text-red-600 rounded hover:bg-gray-100"
                        onClick={() => deleteAgent(agentId)}
                        aria-label="Sil"
                      >
                        <FiTrash2 size={18} />
                      </button>
                      <button 
                        className="p-2 text-gray-600 hover:text-blue-600 rounded hover:bg-gray-100"
                        onClick={() => setShowDetails(showDetails === agentId ? null : agentId)}
                        aria-label="Detaylar"
                      >
                        <FiInfo size={18} />
                      </button>
                    </div>
                    
                    <Link
                      href={`/dashboard/voice-agents/${agentId}/chat`}
                      className="flex items-center text-blue-600 hover:text-blue-700 font-medium"
                    >
                      <FiMessageSquare className="mr-1" />
                      Konuş
                    </Link>
                  </div>
                  
                  {/* Detay Paneli */}
                  <AnimatePresence>
                    {showDetails === agentId && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-gray-200 bg-gray-50 overflow-hidden"
                      >
                        <div className="p-4">
                          <h4 className="font-medium text-gray-900 mb-2">Agent Detayları</h4>
                          <p className="text-sm text-gray-700 mb-2">
                            <span className="font-medium">Oluşturulma:</span> {formatDate(agent.createdAt)}
                          </p>
                          <p className="text-sm text-gray-700 mb-2">
                            <span className="font-medium">Son Kullanım:</span> {formatLastUsed(agent.lastUsed as Date)}
                          </p>
                          <p className="text-sm text-gray-700 mb-4">
                            <span className="font-medium">Prompt:</span> 
                            <span className="block mt-1 p-2 bg-gray-100 rounded text-xs overflow-x-auto">
                              {agent.prompt.substring(0, 100)}...
                            </span>
                          </p>
                          
                          <div className="flex justify-end">
                            <button
                              className="text-sm text-blue-600 hover:text-blue-700"
                              onClick={() => setShowDetails(null)}
                            >
                              Kapat
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
          <ul className="divide-y divide-gray-200">
            <AnimatePresence>
              {filteredAgents.map(agent => {
                const agentId = agent._id || agent.id || '';
                
                return (
                  <motion.li
                    key={agentId}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="hover:bg-gray-50"
                  >
                    <div className="px-6 py-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center">
                            <h3 className="text-lg font-semibold text-gray-900 mr-2">{agent.name}</h3>
                            {agent.isFavorite && (
                              <FiStar className="text-yellow-500 fill-current" size={16} />
                            )}
                            <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {getCategoryName(agent.category || 'other')}
                            </span>
                          </div>
                          <p className="mt-1 text-sm text-gray-700 line-clamp-1">{agent.description}</p>
                          
                          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-600">
                            <span className="flex items-center">
                              <FiMic className="mr-1" size={14} />
                              {agent.voice}
                            </span>
                            <span className="flex items-center">
                              <FiClock className="mr-1" size={14} />
                              {formatDate(agent.createdAt)}
                            </span>
                            <span className="flex items-center">
                              <FiActivity className="mr-1" size={14} />
                              {agent.usageCount} kullanım
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center ml-4 space-x-2">
                          <button
                            onClick={() => toggleFavorite(agentId)}
                            className={`p-2 rounded ${agent.isFavorite ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'}`}
                            aria-label={agent.isFavorite ? 'Favorilerden Çıkar' : 'Favorilere Ekle'}
                          >
                            <FiStar className={agent.isFavorite ? 'fill-current' : ''} size={18} />
                          </button>
                          <button 
                            className="p-2 text-gray-500 hover:text-blue-600 rounded hover:bg-gray-100"
                            onClick={() => router.push(`/dashboard/voice-agents/${agentId}/edit`)}
                            aria-label="Düzenle"
                          >
                            <FiEdit size={18} />
                          </button>
                          <button 
                            className="p-2 text-gray-500 hover:text-red-600 rounded hover:bg-gray-100"
                            onClick={() => deleteAgent(agentId)}
                            aria-label="Sil"
                          >
                            <FiTrash2 size={18} />
                          </button>
                          <Link
                            href={`/dashboard/voice-agents/${agentId}/chat`}
                            className="ml-2 flex items-center px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md"
                          >
                            <FiMessageSquare className="mr-1" size={16} />
                            Konuş
                          </Link>
                        </div>
                      </div>
                    </div>
                  </motion.li>
                );
              })}
            </AnimatePresence>
          </ul>
        </div>
      )}
    </div>
  );
} 