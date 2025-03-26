'use client'

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { FiPlus, FiMic, FiMessageSquare, FiEdit, FiTrash2, FiSearch, FiFilter, FiBarChart2, FiClock, FiStar, FiGrid, FiList, FiInfo, FiActivity, FiInbox } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import EmptyState from '@/app/components/ui/EmptyState';
import Button from '@/app/components/ui/Button';
import Input from '@/app/components/ui/Input';
import { Header, SectionHeader } from '@/app/components/ui/Header';
import { PageTransition, CardHover, StaggeredList, SlideUp } from '@/app/components/ui/Animation';
import Loading from '@/app/components/ui/Loading';

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
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Voice Agent'ları getir
  useEffect(() => {
    const fetchAgents = async () => {
      try {
        // Yükleme simülasyonu - gerçek uygulamada bu gecikme olmayacak
        await new Promise(resolve => setTimeout(resolve, 800));
        
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
      setIsDeleting(true);
      
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
      
      setIsDeleting(false);
    } catch (error) {
      console.error('Agent silme hatası:', error);
      alert(`Agent silinemedi: ${(error as Error).message}`);
      setIsDeleting(false);
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
  
  return (
    <PageTransition className="p-6">
      <Header
        title="Voice Agents"
        subtitle="Sesli asistanlarınızı yönetin ve yenilerini oluşturun"
        actions={
          <Button
            variant="primary"
            icon={FiPlus}
            onClick={() => router.push('/dashboard/voice-agents/create')}
          >
            Voice Agent Oluştur
          </Button>
        }
      />
      
      {/* Araç Çubuğu */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Arama Kutusu */}
          <div className="flex-1">
            <Input
              leftIcon={FiSearch}
              placeholder="Agent ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>
          
          {/* Filtreler ve Sıralama */}
          <div className="flex flex-wrap gap-2">
            {/* Kategori Filtresi */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiFilter className="text-gray-400" />
              </div>
              <select
                className="appearance-none pl-10 pr-8 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                aria-label="Kategoriye göre filtrele"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 20 20" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            
            {/* Sıralama */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiBarChart2 className="text-gray-400" />
              </div>
              <select
                className="appearance-none pl-10 pr-8 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [newSortBy, newSortOrder] = e.target.value.split('-');
                  setSortBy(newSortBy as any);
                  setSortOrder(newSortOrder as any);
                }}
                aria-label="Sıralama seçenekleri"
              >
                <option value="name-asc">İsim (A-Z)</option>
                <option value="name-desc">İsim (Z-A)</option>
                <option value="createdAt-desc">En Yeni</option>
                <option value="createdAt-asc">En Eski</option>
                <option value="usageCount-desc">En Çok Kullanılan</option>
                <option value="usageCount-asc">En Az Kullanılan</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 20 20" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            
            {/* Görünüm Seçenekleri */}
            <div className="flex items-center bg-white border border-gray-300 rounded-md">
              <Button
                variant={viewMode === 'grid' ? 'primary' : 'ghost'}
                size="icon"
                onClick={() => setViewMode('grid')}
                aria-label="Grid görünümü"
                icon={FiGrid}
                className="rounded-r-none"
              />
              <Button
                variant={viewMode === 'list' ? 'primary' : 'ghost'}
                size="icon"
                onClick={() => setViewMode('list')}
                aria-label="Liste görünümü"
                icon={FiList}
                className="rounded-l-none"
              />
            </div>
          </div>
        </div>
      </div>
      
      <SectionHeader
        title="Ses Asistanlarınız"
        subtitle={`Toplam ${filteredAgents.length} voice agent`}
      />
      
      {/* Voice Agents Listesi */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loading variant="spinner" size="large" />
          <span className="ml-3 text-blue-500 font-medium">Yükleniyor...</span>
        </div>
      ) : filteredAgents.length === 0 ? (
        <EmptyState
          icon={FiInbox}
          title="Voice Agent Bulunamadı"
          description="Filtreleri değiştirmeyi veya yeni bir voice agent oluşturmayı deneyebilirsiniz."
          action={{
            label: "Voice Agent Oluştur",
            onClick: () => router.push('/dashboard/voice-agents/create')
          }}
        />
      ) : (
        <StaggeredList className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
          {filteredAgents.map(agent => {
            const agentId = agent._id || agent.id;
            
            return (
              <CardHover key={agentId}>
                <div
                  className={`bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden ${
                    viewMode === 'list' ? 'flex' : 'flex flex-col'
                  }`}
                >
                  {/* Agent İçeriği */}
                  <div className={`${
                    viewMode === 'list' ? 'flex-1 flex items-center p-4' : 'p-6'
                  }`}>
                    <div className={`${viewMode === 'list' ? 'flex-1 flex items-center' : ''}`}>
                      {/* Agent İkonu ve Temel Bilgiler */}
                      <div className={`${viewMode === 'list' ? 'flex items-center flex-1' : ''}`}>
                        <div className={`${
                          viewMode === 'list' ? 'mr-4' : 'mb-4 flex items-center justify-between'
                        }`}>
                          <div className="flex items-center">
                            <div className="flex-shrink-0 bg-blue-100 text-blue-600 rounded-full p-3">
                              <FiMic size={viewMode === 'list' ? 20 : 24} />
                            </div>
                            {viewMode === 'list' && (
                              <div className="ml-4">
                                <h3 className="text-lg font-semibold text-gray-900">{agent.name}</h3>
                                <p className="text-sm text-gray-700 line-clamp-1">
                                  {agent.description}
                                </p>
                              </div>
                            )}
                          </div>
                          
                          {viewMode === 'grid' && (
                            <Button
                              variant="ghost"
                              size="icon"
                              icon={FiStar}
                              className={`${agent.isFavorite ? 'text-yellow-500' : 'text-gray-400'}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleFavorite(agentId!);
                              }}
                              aria-label={agent.isFavorite ? 'Favorilerden çıkar' : 'Favorilere ekle'}
                            />
                          )}
                        </div>
                        
                        {viewMode === 'grid' && (
                          <>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">{agent.name}</h3>
                            <p className="text-sm text-gray-700 mb-4 line-clamp-2">
                              {agent.description}
                            </p>
                          </>
                        )}
                      </div>
                      
                      {/* List View - Extra Info and Action Buttons */}
                      {viewMode === 'list' && (
                        <div className="flex items-center ml-auto space-x-6">
                          <div className="hidden md:flex flex-col items-center mr-6">
                            <span className="text-sm font-medium text-gray-700">Kategori</span>
                            <span className="text-sm text-gray-700">{getCategoryName(agent.category || 'other')}</span>
                          </div>
                          
                          <div className="hidden md:flex flex-col items-center mr-6">
                            <span className="text-sm font-medium text-gray-700">Kullanım</span>
                            <span className="text-sm text-gray-700">{agent.usageCount} kez</span>
                          </div>
                          
                          <div className="hidden lg:flex flex-col items-center mr-6">
                            <span className="text-sm font-medium text-gray-700">Son Kullanım</span>
                            <span className="text-sm text-gray-700">{agent.lastUsed ? formatLastUsed(agent.lastUsed) : '-'}</span>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              icon={FiStar}
                              className={`${agent.isFavorite ? 'text-yellow-500' : 'text-gray-400'}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleFavorite(agentId!);
                              }}
                              aria-label={agent.isFavorite ? 'Favorilerden çıkar' : 'Favorilere ekle'}
                            />
                            <Button
                              variant="outline"
                              size="icon"
                              icon={FiEdit}
                              onClick={(e) => {
                                e.stopPropagation();
                                router.push(`/dashboard/voice-agents/${agentId}/edit`);
                              }}
                              aria-label="Düzenle"
                            />
                            <Button
                              variant="danger"
                              size="icon"
                              icon={isDeleting ? undefined : FiTrash2}
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteAgent(agentId!);
                              }}
                              disabled={isDeleting}
                              aria-label="Sil"
                            >
                              {isDeleting && <Loading variant="spinner" size="small" className="text-current" />}
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Grid View - Agent Alt Bilgileri ve İşlem Butonları */}
                  {viewMode === 'grid' && (
                    <>
                      <div className="px-6 py-3 flex justify-between items-center border-t border-gray-200 text-xs text-gray-700">
                        <div className="flex items-center">
                          <FiFilter className="mr-1 text-gray-500" />
                          <span>{getCategoryName(agent.category || 'other')}</span>
                        </div>
                        <div className="flex items-center">
                          <FiActivity className="mr-1 text-gray-500" />
                          <span>{agent.usageCount} kez kullanıldı</span>
                        </div>
                      </div>
                      
                      <div className="px-6 py-3 flex justify-between bg-gray-50 border-t border-gray-200">
                        <Button
                          variant="outline"
                          size="sm"
                          icon={FiInfo}
                          onClick={() => setShowDetails(showDetails === agentId ? null : agentId!)}
                        >
                          {showDetails === agentId ? 'Gizle' : 'Detaylar'}
                        </Button>
                        
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="icon"
                            icon={FiEdit}
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/dashboard/voice-agents/${agentId}/edit`);
                            }}
                            aria-label="Düzenle"
                          />
                          <Button
                            variant="danger"
                            size="icon"
                            icon={isDeleting ? undefined : FiTrash2}
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteAgent(agentId!);
                            }}
                            disabled={isDeleting}
                            aria-label="Sil"
                          >
                            {isDeleting && <Loading variant="spinner" size="small" className="text-current" />}
                          </Button>
                        </div>
                      </div>
                      
                      {/* Detay Paneli */}
                      <AnimatePresence>
                        {showDetails === agentId && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden border-t border-gray-200 px-6 py-4 bg-gray-50"
                          >
                            <h4 className="font-medium text-sm text-gray-900 mb-2">Prompt:</h4>
                            <p className="text-sm text-gray-700 mb-3 bg-white p-2 rounded border border-gray-200 max-h-24 overflow-y-auto">
                              {agent.prompt || 'Prompt bilgisi bulunamadı.'}
                            </p>
                            
                            <div className="grid grid-cols-2 gap-3 text-sm">
                              <div>
                                <span className="font-medium text-gray-900">Ses:</span>
                                <span className="text-gray-700 ml-2">{agent.voice || 'Belirtilmemiş'}</span>
                              </div>
                              <div>
                                <span className="font-medium text-gray-900">Oluşturulma:</span>
                                <span className="text-gray-700 ml-2">{formatDate(agent.createdAt)}</span>
                              </div>
                              <div>
                                <span className="font-medium text-gray-900">Kullanım:</span>
                                <span className="text-gray-700 ml-2">{agent.usageCount} kez</span>
                              </div>
                              <div>
                                <span className="font-medium text-gray-900">Son Kullanım:</span>
                                <span className="text-gray-700 ml-2">{agent.lastUsed ? formatLastUsed(agent.lastUsed) : '-'}</span>
                              </div>
                            </div>
                            
                            <div className="mt-4 flex justify-center">
                              <Button
                                variant="primary"
                                size="sm"
                                icon={FiMessageSquare}
                                onClick={() => router.push(`/dashboard/voice-agents/${agentId}/chat`)}
                              >
                                Konuşma Başlat
                              </Button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  )}
                </div>
              </CardHover>
            );
          })}
        </StaggeredList>
      )}
    </PageTransition>
  );
} 