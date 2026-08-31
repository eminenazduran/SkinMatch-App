require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Ingredient = require('../models/Ingredient');

const seedIngredients = async () => {
  const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/skinmatch';

  try {
    console.log('🔄 MongoDB Bağlantısı Kuruluyor...');
    await mongoose.connect(mongoURI);
    console.log('✅ MongoDB Bağlandı.');

    const seedFilePath = path.join(__dirname, 'ingredients.seed.json');
    const rawData = fs.readFileSync(seedFilePath, 'utf-8');
    const ingredients = JSON.parse(rawData);

    console.log(`📦 ${ingredients.length} adet kozmetik bileşen veritabanına aktarılıyor...`);

    let insertedCount = 0;
    let updatedCount = 0;

    for (const item of ingredients) {
      const result = await Ingredient.findOneAndUpdate(
        { inciName: item.inciName },
        item,
        { upsert: true, new: true, rawResult: true }
      );

      if (result.lastErrorObject && result.lastErrorObject.updatedExisting) {
        updatedCount++;
      } else {
        insertedCount++;
      }
    }

    console.log(`\n🎉 Başarıyla Tamamlandı!`);
    console.log(`   ➕ Yeni Eklenen: ${insertedCount}`);
    console.log(`   🔄 Güncellenen: ${updatedCount}`);
    console.log(`   📊 Toplam Bileşen: ${ingredients.length}\n`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed Hatası:', error.message);
    process.exit(1);
  }
};

seedIngredients();
