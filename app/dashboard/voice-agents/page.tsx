'use client'

import Link from 'next/link';
import { useState } from 'react';
import { FiPlus, FiMic, FiMessageSquare, FiEdit, FiTrash2 } from 'react-icons/fi';
import { useRouter } from 'next/navigation';

// Voice Agent tipi
type VoiceAgent = {
  id: string;
  name: string;
  description: string;
  prompt: string;
  voice: string;
  createdAt: Date;
};

// Örnek veri
const demoAgents: VoiceAgent[] = [
  {
    id: '1',
    name: 'Türkçe Asistan',
    description: 'Türkçe konuşan ve yanıt veren bir asistan',
    prompt: 'Sen Türkçe konuşan yardımcı bir asistansın. Kullanıcının sorularına nazik ve bilgilendirici bir şekilde cevap ver.',
    voice: 'shimmer',
    createdAt: new Date('2023-03-15')
  },
  {
    id: '2',
    name: 'Müzik Uzmanı',
    description: 'Müzik hakkında bilgi veren bir agent',
    prompt: 'Sen bir müzik uzmanısın. Müzik türleri, sanatçılar ve albümler hakkında detaylı bilgi verebilirsin.',
    voice: 'nova',
    createdAt: new Date('2023-03-16')
  }
];

export default function VoiceAgents() {
  const router = useRouter();
  const [agents, setAgents] = useState<VoiceAgent[]>(demoAgents);
  
  // Agent silme işlevi
  const deleteAgent = (id: string) => {
    setAgents(agents.filter(agent => agent.id !== id));
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Voice Agents</h1>
        <Link
          href="/dashboard/voice-agents/create"
          className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
        >
          <FiPlus className="mr-2" />
          Voice Agent Oluştur
        </Link>
      </div>
      
      {agents.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <FiMic className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-lg font-medium text-gray-800 mb-2">Henüz Voice Agent Yok</h3>
          <p className="text-gray-600 mb-6">İlk voice agent&apos;ınızı oluşturmak için &quot;Voice Agent Oluştur&quot; butonuna tıklayın.</p>
          <Link
            href="/dashboard/voice-agents/create"
            className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            <FiPlus className="mr-2" />
            Voice Agent Oluştur
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {agents.map(agent => (
            <div key={agent.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{agent.name}</h3>
                <p className="text-gray-600 mb-4">{agent.description}</p>
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <span className="mr-4">Ses: {agent.voice}</span>
                  <span>Oluşturulma: {agent.createdAt.toLocaleDateString('tr-TR')}</span>
                </div>
              </div>
              
              <div className="border-t border-gray-200 bg-gray-50 px-6 py-3 flex justify-between">
                <div className="flex space-x-2">
                  <button 
                    className="p-2 text-gray-600 hover:text-blue-600 rounded hover:bg-gray-100"
                    onClick={() => router.push(`/dashboard/voice-agents/${agent.id}/edit`)}
                    aria-label="Düzenle"
                  >
                    <FiEdit size={18} />
                  </button>
                  <button 
                    className="p-2 text-gray-600 hover:text-red-600 rounded hover:bg-gray-100"
                    onClick={() => deleteAgent(agent.id)}
                    aria-label="Sil"
                  >
                    <FiTrash2 size={18} />
                  </button>
                </div>
                
                <Link
                  href={`/dashboard/voice-agents/${agent.id}/chat`}
                  className="flex items-center text-blue-600 hover:text-blue-700 font-medium"
                >
                  <FiMessageSquare className="mr-2" />
                  Konuş
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 