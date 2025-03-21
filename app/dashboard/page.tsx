'use client'

import Link from 'next/link';
import { FiMic, FiArrowRight } from 'react-icons/fi';

export default function Dashboard() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8">Sesli Asistan Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Sesli Asistan</h2>
              <FiMic className="text-blue-600" size={24} />
            </div>
            <p className="text-gray-600 mb-4">
              Ana sayfadaki sesli asistan ile hemen konuşmaya başlayabilirsiniz.
            </p>
            <div className="flex justify-end">
              <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800">
                Asistana Git <FiArrowRight className="ml-1" />
              </Link>
            </div>
          </div>
        </div>
          
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Geliştirici Rehberi</h2>
            </div>
            <p className="mb-2">Bu uygulama ile şunları yapabilirsiniz:</p>
            <ul className="list-disc pl-5 space-y-2 mt-2 mb-4">
              <li>Ana sayfadaki mikrofon arayüzünü kullanarak sesli asistanla konuşabilirsiniz</li>
              <li>Voice Agents sayfasında kendi sesli asistanlarınızı oluşturabilir ve özelleştirebilirsiniz</li>
              <li>Farklı sesli asistanları farklı amaçlar için kullanabilirsiniz</li>
            </ul>
            <div className="flex justify-end">
              <Link href="/docs" className="text-blue-600 hover:underline">
                Daha fazla bilgi &rarr;
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Özellikler</h2>
            </div>
            <p className="mb-2">Bu sesli asistan uygulaması şu özelliklere sahiptir:</p>
            <ul className="list-disc pl-5 space-y-2 mt-2 mb-4">
              <li>Deepgram&apos;ın gelişmiş Nova-2 modeli ile Türkçe konuşma tanıma</li>
              <li>Gemini AI ile doğal dilde sohbet ve sorulara yanıt</li>
              <li>OpenAI&apos;ın TTS-1-HD ses modeli ile gerçekçi Türkçe sesli cevaplar</li>
              <li>Özelleştirilebilir agent&apos;lar (kişilik, ses tonu, uzmanlık alanı)</li>
            </ul>
            <div className="flex justify-end">
              <Link href="/features" className="text-blue-600 hover:underline">
                Tüm özellikleri keşfedin &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 