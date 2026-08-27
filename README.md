# 🌸 SkinMatch App

> **Akıllı Cilt Tipi Analizi**  
> *Non-medical Cosmetic Skin Analysis & Smart Skincare Reader*

[![Status](https://img.shields.io/badge/Status-In%20Active%20Development%20(WIP)-orange.svg)](https://github.com/)
[![React Native](https://img.shields.io/badge/Frontend-React%20Native%20(Expo)-61DAFB.svg)](https://reactnative.dev/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js%20%7C%20Express-339933.svg)](https://nodejs.org/)
[![AI Engine](https://img.shields.io/badge/AI-Google%20Gemini%20API-8E75B2.svg)](https://aistudio.google.com/)
[![Database](https://img.shields.io/badge/Database-MongoDB%20%26%20Redis-47A248.svg)](https://www.mongodb.com/)

---

> ⚠️ **Not:** Bu proje şu anda aktif geliştirme aşamasındadır (Work in Progress). Arayüzler ve API uç noktaları sürekli güncellenmektedir.

---

## 📖 Proje Hakkında

**SkinMatch App**, kullanıcıların kozmetik cilt tipini (Yağlı, Kuru, Karma, Normal, Hassas) ve cilt bariyeri sağlığını hibrit bir yöntemle (Yüz Görsel Analizi + Dinamik Mantık Ağaçlı Anket) belirleyen modern bir mobil uygulamadır.

Kullanıcılar herhangi bir cilt bakım ürününün arkasındaki içerik tablosunu (INCI listesi) kamerayla tarattığında; **Google Gemini AI** motoru ham metindeki harf/okuma hatalarını tolere ederek formülü ayrıştırır, kullanıcının cilt profiline özel **Uyum Skoru (%0-100)** hesaplar ve hangi bileşenlerin faydalı veya potansiyel olarak tahriş edici olduğunu anlaşılır bir dille açıklar.

---

## ✨ Temel Özellikler

### 1. 🧬 Hibrit Cilt Tipi Analiz Modülü
- **Görsel Metrik Analizi:** T-bölgesi parlaması (sebum), kızarıklık ve gözenek görünümünü değerlendiren ön kamera kılavuzlu arayüz.
- **Dinamik Mantık Ağaçlı Anket:** Cildin gün içindeki tepkilerini, nemsizlik durumunu ve hassasiyetlerini ölçen akıllı soru akışı.
- **Bariyer ve Profil Çıkarımı:** Cilt tipi, öncelikli endişeler ve kaçınılması gereken bileşenler listesi.

### 2. 🔍 Akıllı İçerik Tarayıcı & Eşleştirici (OCR + Gemini AI)
- **Hata Toleranslı OCR:** Yansıma veya açı kaynaklı harf hatalarını (*örn: `Nlacinamlde` ➔ `Niacinamide`*) doğru kozmetik INCI kimyasalına eşleyen akıllı prompt mimarisi.
- **Kişiye Özel Uyum Skoru:** Formülasyonun kullanıcının cilt profiliyle ne kadar uyumlu olduğunu gösteren dinamik skorlama.
- **Kahraman ve Riskli Bileşen Rozetleri:**
  - 🌟 **Öne Çıkan Aktifler:** Cilt endişesine doğrudan çözüm sunan maddeler ve faydaları.
  - ⚠️ **Dikkat Gerektirenler:** Alkol, sentetik koku, yüksek komedojenik yağlar ve tahriş riski uyarıları.

### 3. ☀️ Rutin & Çevresel Dashboard
- **Canlı UV İndeksi & İpuçları:** Güneş koruyucu yenileme hatırlatıcıları ve hava durumuna göre günlük cilt bariyeri tavsiyeleri.
- **Sabah & Akşam Rutini:** Taranan ürünleri favorilere veya rutin adımlarına (Temizleyici, Serum, Nemlendirici, Güneş Kremi) kaydetme.

---

## 🛠️ Teknoloji Yığını

| Katman | Teknoloji / Kütüphane |
| :--- | :--- |
| **Mobil Frontend** | React Native, Expo SDK, TypeScript, React Navigation |
| **Backend API** | Node.js, Express.js, Helmet, CORS |
| **Yapay Zeka (LLM)** | Google Gemini API (Structured Outputs / JSON Mode) |
| **Veritabanı & Cache** | MongoDB (Mongoose ODM), Redis / In-Memory Caching |
| **Güvenlik & Koruma** | `express-rate-limit` (AI uç noktaları maliyet ve abuse koruması) |

---

## 📁 Proje Mimarisi ve Dizin Yapısı

```
SkinMatchApp/
├── backend/
│   ├── src/
│   │   ├── config/          # Veritabanı, Redis ve Gemini AI bağlantıları
│   │   ├── controllers/     # Cilt analizi, tarama ve rutin iş mantığı
│   │   ├── middleware/      # Rate Limiter & Global Hata Yakalayıcılar
│   │   ├── models/          # User, ScanHistory ve Ingredient Mongoose şemaları
│   │   ├── routes/          # Express API yönlendirmeleri
│   │   ├── services/        # Gemini AI servisi ve OCR metin temizleyici
│   │   ├── types/           # Katı JSON şemaları
│   │   └── server.js        # Sunucu giriş noktası
│   ├── .env.example
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── api/             # Backend iletişim katmanı (Axios)
    │   ├── components/      # Yeniden kullanılabilir UI bileşenleri
    │   ├── screens/         # Scanner, Sonuç, Profil ve Rutin ekranları
    │   ├── theme/           # Renk paleti, tipografi ve tasarım sistemi
    │   └── types/           # TypeScript arayüzleri
    ├── App.tsx
    ├── app.json
    └── package.json
```

---

## 🚀 Kurulum ve Yerel Geliştirme

### 1. Depoyu Klonlayın
```bash
git clone https://github.com/your-username/SkinMatchApp.git
cd SkinMatchApp
```

### 2. Backend Kurulumu
```bash
cd backend
npm install
cp .env.example .env
```
> `.env` dosyasını açıp `MONGODB_URI` ve Google AI Studio'dan aldığınız `GEMINI_API_KEY` değerlerini tanımlayın.

Sunucuyu başlatın:
```bash
npm run dev
# API Sağlık Kontrolü: http://localhost:5000/api/health
```

### 3. Frontend (Expo) Kurulumu
```bash
cd ../frontend
npm install
npx expo start
```

---

## 🔒 Güvenlik ve Uyarı

- **Tıbbi Olmayan Amaç (Non-Medical):** Bu uygulama yalnızca bilgilendirme ve kozmetik ürün rehberliği amaçlıdır. Dermatolojik tanı veya tıbbi tedavi yerine geçmez.
- **Hız Sınırlandırması:** Backend AI uç noktaları, istenmeyen istek trafiği ve maliyet artışını önlemek adına `express-rate-limit` ile sınırlandırılmıştır.

---

## 📄 Lisans

Bu proje özel mülkiyete tabidir. Tüm hakları saklıdır.
