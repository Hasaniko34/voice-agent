import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import { hashPassword, generateToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const body = await request.json();
    
    // Gerekli alanları kontrol et
    if (!body.email || !body.password || !body.name) {
      return NextResponse.json(
        { error: 'Gerekli alanlar eksik: email, password ve name gereklidir' },
        { status: 400 }
      );
    }
    
    // Email formatı kontrolü
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: 'Geçersiz email formatı' },
        { status: 400 }
      );
    }
    
    // Şifre uzunluğu kontrolü
    if (body.password.length < 6) {
      return NextResponse.json(
        { error: 'Şifre en az 6 karakter olmalıdır' },
        { status: 400 }
      );
    }
    
    // Email kullanımda mı kontrolü
    const existingUser = await User.findOne({ email: body.email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { error: 'Bu email adresi ile kayıtlı bir kullanıcı zaten mevcut' },
        { status: 409 }
      );
    }
    
    // Şifreyi hashle
    const hashedPassword = await hashPassword(body.password);
    
    // Yeni kullanıcı oluştur
    const user = await User.create({
      email: body.email.toLowerCase(),
      name: body.name,
      password: hashedPassword,
      company: body.company || '',
    });
    
    // Password alanını gizle
    const userData = user.toObject();
    delete userData.password;
    
    // JWT token oluştur
    const token = generateToken(user._id.toString());
    
    console.log('Yeni kullanıcı oluşturuldu:', user.email);
    
    return NextResponse.json(
      { 
        user: userData, 
        token,
        message: 'Kullanıcı başarıyla oluşturuldu' 
      }, 
      { status: 201 }
    );
  } catch (error) {
    console.error('Kullanıcı kaydı hatası:', error);
    return NextResponse.json(
      { error: 'Kullanıcı oluşturulamadı' }, 
      { status: 500 }
    );
  }
} 