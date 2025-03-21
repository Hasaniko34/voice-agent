import { NextRequest, NextResponse } from 'next/server';
import twilio from 'twilio';

// Twilio client'ı başlatın
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

// Twilio client'ı oluştur
const client = twilio(accountSid, authToken);

export async function POST(request: NextRequest) {
  try {
    // İstek gövdesini JSON olarak çözümle
    const body = await request.json();
    const { callSid, mute } = body;

    // Gerekli parametreleri kontrol et
    if (!callSid) {
      return NextResponse.json({ error: 'Call SID gereklidir' }, { status: 400 });
    }

    if (mute === undefined) {
      return NextResponse.json({ error: 'Mute parametresi gereklidir' }, { status: 400 });
    }

    if (!accountSid || !authToken) {
      return NextResponse.json({ error: 'Twilio kimlik bilgileri eksik' }, { status: 500 });
    }

    // Not: Twilio Node.js SDK'sı doğrudan "muted" özelliğini desteklemiyor
    // Bu nedenle şu an için sadece durumu simüle ediyoruz
    // Gerçek bir uygulamada Twilio Client JS SDK kullanılabilir veya
    // Twilio'nun diğer özelliklerinden yararlanılabilir
    
    console.log(`Mikrofon durumu ${mute ? 'sessize alındı' : 'açıldı'} (simüle edildi)`);

    // Başarılı yanıt döndür
    return NextResponse.json({ success: true, muted: mute });
  } catch (error) {
    console.error('Twilio mikrofon güncelleme hatası:', error);
    
    // Hata yanıtı döndür
    return NextResponse.json(
      { error: `Mikrofon durumu değiştirilemedi: ${(error as Error).message}` },
      { status: 500 }
    );
  }
} 