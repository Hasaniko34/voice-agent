import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import { verifyPassword, generateToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const body = await request.json();
    
    // Gerekli alanları kontrol et
    if (!body.email || !body.password) {
      return NextResponse.json(
        { error: 'Email ve şifre gereklidir' },
        { status: 400 }
      );
    }
    
    // Kullanıcıyı email'e göre bul
    const user = await User.findOne({ email: body.email.toLowerCase() });
    
    // Kullanıcı bulunamadı veya şifre doğru değil
    if (!user || !(await verifyPassword(body.password, user.password))) {
      return NextResponse.json(
        { error: 'Email veya şifre hatalı' },
        { status: 401 }
      );
    }
    
    // Son giriş tarihini güncelle
    user.lastLogin = new Date();
    await user.save();
    
    // Password alanını gizle
    const userData = user.toObject();
    delete userData.password;
    
    // JWT token oluştur
    const token = generateToken(user._id.toString());
    
    console.log('Kullanıcı giriş yaptı:', user.email);
    
    return NextResponse.json({
      user: userData,
      token,
      message: 'Giriş başarılı'
    });
  } catch (error) {
    console.error('Giriş hatası:', error);
    return NextResponse.json(
      { error: 'Giriş yapılamadı' },
      { status: 500 }
    );
  }
} 