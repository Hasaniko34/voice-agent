import mongoose, { Schema, model, models } from 'mongoose';

// User şeması
const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, 'E-posta adresi gereklidir'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
        'Lütfen geçerli bir e-posta adresi girin',
      ],
    },
    name: {
      type: String,
      required: [true, 'Ad Soyad gereklidir'],
      trim: true,
      maxlength: [100, 'Ad Soyad 100 karakterden fazla olamaz'],
    },
    password: {
      type: String,
      required: [true, 'Şifre gereklidir'],
      minlength: [6, 'Şifre en az 6 karakter olmalıdır'],
    },
    company: {
      type: String,
      required: false,
      trim: true,
      maxlength: [200, 'Şirket adı 200 karakterden fazla olamaz'],
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    lastLogin: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true, // createdAt ve updatedAt alanlarını otomatik ekler
  }
);

// Var olan modeli kullan veya yeni model oluştur
// Next.js hot reloading için önemli
const User = models.User || model('User', userSchema);

export default User; 