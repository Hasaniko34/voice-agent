import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';

// Memory'de veri tutmak için
let voiceAgents: VoiceAgent[] = [
  {
    id: '1',
    name: 'Türkçe Asistan',
    description: 'Türkçe konuşan ve yanıt veren bir asistan',
    prompt: 'Sen Türkçe konuşan yardımcı bir asistansın. Kullanıcının sorularına nazik ve bilgilendirici bir şekilde cevap ver. Her zaman kısa ve öz yanıt ver, maksimum 1-2 cümle kullan.',
    voice: 'shimmer',
    createdAt: new Date('2023-03-15')
  },
  {
    id: '2',
    name: 'Müzik Uzmanı',
    description: 'Müzik hakkında bilgi veren bir agent',
    prompt: 'Sen bir müzik uzmanısın. Müzik türleri, sanatçılar ve albümler hakkında detaylı bilgi verebilirsin. Cevaplarını her zaman kısa ve öz tut, uzun açıklamalardan kaçın.',
    voice: 'nova',
    createdAt: new Date('2023-03-16')
  }
];

// Voice Agent tipi
export type VoiceAgent = {
  id: string;
  name: string;
  description: string;
  prompt: string;
  voice: string;
  createdAt: Date;
};

// GET - Tüm voice agent'ları getir
export async function GET(request: NextRequest) {
  return NextResponse.json(voiceAgents);
}

// POST - Yeni voice agent oluştur
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    const newAgent: VoiceAgent = {
      id: randomUUID(),
      name: data.name,
      description: data.description,
      prompt: data.prompt,
      voice: data.voice,
      createdAt: new Date()
    };
    
    voiceAgents.push(newAgent);
    
    return NextResponse.json(newAgent, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Geçersiz veri formatı' },
      { status: 400 }
    );
  }
}

// ID'ye göre endpoint
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID parametre olarak verilmelidir' },
        { status: 400 }
      );
    }
    
    const initialLength = voiceAgents.length;
    voiceAgents = voiceAgents.filter(agent => agent.id !== id);
    
    if (voiceAgents.length === initialLength) {
      return NextResponse.json(
        { error: 'Agent bulunamadı' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Bir hata oluştu' },
      { status: 500 }
    );
  }
}

// PUT - Voice agent güncelle
export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    
    if (!data.id) {
      return NextResponse.json(
        { error: 'ID belirtilmelidir' },
        { status: 400 }
      );
    }
    
    const agentIndex = voiceAgents.findIndex(agent => agent.id === data.id);
    
    if (agentIndex === -1) {
      return NextResponse.json(
        { error: 'Agent bulunamadı' },
        { status: 404 }
      );
    }
    
    // Güncelleme yapılıyor ama createdAt değişmiyor
    const updatedAgent = {
      ...voiceAgents[agentIndex],
      name: data.name || voiceAgents[agentIndex].name,
      description: data.description || voiceAgents[agentIndex].description,
      prompt: data.prompt || voiceAgents[agentIndex].prompt,
      voice: data.voice || voiceAgents[agentIndex].voice,
    };
    
    voiceAgents[agentIndex] = updatedAgent;
    
    return NextResponse.json(updatedAgent);
  } catch (error) {
    return NextResponse.json(
      { error: 'Bir hata oluştu' },
      { status: 500 }
    );
  }
} 