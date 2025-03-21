import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import VoiceAgent from '@/models/VoiceAgent';
import { isValidObjectId } from 'mongoose';

// Demo verileri - MongoDB çalışınca bu kaldırılacak
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

// GET - Tüm Voice Agent'ları getir veya ID'ye göre tek agent getir
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    
    // URL'den ID parametresini al
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (id) {
      // ID bir MongoDB ObjectId mi kontrol et
      if (isValidObjectId(id)) {
        // MongoDB'den agent'ı getirmeyi dene
        console.log(`Geçerli ObjectId: ${id}, MongoDB'den aranıyor...`);
        const agent = await VoiceAgent.findById(id);
        
        if (agent) {
          console.log('MongoDB agent bulundu:', agent.name);
          return NextResponse.json(agent);
        }
      }
      
      // MongoDB'de bulunamadı veya geçerli bir ObjectId değil
      console.log(`Agent MongoDB'de bulunamadı veya geçersiz ObjectId, demo verilerde aranıyor: ${id}`);
      
      // Demo verilerinden arama yap
      const demoAgent = demoAgents.find(a => a.id === id);
      
      if (demoAgent) {
        console.log('Demo agent bulundu:', demoAgent.name);
        return NextResponse.json(demoAgent);
      }
      
      return NextResponse.json({ error: 'Agent bulunamadı' }, { status: 404 });
    }
    
    // Tüm agent'ları getir
    console.log('Tüm agent\'lar için MongoDB sorgusu yapılıyor...');
    const agents = await VoiceAgent.find().sort({ createdAt: -1 });
    
    // Eğer hiç agent yoksa demo verileri kullan
    if (agents.length === 0) {
      console.log('MongoDB\'de agent bulunamadı, demo veriler kullanılıyor');
      return NextResponse.json(demoAgents);
    }
    
    console.log(`${agents.length} agent MongoDB'den alındı`);
    return NextResponse.json(agents);
  } catch (error) {
    console.error('Voice Agent getirme hatası:', error);
    return NextResponse.json({ error: 'Voice Agent getirilemedi' }, { status: 500 });
  }
}

// POST - Yeni Voice Agent oluştur
export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const body = await request.json();
    
    // Gerekli alanları kontrol et
    if (!body.name || !body.description || !body.prompt || !body.voice) {
      return NextResponse.json(
        { error: 'Gerekli alanlar eksik: name, description, prompt, voice gereklidir' },
        { status: 400 }
      );
    }
    
    // Yeni agent oluştur
    const agent = await VoiceAgent.create(body);
    console.log('Yeni agent oluşturuldu:', agent.name);
    
    return NextResponse.json(agent, { status: 201 });
  } catch (error) {
    console.error('Voice Agent oluşturma hatası:', error);
    return NextResponse.json({ error: 'Voice Agent oluşturulamadı' }, { status: 500 });
  }
}

// PUT - Voice Agent güncelle
export async function PUT(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const body = await request.json();
    
    // ID kontrolü
    if (!body.id) {
      return NextResponse.json({ error: 'ID gereklidir' }, { status: 400 });
    }
    
    // ID bir MongoDB ObjectId mi kontrol et
    if (!isValidObjectId(body.id)) {
      return NextResponse.json({ error: 'Geçersiz ID formatı' }, { status: 400 });
    }
    
    // Agent'ın var olup olmadığını kontrol et
    const existingAgent = await VoiceAgent.findById(body.id);
    
    if (!existingAgent) {
      return NextResponse.json({ error: 'Agent bulunamadı' }, { status: 404 });
    }
    
    // Agent'ı güncelle
    const updatedAgent = await VoiceAgent.findByIdAndUpdate(
      body.id,
      { 
        name: body.name,
        description: body.description,
        prompt: body.prompt,
        voice: body.voice,
        isPublic: body.isPublic
      },
      { new: true, runValidators: true }
    );
    
    console.log('Agent güncellendi:', updatedAgent?.name);
    return NextResponse.json(updatedAgent);
  } catch (error) {
    console.error('Voice Agent güncelleme hatası:', error);
    return NextResponse.json({ error: 'Voice Agent güncellenemedi' }, { status: 500 });
  }
}

// DELETE - Voice Agent sil
export async function DELETE(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'ID gereklidir' }, { status: 400 });
    }
    
    // ID bir MongoDB ObjectId mi kontrol et
    if (!isValidObjectId(id)) {
      return NextResponse.json({ error: 'Geçersiz ID formatı' }, { status: 400 });
    }
    
    // Agent'ın var olup olmadığını kontrol et
    const existingAgent = await VoiceAgent.findById(id);
    
    if (!existingAgent) {
      return NextResponse.json({ error: 'Agent bulunamadı' }, { status: 404 });
    }
    
    // Agent'ı sil
    await VoiceAgent.findByIdAndDelete(id);
    console.log('Agent silindi:', id);
    
    return NextResponse.json({ message: 'Voice Agent başarıyla silindi' });
  } catch (error) {
    console.error('Voice Agent silme hatası:', error);
    return NextResponse.json({ error: 'Voice Agent silinemedi' }, { status: 500 });
  }
} 