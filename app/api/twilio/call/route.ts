import { NextRequest, NextResponse } from 'next/server';
import twilio from 'twilio';

// Twilio client'ı başlatın
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

// Twilio client'ı oluştur
const client = twilio(accountSid, authToken);

// Arama başlat
export async function POST(request: NextRequest) {
  try {
    // İstek gövdesini JSON olarak çözümle
    const body = await request.json();
    const { to } = body;

    // Gerekli parametreleri kontrol et
    if (!to) {
      return NextResponse.json({ error: 'Telefon numarası gereklidir' }, { status: 400 });
    }

    if (!accountSid || !authToken || !twilioPhoneNumber) {
      return NextResponse.json({ error: 'Twilio kimlik bilgileri eksik' }, { status: 500 });
    }

    // Arama oluştur - Twilio'nun Voice TwiML ile arama
    const call = await client.calls.create({
      to: to,
      from: twilioPhoneNumber,
      twiml: '<Response><Say language="tr-TR">Merhaba, bu bir test aramasıdır.</Say><Pause length="1"/><Say language="tr-TR">Arama sonlandırılıyor.</Say></Response>',
    });

    // Başarılı yanıt döndür
    return NextResponse.json({ callSid: call.sid });
  } catch (error) {
    console.error('Twilio arama hatası:', error);
    
    // Hata yanıtı döndür
    return NextResponse.json(
      { error: `Arama başlatılamadı: ${(error as Error).message}` },
      { status: 500 }
    );
  }
}

// Aramayı sonlandır
export async function DELETE(request: NextRequest) {
  try {
    // İstek gövdesini JSON olarak çözümle
    const body = await request.json();
    const { callSid } = body;

    // Gerekli parametreleri kontrol et
    if (!callSid) {
      return NextResponse.json({ error: 'Call SID gereklidir' }, { status: 400 });
    }

    if (!accountSid || !authToken) {
      return NextResponse.json({ error: 'Twilio kimlik bilgileri eksik' }, { status: 500 });
    }

    // Aramayı bul ve sonlandır
    await client.calls(callSid).update({ status: 'completed' });

    // Başarılı yanıt döndür
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Twilio arama sonlandırma hatası:', error);
    
    // Hata yanıtı döndür
    return NextResponse.json(
      { error: `Arama sonlandırılamadı: ${(error as Error).message}` },
      { status: 500 }
    );
  }
} 