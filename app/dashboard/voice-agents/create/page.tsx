'use client'

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { FiSave, FiX, FiPlay, FiVolume2, FiLoader, FiInfo, FiHelpCircle, FiCheckCircle, FiAlertTriangle, FiCopy, FiRotateCw, FiList } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

// OpenAI'ın ses modelleri
const voiceOptions = [
  { id: 'alloy', name: 'Alloy', description: 'Dengeli ve nötr' },
  { id: 'echo', name: 'Echo', description: 'Derin ve güçlü' },
  { id: 'fable', name: 'Fable', description: 'Samimi ve anlatıcı' },
  { id: 'onyx', name: 'Onyx', description: 'Güçlü ve otoriter' },
  { id: 'nova', name: 'Nova', description: 'Dostça ve doğal' },
  { id: 'shimmer', name: 'Shimmer', description: 'Türkçe için optimize' },
];

// Model seçenekleri
const modelOptions = [
  { id: 'gpt-4o', name: 'GPT-4o', description: 'En güçlü ve çok yönlü model' },
  { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', description: 'Hızlı ve yüksek kaliteli' },
  { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', description: 'Daha ekonomik seçenek' },
];

// Kategori seçenekleri
const categoryOptions = [
  { id: 'customer-service', name: 'Müşteri Hizmetleri', description: 'Müşteri sorularını yanıtlamak için' },
  { id: 'sales', name: 'Satış', description: 'Ürün ve hizmet satışı için' },
  { id: 'support', name: 'Teknik Destek', description: 'Teknik sorunlarda yardım için' },
  { id: 'survey', name: 'Anket', description: 'Anket ve geri bildirim toplamak için' },
  { id: 'other', name: 'Diğer', description: 'Özel kullanım amaçları için' },
];

// Şablon promptlar
const promptTemplates = [
  {
    name: 'Müşteri Hizmetleri Asistanı',
    prompt: 'Sen bir müşteri hizmetleri asistanısın. Müşteri sorularına nazik, profesyonel ve kısa bir şekilde yanıt vermelisin. Sorunu anlamadığında açıklama iste. Müşteriye her zaman yardımcı olmaya çalış ve gerekirse bir insan temsilcisine yönlendir. Cevapların kısa ve öz olmalı, konuşma dilinde olmalı, maksimum 1-2 cümle kullanmalısın.'
  },
  {
    name: 'Satış Temsilcisi',
    prompt: 'Sen bir satış temsilcisisin. Müşterilere ürünlerimiz hakkında bilgi vermelisin. Ürünlerin özelliklerini ve faydalarını vurgula. İkna edici ol ama agresif olma. Sorulara kısa ve net cevaplar ver. Müşterinin ihtiyaçlarını anlamaya çalış ve ona uygun ürünler öner. Konuşma dilinde ve dostça bir tonda konuşmalısın.'
  },
  {
    name: 'Teknik Destek Uzmanı',
    prompt: 'Sen bir teknik destek uzmanısın. Kullanıcılara teknik sorunlarında yardımcı olmalısın. Karmaşık konuları basit bir dille açıkla. Adım adım talimatlar ver. Kullanıcının teknik bilgisinin sınırlı olabileceğini unutma. Cevapların kısa ve anlaşılır olsun. Jargon kullanmaktan kaçın.'
  }
];

export default function CreateVoiceAgent() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    prompt: '',
    voice: 'shimmer',
    category: 'customer-service',
    model: 'gpt-4o',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [openaiApiKey, setOpenaiApiKey] = useState<string | null>(null);
  const [isTestingVoice, setIsTestingVoice] = useState<string | null>(null);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showTips, setShowTips] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const promptRef = useRef<HTMLTextAreaElement>(null);
  
  // OpenAI API anahtarını al
  useEffect(() => {
    if (!openaiApiKey) {
      fetch("/api/openai", { cache: "no-store" })
        .then((res) => res.json())
        .then((object) => {
          if (!("apiKey" in object)) throw new Error("OpenAI API anahtarı bulunamadı");
          setOpenaiApiKey(object.apiKey);
        })
        .catch((e) => {
          console.error("OpenAI API anahtarı alınamadı:", e);
        });
    }
  }, [openaiApiKey]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Hata temizleme
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Agent adı zorunludur';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Açıklama zorunludur';
    }
    
    if (!formData.prompt.trim()) {
      newErrors.prompt = 'Prompt zorunludur';
    } else if (formData.prompt.length < 50) {
      newErrors.prompt = 'Prompt en az 50 karakter olmalıdır';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // API'ye POST isteği gönder
      const response = await fetch('/api/voice-agents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Voice Agent oluşturulurken bir hata oluştu');
      }
      
      const createdAgent = await response.json();
      console.log('Oluşturulan Voice Agent:', createdAgent);
      
      // Başarılı kayıt sonrası agent'lar sayfasına yönlendirme
      router.push('/dashboard/voice-agents');
    } catch (error) {
      console.error('Kayıt hatası:', error);
      alert(`Voice Agent oluşturulamadı: ${(error as Error).message}`);
      setIsSubmitting(false);
    }
  };
  
  // Sesi test etme fonksiyonu
  const testVoice = async (voiceId: string) => {
    if (!openaiApiKey) {
      alert('OpenAI API anahtarı henüz yüklenmedi. Lütfen biraz bekleyin.');
      return;
    }
    
    // Eğer aynı ses zaten test ediliyorsa, işlemi iptal et
    if (isTestingVoice === voiceId) {
      return;
    }
    
    setIsTestingVoice(voiceId);
    
    // Test cümlesi
    const testText = "Merhaba, ben bir sesli asistanım. Size nasıl yardımcı olabilirim?";
    
    try {
      const response = await fetch("https://api.openai.com/v1/audio/speech", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${openaiApiKey}`
        },
        body: JSON.stringify({
          model: "tts-1", // Hız için normal kalite
          voice: voiceId,
          input: testText,
          speed: 1.0
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP hata: ${response.status}`);
      }
      
      const arrayBuffer = await response.arrayBuffer();
      const blob = new Blob([arrayBuffer], { type: "audio/mpeg" });
      const url = URL.createObjectURL(blob);
      
      // Önceki ses varsa durdur ve kaynağı temizle
      if (audio) {
        audio.pause();
        audio.src = "";
      }
      
      const newAudio = new Audio(url);
      setAudio(newAudio);
      
      newAudio.onended = () => {
        setIsTestingVoice(null);
      };
      
      newAudio.onerror = () => {
        setIsTestingVoice(null);
        alert('Ses çalma sırasında bir hata oluştu.');
      };
      
      await newAudio.play();
      
    } catch (error) {
      console.error("Ses test hatası:", error);
      setIsTestingVoice(null);
      alert('Ses testi sırasında bir hata oluştu.');
    }
  };
  
  // Şablon uygula
  const applyTemplate = (template: typeof promptTemplates[0]) => {
    setFormData(prev => ({
      ...prev,
      prompt: template.prompt
    }));
    
    if (errors.prompt) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.prompt;
        return newErrors;
      });
    }
    
    setShowTemplates(false);
    
    // Prompt alanına odaklan ve cursor'ı sonuna taşı
    if (promptRef.current) {
      promptRef.current.focus();
      promptRef.current.selectionStart = promptRef.current.value.length;
      promptRef.current.selectionEnd = promptRef.current.value.length;
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Voice Agent Oluştur</h1>
          <p className="text-gray-600 mt-1">Yeni bir sesli asistan oluşturarak konuşma deneyimlerini kişiselleştirin</p>
        </div>
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-600 hover:text-gray-800 px-3 py-1 rounded-md hover:bg-gray-100 transition-colors"
          aria-label="Geri"
        >
          <FiX className="mr-2" />
          İptal
        </button>
      </div>
      
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-medium text-gray-900">Agent Bilgileri</h2>
          <p className="text-gray-600 text-sm">Voice agent'ınızın temel özelliklerini belirleyin</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-6">
            {/* Temel Bilgiler */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Agent Adı <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Örn: Türkçe Müşteri Asistanı"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <FiAlertTriangle className="mr-1 flex-shrink-0" /> {errors.name}
                  </p>
                )}
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Açıklama <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 ${
                    errors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Bu agent ne yapacak? Kısa bir açıklama"
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <FiAlertTriangle className="mr-1 flex-shrink-0" /> {errors.description}
                  </p>
                )}
              </div>
            </div>

            {/* Kategori ve Model seçimi */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  Kategori
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                >
                  {categoryOptions.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-sm text-gray-500">
                  {categoryOptions.find(c => c.id === formData.category)?.description}
                </p>
              </div>
              
              <div>
                <label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-1">
                  AI Model
                </label>
                <select
                  id="model"
                  name="model"
                  value={formData.model}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                >
                  {modelOptions.map(model => (
                    <option key={model.id} value={model.id}>
                      {model.name}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-sm text-gray-500">
                  {modelOptions.find(m => m.id === formData.model)?.description}
                </p>
              </div>
            </div>
            
            {/* Prompt Bölümü */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="prompt" className="block text-sm font-medium text-gray-700">
                  Prompt <span className="text-red-500">*</span>
                </label>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowTips(!showTips)}
                    className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                  >
                    <FiHelpCircle className="mr-1" size={14} />
                    {showTips ? 'İpuçlarını Gizle' : 'İpuçlarını Göster'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowTemplates(!showTemplates)}
                    className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                  >
                    <FiList className="mr-1" size={14} />
                    Şablonlar
                  </button>
                </div>
              </div>
              
              <div className="relative">
                <textarea
                  id="prompt"
                  name="prompt"
                  ref={promptRef}
                  value={formData.prompt}
                  onChange={handleChange}
                  rows={8}
                  className={`w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm text-gray-900 ${
                    errors.prompt ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Agent&apos;ın nasıl davranacağını anlatan prompt"
                />
                <div className="absolute bottom-2 right-2 text-xs text-gray-500">
                  {formData.prompt.length} karakter
                </div>
              </div>
              
              {errors.prompt && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <FiAlertTriangle className="mr-1 flex-shrink-0" /> {errors.prompt}
                </p>
              )}
              
              <AnimatePresence>
                {showTemplates && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="mt-2 border border-gray-200 rounded-md overflow-hidden"
                  >
                    <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                      <h3 className="text-sm font-medium text-gray-700">Şablon Promptlar</h3>
                    </div>
                    <div className="divide-y divide-gray-200">
                      {promptTemplates.map((template, index) => (
                        <div key={index} className="p-3 hover:bg-gray-50 transition-colors">
                          <div className="flex justify-between items-center mb-1">
                            <h4 className="text-sm font-medium text-gray-800">{template.name}</h4>
                            <button
                              type="button"
                              onClick={() => applyTemplate(template)}
                              className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                            >
                              Uygula
                            </button>
                          </div>
                          <p className="text-xs text-gray-600 line-clamp-2">{template.prompt}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              
              <AnimatePresence>
                {showTips && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="mt-3 bg-blue-50 border border-blue-200 rounded-md p-3"
                  >
                    <h3 className="text-sm font-medium text-blue-800 mb-2 flex items-center">
                      <FiInfo className="mr-1" /> Etkili Promptlar İçin İpuçları
                    </h3>
                    <ul className="text-xs text-blue-700 space-y-1 list-disc pl-5">
                      <li>Agent&apos;ınızın amacını ve hedef kitlesini açıkça belirtin</li>
                      <li>Asistanın davranış tarzını ve tonunu tanımlayın (profesyonel, dostça, resmi, vb.)</li>
                      <li>Kısa cevaplar vermesini istiyorsanız bunu belirtin (&quot;kısa ve öz cevaplar ver&quot; gibi)</li>
                      <li>Asistanın hangi durumlarda nasıl davranması gerektiğini açıklayın</li>
                      <li>İyi bir prompt 100-300 karakter arasında olmalıdır</li>
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Ses Seçimi */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ses
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {voiceOptions.map(voice => (
                  <motion.div 
                    key={voice.id} 
                    className="relative"
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <input
                      type="radio"
                      id={voice.id}
                      name="voice"
                      value={voice.id}
                      checked={formData.voice === voice.id}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <label
                      htmlFor={voice.id}
                      className={`block p-4 border rounded-lg cursor-pointer transition-all ${
                        formData.voice === voice.id
                          ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-500 shadow-sm'
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="font-medium text-gray-900 flex justify-between items-center">
                        <span>{voice.name}</span>
                        <button 
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            testVoice(voice.id);
                          }}
                          className={`p-2 rounded-full hover:bg-blue-100 transition-colors ${
                            isTestingVoice === voice.id ? 'text-blue-600 bg-blue-100' : 'text-gray-500'
                          }`}
                          disabled={isTestingVoice !== null}
                          aria-label={`${voice.name} sesini test et`}
                        >
                          {isTestingVoice === voice.id ? 
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                            >
                              <FiLoader size={18} />
                            </motion.div> : 
                            <FiPlay size={18} />
                          }
                        </button>
                      </div>
                      <div className="text-sm text-gray-600 mt-1">{voice.description}</div>
                    </label>
                  </motion.div>
                ))}
              </div>
              <p className="mt-3 text-sm text-gray-600 flex items-center">
                <FiVolume2 className="mr-1" size={16} />
                Ses örneklerini dinlemek için oynat butonlarına tıklayabilirsiniz
              </p>
            </div>
          </div>
          
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row justify-end gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 transition-colors flex items-center justify-center"
            >
              <FiX className="mr-2" />
              İptal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex items-center justify-center px-6 py-2 ${
                isSubmitting ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
              } text-white rounded-md shadow-sm transition-colors`}
            >
              {isSubmitting ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="mr-2"
                  >
                    <FiLoader size={18} />
                  </motion.div>
                  Oluşturuluyor...
                </>
              ) : (
                <>
                  <FiSave className="mr-2" />
                  Voice Agent Oluştur
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 