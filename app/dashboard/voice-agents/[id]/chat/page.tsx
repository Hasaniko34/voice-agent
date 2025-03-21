'use client'

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQueue } from "@uidotdev/usehooks";
import Siriwave from 'react-siriwave';
import { FiArrowLeft, FiMic, FiSettings } from 'react-icons/fi';
import {
  CreateProjectKeyResponse,
  LiveClient,
  LiveTranscriptionEvents,
  createClient,
} from "@deepgram/sdk";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Demo Voice Agent verileri
const demoAgents = [
  {
    id: '1',
    name: 'Türkçe Asistan',
    description: 'Türkçe konuşan ve yanıt veren bir asistan',
    prompt: 'Sen Türkçe konuşan yardımcı bir asistansın. Kullanıcının sorularına nazik ve bilgilendirici bir şekilde cevap ver.',
    voice: 'shimmer',
  },
  {
    id: '2',
    name: 'Müzik Uzmanı',
    description: 'Müzik hakkında bilgi veren bir agent',
    prompt: 'Sen bir müzik uzmanısın. Müzik türleri, sanatçılar ve albümler hakkında detaylı bilgi verebilirsin.',
    voice: 'nova',
  }
];

export default function VoiceAgentChat() {
  const params = useParams();
  const router = useRouter();
  const agentId = params.id as string;
  
  // Voice Agent'ı bulma
  const [agent, setAgent] = useState(() => {
    const found = demoAgents.find(a => a.id === agentId);
    if (!found) {
      // Router burada etkin olmadığından, useEffect içinde yönlendireceğiz
      return null;
    }
    return found;
  });
  
  useEffect(() => {
    if (!agent) {
      router.push('/dashboard/voice-agents');
    }
  }, [agent, router]);
  
  const { add, remove, first, size, queue } = useQueue<any>([]);
  const [apiKey, setApiKey] = useState<CreateProjectKeyResponse | null>();
  const [openaiApiKey, setOpenaiApiKey] = useState<string | null>();
  const [geminiApiKey, setGeminiApiKey] = useState<string | null>();
  const [geminiClient, setGeminiClient] = useState<GoogleGenerativeAI | null>();
  const [connection, setConnection] = useState<LiveClient | null>();
  const [isListening, setListening] = useState(false);
  const [isLoadingKey, setLoadingKey] = useState(true);
  const [isLoading, setLoading] = useState(true);
  const [isProcessing, setProcessing] = useState(false);
  const [micOpen, setMicOpen] = useState(false);
  const [microphone, setMicrophone] = useState<MediaRecorder | null>();
  const [userMedia, setUserMedia] = useState<MediaStream | null>();
  const [caption, setCaption] = useState<string | null>();
  const [audio, setAudio] = useState<HTMLAudioElement | null>();
  
  // Mikrofon açma/kapama
  const toggleMicrophone = useCallback(async () => {
    if (microphone && userMedia) {
      setUserMedia(null);
      setMicrophone(null);

      microphone.stop();
    } else {
      const userMedia = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      const microphone = new MediaRecorder(userMedia);
      microphone.start(500);

      microphone.onstart = () => {
        setMicOpen(true);
      };

      microphone.onstop = () => {
        setMicOpen(false);
      };

      microphone.ondataavailable = (e) => {
        add(e.data);
      };

      setUserMedia(userMedia);
      setMicrophone(microphone);
    }
  }, [add, microphone, userMedia]);

  // API anahtarlarını alma
  useEffect(() => {
    if (!geminiApiKey) {
      console.log("Gemini API anahtarı alınıyor...");
      fetch("/api/gemini", { cache: "no-store" })
        .then((res) => res.json())
        .then((object) => {
          if (!("apiKey" in object)) throw new Error("Gemini API anahtarı bulunamadı");
          console.log("Gemini API anahtarı alındı");
          setGeminiApiKey(object.apiKey);
          const genAI = new GoogleGenerativeAI(object.apiKey);
          setGeminiClient(genAI);
          setLoadingKey(false);
        })
        .catch((e) => {
          console.error("Gemini API anahtarı alınamadı:", e);
        });
    }
  }, [geminiApiKey]);

  useEffect(() => {
    if (!openaiApiKey) {
      console.log("OpenAI API anahtarı alınıyor...");
      fetch("/api/openai", { cache: "no-store" })
        .then((res) => res.json())
        .then((object) => {
          if (!("apiKey" in object)) throw new Error("OpenAI API anahtarı bulunamadı");
          console.log("OpenAI API anahtarı alındı");
          setOpenaiApiKey(object.apiKey);
          setLoadingKey(false);
        })
        .catch((e) => {
          console.error("OpenAI API anahtarı alınamadı:", e);
        });
    }
  }, [openaiApiKey]);

  useEffect(() => {
    if (!apiKey) {
      console.log("Deepgram API anahtarı alınıyor...");
      fetch("/api/deepgram", { cache: "no-store" })
        .then((res) => res.json())
        .then((object) => {
          if (!("key" in object)) throw new Error("Deepgram API anahtarı bulunamadı");
          console.log("Deepgram API anahtarı alındı");
          setApiKey(object);
          setLoadingKey(false);
        })
        .catch((e) => {
          console.error("Deepgram API anahtarı alınamadı:", e);
        });
    }
  }, [apiKey]);

  // Deepgram bağlantısı kurma
  useEffect(() => {
    if (apiKey && "key" in apiKey) {
      console.log("Deepgram'a bağlanılıyor...");
      const deepgram = createClient(apiKey?.key ?? "");
      const connection = deepgram.listen.live({
        model: "nova-2",
        language: "tr",
        smart_format: true
      });

      connection.on(LiveTranscriptionEvents.Open, () => {
        console.log("Bağlantı kuruldu");
        setListening(true);
      });

      connection.on(LiveTranscriptionEvents.Error, (error) => {
        console.error("Deepgram bağlantı hatası:", error);
      });

      connection.on(LiveTranscriptionEvents.Warning, (warning) => {
        console.warn("Deepgram uyarısı:", warning);
      });

      connection.on(LiveTranscriptionEvents.Close, () => {
        console.log("Bağlantı kapandı");
        setListening(false);
        setApiKey(null);
        setConnection(null);
      });

      connection.on(LiveTranscriptionEvents.Transcript, async (data) => {
        console.log("Deepgram'dan metin alındı");
        const words = data.channel.alternatives[0].words;
        const caption = words
          .map((word: any) => word.punctuated_word ?? word.word)
          .join(" ");
        if (caption !== "") {
          console.log("Tanınan metin:", caption);
          setCaption(caption);
          if (data.is_final) {
            if (geminiClient && agent) {
              try {
                console.log("Gemini API'ye istek gönderiliyor...");
                const model = geminiClient.getGenerativeModel({ 
                  model: "gemini-2.0-flash",
                  generationConfig: {
                    maxOutputTokens: 100, // Token sayısını sınırlayarak yanıt uzunluğunu kısıtla
                    temperature: 0.7,     // Biraz yaratıcılık için
                    topP: 0.9,            // Daha tutarlı yanıtlar için
                  }
                });
                
                // Agent'ın özelleştirilmiş prompt'unu kullanma
                const prompt = `${agent.prompt} Kullanıcının söylediği: "${caption}"

ÖNEMLİ: Lütfen kısa ve öz cevaplar ver. Maksimum 1-2 cümle kullan. Uzun açıklamalardan kaçın.`;
                
                const result = await model.generateContent(prompt);
                const response = await result.response;
                const text = response.text();
                
                console.log("Gemini yanıtı:", text);
                
                if (text) {
                  setCaption(text);
                  
                  if (openaiApiKey) {
                    try {
                      // OpenAI TTS API kullanarak TTS yapma
                      console.log("OpenAI TTS denemesi yapılıyor...");
                      
                      fetch("https://api.openai.com/v1/audio/speech", {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                          "Authorization": `Bearer ${openaiApiKey}`
                        },
                        body: JSON.stringify({
                          model: "tts-1-hd", // Daha yüksek kaliteli model
                          voice: agent.voice,  // Agent'a özel ses
                          input: text,
                          speed: 1.0
                        })
                      })
                      .then(response => {
                        if (!response.ok) {
                          console.log(`OpenAI TTS HTTP Hatası: ${response.status} - ${response.statusText}`);
                          throw new Error(`HTTP hata: ${response.status}`);
                        }
                        return response.arrayBuffer();
                      })
                      .then(arrayBuffer => {
                        const blob = new Blob([arrayBuffer], { type: "audio/mpeg" });
                        const url = URL.createObjectURL(blob);
                        
                        const audio = new Audio(url);
                        setAudio(audio);
                        console.log("OpenAI TTS ses çalınıyor");
                        
                        audio.play().catch(error => {
                          console.error("Ses çalma hatası:", error);
                          // Ses çalma hatası durumunda tarayıcı TTS kullan
                          browserTTS(text);
                        });
                      })
                      .catch(error => {
                        console.error("OpenAI TTS API hatası:", error);
                        // API hatası durumunda browser TTS kullanma
                        browserTTS(text);
                      });
                      
                    } catch (error) {
                      console.error("OpenAI TTS yapılandırma hatası:", error);
                      // Hata durumunda browser TTS kullanma
                      browserTTS(text);
                    }
                  } else {
                    // API anahtarı yoksa browser TTS kullanma
                    browserTTS(text);
                  }
                }
              } catch (error) {
                console.error("Gemini API hatası:", error);
              }
            }
          }
        }
      });

      setConnection(connection);
      setLoading(false);
    }
  }, [apiKey, agent, geminiClient, openaiApiKey]);

  // Queue işlemleri
  useEffect(() => {
    const processQueue = async () => {
      if (size > 0 && !isProcessing) {
        setProcessing(true);

        if (isListening) {
          const blob = first;
          connection?.send(blob);
          remove();
        }

        const waiting = setTimeout(() => {
          clearTimeout(waiting);
          setProcessing(false);
        }, 250);
      }
    };

    processQueue();
  }, [connection, queue, remove, first, size, isProcessing, isListening]);

  function handleAudio() {
    return audio && audio.currentTime > 0 && !audio.paused && !audio.ended && audio.readyState > 2;
  }

  // Browser-native SpeechSynthesis API'sini kullanarak ses sentezleme
  function browserTTS(text: string) {
    if ('speechSynthesis' in window) {
      console.log("Tarayıcı TTS kullanılıyor...");
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'tr-TR';
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      
      // Sesleri yükle ve Türkçe sesi bul
      let voices = window.speechSynthesis.getVoices();
      if (voices.length === 0) {
        // Sesler henüz yüklenmediyse, yüklendikten sonra çalıştır
        window.speechSynthesis.onvoiceschanged = () => {
          voices = window.speechSynthesis.getVoices();
          const turkishVoice = voices.find(voice => voice.lang.includes('tr'));
          if (turkishVoice) {
            utterance.voice = turkishVoice;
            console.log("Türkçe ses kullanılıyor:", turkishVoice.name);
          } else {
            console.log("Türkçe ses bulunamadı, varsayılan ses kullanılıyor");
          }
          window.speechSynthesis.speak(utterance);
        };
      } else {
        // Sesler zaten yüklendiyse
        const turkishVoice = voices.find(voice => voice.lang.includes('tr'));
        if (turkishVoice) {
          utterance.voice = turkishVoice;
          console.log("Türkçe ses kullanılıyor:", turkishVoice.name);
        } else {
          console.log("Türkçe ses bulunamadı, varsayılan ses kullanılıyor");
        }
        window.speechSynthesis.speak(utterance);
      }
    } else {
      console.error("Tarayıcınız SpeechSynthesis API'sini desteklemiyor.");
    }
  }

  if (!agent) return null;
  
  if (isLoadingKey)
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
          <span className="text-xl">API anahtarları yükleniyor...</span>
        </div>
      </div>
    );
    
  if (isLoading)
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
          <span className="text-xl">Bağlantı kuruluyor...</span>
        </div>
      </div>
    );

  return (
    <div className="h-full flex flex-col">
      <div className="bg-white border-b p-4 flex justify-between items-center">
        <div className="flex items-center">
          <button 
            onClick={() => router.push('/dashboard/voice-agents')}
            className="mr-4 p-2 rounded-full hover:bg-gray-100"
            aria-label="Geri Git"
          >
            <FiArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-semibold text-gray-800">{agent.name}</h1>
            <p className="text-sm text-gray-500">{agent.description}</p>
          </div>
        </div>
        <button 
          className="p-2 rounded-full hover:bg-gray-100"
          onClick={() => router.push(`/dashboard/voice-agents/${agent.id}/edit`)}
          aria-label="Ayarlar"
        >
          <FiSettings size={20} />
        </button>
      </div>
      
      <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 p-6">
        <div className="w-full max-w-3xl mx-auto flex flex-col items-center">
          <div className="relative w-full h-24 mb-12">
            <Siriwave
              theme="ios9"
              autostart={handleAudio() || false}
            />
          </div>
          
          <button 
            className={`w-24 h-24 rounded-full flex items-center justify-center transition-colors ${micOpen ? 'bg-red-100' : 'bg-blue-100 hover:bg-blue-200'}`}
            onClick={toggleMicrophone}
          >
            <FiMic 
              size={48} 
              className={`transition-colors ${micOpen ? 'text-red-500' : 'text-blue-600'}`} 
            />
          </button>
          
          <div className="mt-12 p-6 max-w-xl w-full mx-auto bg-white rounded-lg shadow-sm border border-gray-200 min-h-[120px]">
            <p className="text-xl text-center text-gray-800">
              {caption || `Mikrofona tıklayıp ${agent.name} ile konuşmaya başlayın.`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 