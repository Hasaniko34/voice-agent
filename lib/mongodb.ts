import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI ortam değişkeni tanımlanmamış. Lütfen .env.local dosyasını kontrol edin.');
}

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
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI as string, opts).then((mongoose) => {
      console.log('MongoDB bağlantısı başarıyla kuruldu');
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
} 