import mongoose, { Schema, model, models } from 'mongoose';

// Voice Agent için şema
const voiceAgentSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Agent adı gereklidir'],
      trim: true,
      maxlength: [100, 'Agent adı 100 karakterden fazla olamaz'],
    },
    description: {
      type: String,
      required: [true, 'Açıklama gereklidir'],
      trim: true,
      maxlength: [500, 'Açıklama 500 karakterden fazla olamaz'],
    },
    prompt: {
      type: String,
      required: [true, 'Prompt gereklidir'],
      trim: true,
      maxlength: [2000, 'Prompt 2000 karakterden fazla olamaz'],
    },
    voice: {
      type: String,
      required: [true, 'Ses seçimi gereklidir'],
      enum: ['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer'],
      default: 'shimmer',
    },
    userId: {
      type: String,
      required: false, // Opsiyonel, oturum yönetimi eklendiğinde gerekli olabilir
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // createdAt ve updatedAt alanlarını otomatik ekler
  }
);

// Var olan modeli kullan veya yeni model oluştur
// Next.js hot reloading için önemli
const VoiceAgent = models.VoiceAgent || model('VoiceAgent', voiceAgentSchema);

export default VoiceAgent; 