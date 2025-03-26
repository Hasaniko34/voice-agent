'use client'

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { FiSave, FiX, FiPlay, FiVolume2 } from 'react-icons/fi';

// OpenAI'ın ses modelleri
const voiceOptions = [
  { id: 'alloy', name: 'Alloy', description: 'Dengeli ve nötr' },
  { id: 'echo', name: 'Echo', description: 'Derin ve güçlü' },
  { id: 'fable', name: 'Fable', description: 'Samimi ve anlatıcı' },
  { id: 'onyx', name: 'Onyx', description: 'Güçlü ve otoriter' },
  { id: 'nova', name: 'Nova', description: 'Dostça ve doğal' },
  { id: 'shimmer', name: 'Shimmer', description: 'Türkçe için optimize' },
];

// Demo Voice Agent verileri
const demoAgents = [
  {
    id: '1',
    name: 'Türkçe Asistan',
    description: 'Türkçe konuşan ve yanıt veren bir asistan',
    prompt: 'Sen Türkçe konuşan yardımcı bir asistansın. Kullanıcının sorularına nazik ve bilgilendirici bir şekilde cevap ver. Her zaman kısa ve öz yanıt ver, maksimum 1-2 cümle kullan.',
    voice: 'shimmer',
  },
  {
    id: '2',
    name: 'Müzik Uzmanı',
    description: 'Müzik hakkında bilgi veren bir agent',
    prompt: 'Sen bir müzik uzmanısın. Müzik türleri, sanatçılar ve albümler hakkında detaylı bilgi verebilirsin. Cevaplarını her zaman kısa ve öz tut, uzun açıklamalardan kaçın.',
    voice: 'nova',
  }
];

export default function EditVoiceAgent() {
  const router = useRouter();
  const params = useParams();
  const agentId = params.id as string;
  
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    description: '',
    prompt: '',
    voice: '',
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [openaiApiKey, setOpenaiApiKey] = useState<string | null>(null);
  const [isTestingVoice, setIsTestingVoice] = useState<string | null>(null);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  
  // Agent verilerini yükleme
  useEffect(() => {
    const fetchAgent = async () => {
      try {
        setIsLoading(true);
        console.log(`Edit sayfası - Agent ID: ${agentId} için veri getiriliyor...`);
        const response = await fetch(`/api/voice-agents?id=${agentId}`);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Agent yüklenirken bir hata oluştu');
        }
        
        const agent = await response.json();
        console.log('Edit sayfası - Agent verisi başarıyla alındı:', agent.name);
        
        // MongoDB'den gelen yanıtta _id olabilir, uyumluluk için id alanını da belirle
        const agentDbId = agent._id || agent.id;
        
        setFormData({
          id: agentDbId,
          name: agent.name,
          description: agent.description,
          prompt: agent.prompt,
          voice: agent.voice,
        });
        
        setIsLoading(false);
      } catch (error) {
        console.error('Agent yüklenirken hata:', error);
        alert(`Agent yüklenemedi: ${(error as Error).message}`);
        router.push('/dashboard/voice-agents');
      }
    };
    
    fetchAgent();
  }, [agentId, router]);
  
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
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }
    
    try {
      const response = await fetch('/api/voice-agents', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Voice Agent güncellenirken bir hata oluştu');
      }
      
      const updatedAgent = await response.json();
      console.log('Güncellenen Voice Agent:', updatedAgent);
      
      // Başarılı güncelleme sonrası agent'lar sayfasına yönlendirme
      router.push('/dashboard/voice-agents');
    } catch (error) {
      console.error('Güncelleme hatası:', error);
      alert(`Voice Agent güncellenemedi: ${(error as Error).message}`);
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
    const testText = "Merhaba, sana nasıl yardımcı olabilirim?";
    
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
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Voice Agent Düzenle</h1>
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-600 hover:text-gray-800"
          aria-label="Geri"
        >
          <FiX className="mr-2" />
          İptal
        </button>
      </div>
      
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Agent Adı
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
                placeholder="Örn: Türkçe Asistan"
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Açıklama
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
              {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
            </div>
            
            <div>
              <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-1">
                Prompt
              </label>
              <textarea
                id="prompt"
                name="prompt"
                value={formData.prompt}
                onChange={handleChange}
                rows={5}
                className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 ${
                  errors.prompt ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Agent'ın nasıl davranacağını anlatan prompt"
              />
              {errors.prompt && <p className="mt-1 text-sm text-red-600">{errors.prompt}</p>}
              <p className="mt-1 text-sm text-gray-500">
                Örnek: &quot;Sen Türkçe konuşan yardımcı bir asistansın. Kullanıcıya sıcak ve dostça davran. Her zaman kısa ve öz cevaplar ver, maksimum 1-2 cümle kullan.&quot;
              </p>
              <p className="mt-1 text-sm text-blue-600">
                İpucu: Agent&apos;ın kısa cevaplar vermesi için prompt&apos;unuza &quot;kısa ve öz cevaplar ver&quot; veya &quot;uzun açıklamalardan kaçın&quot; gibi talimatlar ekleyin.
              </p>
            </div>
            
            <div>
              <label htmlFor="voice" className="block text-sm font-medium text-gray-700 mb-1">
                Ses
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {voiceOptions.map(voice => (
                  <div key={voice.id} className="relative">
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
                      className={`block p-4 border rounded-md cursor-pointer transition-colors ${
                        formData.voice === voice.id
                          ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-500'
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="font-medium text-gray-800 flex justify-between items-center">
                        <span>{voice.name}</span>
                        <button 
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            testVoice(voice.id);
                          }}
                          className={`p-2 rounded-full hover:bg-blue-100 transition-colors ${
                            isTestingVoice === voice.id ? 'text-blue-600 animate-pulse' : 'text-gray-500'
                          }`}
                          disabled={isTestingVoice !== null}
                          aria-label={`${voice.name} sesini test et`}
                        >
                          {isTestingVoice === voice.id ? <FiVolume2 size={16} /> : <FiPlay size={16} />}
                        </button>
                      </div>
                      <div className="text-sm text-gray-500">{voice.description}</div>
                    </label>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-sm text-gray-500">
                Her bir sesin yanındaki oynat butonuna tıklayarak sesi test edebilirsiniz.
              </p>
            </div>
          </div>
          
          <div className="mt-8 flex justify-end">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm mr-3 hover:bg-gray-50"
            >
              İptal
            </button>
            <button
              type="submit"
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700"
            >
              <FiSave className="mr-2" />
              Değişiklikleri Kaydet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 