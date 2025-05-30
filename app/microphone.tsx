"use client";

import {
  CreateProjectKeyResponse,
  LiveClient,
  LiveTranscriptionEvents,
  createClient,
} from "@deepgram/sdk";
import { useState, useEffect, useCallback, } from "react";
import { useQueue } from "@uidotdev/usehooks";
import Recording from "./recording.svg";
import axios from "axios";
import Siriwave from 'react-siriwave';
import { GoogleGenerativeAI } from "@google/generative-ai";

export default function Microphone() {
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

  useEffect(() => {
    if (!geminiApiKey) {
      console.log("getting a new gemini api key");
      fetch("/api/gemini", { cache: "no-store" })
        .then((res) => res.json())
        .then((object) => {
          if (!("apiKey" in object)) throw new Error("No gemini api key returned");
          console.log(object);
          setGeminiApiKey(object.apiKey);
          const genAI = new GoogleGenerativeAI(object.apiKey);
          setGeminiClient(genAI);
          setLoadingKey(false);
        })
        .catch((e) => {
          console.error(e);
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
      console.log("getting a new api key");
      fetch("/api/deepgram", { cache: "no-store" })
        .then((res) => res.json())
        .then((object) => {
          if (!("key" in object)) throw new Error("No api key returned");
          console.log(object)
          setApiKey(object);
          setLoadingKey(false);
        })
        .catch((e) => {
          console.error(e);
        });
    }
  }, [apiKey]);

  useEffect(() => {
    if (apiKey && "key" in apiKey) {
      console.log("connecting to deepgram");
      const deepgram = createClient(apiKey?.key ?? "");
      const connection = deepgram.listen.live({
        model: "nova-2",
        language: "tr",
        smart_format: true
      });

      connection.on(LiveTranscriptionEvents.Open, () => {
        console.log("connection established");
        setListening(true);
      });

      connection.on(LiveTranscriptionEvents.Error, (error) => {
        console.error("Deepgram bağlantı hatası:", error);
      });

      connection.on(LiveTranscriptionEvents.Warning, (warning) => {
        console.warn("Deepgram uyarısı:", warning);
      });

      connection.on(LiveTranscriptionEvents.Metadata, (metadata) => {
        console.log("Deepgram metadata:", metadata);
      });

      connection.on(LiveTranscriptionEvents.Close, () => {
        console.log("connection closed");
        setListening(false);
        setApiKey(null);
        setConnection(null);
      });

      connection.on(LiveTranscriptionEvents.Transcript, async (data) => {
        console.log("Deepgram'dan metin alındı:", data);
        const words = data.channel.alternatives[0].words;
        const caption = words
          .map((word: any) => word.punctuated_word ?? word.word)
          .join(" ");
        if (caption !== "") {
          console.log("Tanınan metin:", caption);
          setCaption(caption);
          if (data.is_final) {
            if (geminiClient) {
              try {
                console.log("Gemini API'ye istek gönderiliyor...");
                const model = geminiClient.getGenerativeModel({ 
                  model: "gemini-2.0-flash",
                  generationConfig: {
                    maxOutputTokens: 100, // Token sayısını sınırlayarak yanıt uzunluğunu kısıtla
                    temperature: 0.7,
                    topP: 0.9,
                  }
                });
                
                const prompt = `Sen Türkçe konuşan bir sesli asistansın. Kullanıcı Türkçe konuşuyor ve sen de SADECE Türkçe yanıt vermelisin. Yanıtların kısa ve öz olmalı, maksimum 1-2 cümle kullan. Kullanıcının söylediği: "${caption}"`;
                
                const result = await model.generateContent(prompt);
                const response = await result.response;
                const text = response.text();
                
                console.log("Gemini yanıtı:", text);
                
                if (text) {
                  setCaption(text);
                  
                  if (openaiApiKey) {
                    try {
                      // OpenAI TTS API kullanarak TTS yapın
                      console.log("OpenAI TTS denemesi yapılıyor...");
                      console.log("Kullanılan OpenAI API anahtarı:", openaiApiKey ? "Anahtar mevcut" : "Anahtar yok");
                      
                      fetch("https://api.openai.com/v1/audio/speech", {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                          "Authorization": `Bearer ${openaiApiKey}`
                        },
                        body: JSON.stringify({
                          model: "tts-1-hd", // Daha yüksek kaliteli model
                          voice: "shimmer",  // Türkçe için en uygun ses
                          input: text,
                          speed: 1.0         // Normal hız
                        })
                      })
                      .then(response => {
                        console.log("OpenAI TTS API yanıtı alındı:", response.status, response.statusText);
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
                        console.log("OpenAI TTS ses çalınıyor.");
                        
                        audio.onplay = () => {
                          console.log("Ses çalmaya başladı");
                        };
                        
                        audio.onended = () => {
                          console.log("Ses çalma tamamlandı");
                        };
                        
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
                console.error("Gemini API error:", error);
              }
            }
          }
        }
      });

      setConnection(connection);
      setLoading(false);
    }
  }, [apiKey, geminiClient, openaiApiKey]);

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
      console.log("Okunacak metin:", text);
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'tr-TR';
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      
      utterance.onstart = () => {
        console.log("Browser TTS konuşmaya başladı");
      };
      
      utterance.onend = () => {
        console.log("Browser TTS konuşma bitti");
      };
      
      utterance.onerror = (event) => {
        console.error("Browser TTS hatası:", event);
      };
      
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

  // API anahtarlarının doğru yüklenip yüklenmediğini kontrol eden fonksiyon
  useEffect(() => {
    console.log("API Durum kontrolü:");
    console.log("Deepgram API:", apiKey ? "Yüklendi" : "Yüklenmedi");
    console.log("Gemini API:", geminiApiKey ? "Yüklendi" : "Yüklenmedi");
    console.log("OpenAI API:", openaiApiKey ? "Yüklendi" : "Yüklenmedi");
  }, [apiKey, geminiApiKey, openaiApiKey]);

  if (isLoadingKey)
    return (
      <span className="w-full text-center">API anahtarları yükleniyor...</span>
    );
  if (isLoading)
    return <span className="w-full text-center">Uygulama yükleniyor...</span>;

  return (
    <div className="w-full relative">
      <div className="relative flex w-screen flex justify-center items-center max-w-screen-lg place-items-center content-center before:pointer-events-none after:pointer-events-none before:absolute before:right-0 after:right-1/4 before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[360px]">
        <Siriwave
          theme="ios9"
          autostart={handleAudio() || false}
        />
      </div>
      <div className="mt-10 flex flex-col align-middle items-center">
        <button className="w-24 h-24" onClick={() => toggleMicrophone()}>
          <Recording
            width="96"
            height="96"
            className={
              `cursor-pointer` + !!userMedia && !!microphone && micOpen
                ? "fill-red-400 drop-shadow-glowRed"
                : "fill-gray-600"
            }
          />
        </button>
        <div className="mt-20 p-6 text-xl text-center">
          {caption}
        </div>
      </div>

    </div>
  );
}
