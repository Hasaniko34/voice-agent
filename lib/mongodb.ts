import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI ortam değişkeni tanımlanmamış. Lütfen .env.local dosyasını kontrol edin.');
}

console.log('MongoDB URI kontrol edildi, devam ediliyor...');

/**
 * Global değişken tanımlayarak, sıcak yeniden yükleme sırasında bağlantının yeniden kurulmasını önler
 */
interface GlobalMongo {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// global tanımı
declare global {
  var mongooseConnection: GlobalMongo;
}

// Global değişkeni başlat
if (!global.mongooseConnection) {
  global.mongooseConnection = {
    conn: null,
    promise: null,
  };
}

// Cached değişkeni
const cached = global.mongooseConnection;

export async function connectToDatabase() {
  try {
    if (cached.conn) {
      console.log('MongoDB önbelleklenmiş bağlantı kullanılıyor');
      return cached.conn;
    }

    if (!cached.promise) {
      const opts = {
        bufferCommands: false,
      };

      console.log('MongoDB bağlantısı başlatılıyor...');
      cached.promise = mongoose.connect(MONGODB_URI as string, opts).then((mongoose) => {
        console.log('MongoDB bağlantısı başarıyla kuruldu');
        return mongoose;
      });
    }

    try {
      console.log('MongoDB promise bekliyor...');
      cached.conn = await cached.promise;
      console.log('MongoDB promise alındı, bağlantı başarılı');
    } catch (e) {
      console.error('MongoDB bağlantı hatası:', e);
      cached.promise = null;
      throw e;
    }

    return cached.conn;
  } catch (error) {
    console.error('MongoDB bağlantı işlevinde hata:', error);
    throw error;
  }
} 