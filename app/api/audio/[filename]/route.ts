import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: { filename: string } }
) {
  try {
    const filename = params.filename;
    const filePath = path.join(process.cwd(), 'public', 'audio', filename);

    // Dosyanın var olup olmadığını kontrol et
    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: 'Dosya bulunamadı' },
        { status: 404 }
      );
    }

    // Dosyayı oku
    const fileBuffer = fs.readFileSync(filePath);
    
    // Dosya türünü belirle
    const contentType = filename.endsWith('.mp3') 
      ? 'audio/mpeg' 
      : filename.endsWith('.wav') 
        ? 'audio/wav' 
        : 'application/octet-stream';

    // Dosyayı döndür
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Content-Length': fileBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error('Ses dosyası okunurken hata:', error);
    return NextResponse.json(
      { error: 'Ses dosyası işlenirken bir hata oluştu' },
      { status: 500 }
    );
  }
} 