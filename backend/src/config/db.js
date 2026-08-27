const mongoose = require('mongoose');

const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/skinmatch';
  try {
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`✅ MongoDB Bağlantısı Başarılı: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    console.warn(`⚠️ MongoDB Bağlantı Uyarısı: ${error.message}`);
    console.warn('ℹ️ Uygulama veritabanı olmadan da test edilebilir modda başlatılıyor...');
  }
};

module.exports = connectDB;
