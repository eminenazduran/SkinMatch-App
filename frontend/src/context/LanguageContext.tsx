import React, { createContext, useContext, useState } from 'react';

export type Language = 'tr' | 'en';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  tr: {
    // Navigasyon & Alt Bar
    nav_dashboard: 'Panel',
    nav_scan: 'Tara',
    nav_routine: 'Rutinim',
    nav_profile: 'Profilim',

    // Ana Sayfa (Dashboard)
    home_status: 'DURUM',
    home_balanced: 'Dengeli',
    home_skin_type: 'Karma Cilt',
    home_barrier_label: 'Bariyer:',
    home_barrier_ideal: 'İdeal',
    home_environment: 'ÇEVRE',
    home_high: 'Yüksek',
    home_uv_val: 'UV 6.4',
    home_uv_sub: 'SPF 50 önerilir',
    home_daily_analysis_title: 'Günlük Cilt Analizi',
    home_daily_analysis_desc: 'Yapay zeka taramasıyla cildinin bugünkü ihtiyaçlarını keşfet.',
    home_scan_btn: 'Tara ve Analiz Et',
    home_morning_routine: 'Sabah Rutini',
    home_see_all: 'Tümünü Gör',
    home_step1_tag: 'ADIM 1',
    home_step1_name: 'Nazik Temizleyici',
    home_step2_tag: 'ADIM 2',
    home_step2_name: 'Hyalüronik Asit Serumu',
    home_step3_tag: 'ADIM 3',
    home_step3_name: 'SPF 50+ Güneş Kremi',
    home_tip_title: 'İpucu',
    home_tip_desc: 'Niasinamid gözenek görünümünü küçültmeye yardımcı olur. Özellikle T bölgesindeki sebum üretimini dengelemek için sabah rutinine ekleyebilirsin.',

    // Rutin Ekranı
    routine_title: 'Cilt Bakım Rutinim',
    routine_morning: 'Sabah',
    routine_evening: 'Akşam',
    routine_conflict_title: 'Dikkat',
    routine_conflict_desc: 'Retinol ve C Vitamini aynı rutinde tahriş yapabilir. Akşam rutinine ayırmayı düşünün.',
    routine_cat_cleanser: 'TEMİZLEYİCİ',
    routine_cat_toner: 'TONİK',
    routine_cat_serum: 'SERUM',
    routine_cat_moisturizer: 'NEMLENDİRİCİ',
    routine_match_suffix: 'Uyum',
    routine_conflict_tag: 'Çatışma',

    // Profil Ekranı
    profile_greeting: 'Merhaba, Elif.',
    profile_desc_start: 'Cilt profiliniz ',
    profile_desc_highlight: 'Karma & Nemsiz',
    profile_desc_end: ' bir durumu işaret ediyor. Bariyer onarımına ve neme odaklanmanızı öneririz.',
    profile_btn_retake: 'Anketi Yeniden Çöz',
    profile_btn_face_scan: 'Yeni Yüz Analizi',
    profile_barrier_health: 'BARİYER SAĞLIĞI',
    profile_ingredient_heading: 'İçerik Tercihleri',
    profile_love_title: 'Sevilenler',
    profile_love_desc: 'Cildinizin nem ve bariyer onarımı için en iyi tepki verdiği içerikler.',
    profile_avoid_title: 'Kaçınılacaklar',
    profile_avoid_desc: 'Cildinizde nemsizlik veya tahrişi tetiklediği bilinen içerikler.',
    profile_pill_ceramides: 'Seramidler',
    profile_pill_niacinamide: 'Niasinamid',
    profile_pill_hyaluronic: 'Hyalüronik Asit',
    profile_pill_alcohol: 'Alkol Denat',
    profile_pill_fragrance: 'Sentetik Parfüm',
    profile_pill_essential_oils: 'Uçucu Yağlar',

    // Ürün Analiz Sonucu
    result_suitable: 'Uygun',
    result_add_morning: 'Sabah Rutinine Ekle',
    result_add_favorites: 'Favorilere Ekle',
    result_key_ingredients: 'Anahtar İçerikler',
    result_high_match: 'Yüksek Eşleşme',
    result_safe: 'Güvenli',
    result_flagged_title: 'Dikkat Edilmesi Gerekenler',
    result_low_risk: 'Düşük Risk',
    result_flagged_fragrance_desc: 'Parfüm içerir. Hassas cildiniz için potansiyel tahriş riski taşıyabilir, ancak formülasyon oranı düşüktür.',
    result_usage_guide: 'Kullanım Rehberi',
    result_usage_morning: 'Sabah Rutini',
    result_usage_morning_desc: 'Temizleyiciden sonra uygulayın. Ardından mutlaka güneş kremi kullanın.',

    // Quiz
    quiz_back: 'GERİ',
    quiz_opt_tight_dry: 'Gergin ve Kuru',
    quiz_opt_tzone: 'Sadece T-bölgesi Yağlı',
    quiz_opt_oily: 'Tamamen Yağlı',
    quiz_opt_sensitive: 'Hassas ve Kızarık',
    quiz_save_btn: 'Cevabı Kaydet & Devam Et',
  },
  en: {
    // Navigation & Bottom Tab
    nav_dashboard: 'Dashboard',
    nav_scan: 'Scan',
    nav_routine: 'Routine',
    nav_profile: 'Profile',

    // Home
    home_status: 'STATUS',
    home_balanced: 'Balanced',
    home_skin_type: 'Combination',
    home_barrier_label: 'Barrier:',
    home_barrier_ideal: 'Ideal',
    home_environment: 'ENVIRONMENT',
    home_high: 'High',
    home_uv_val: 'UV 6.4',
    home_uv_sub: 'SPF 50 recommended',
    home_daily_analysis_title: 'Daily Skin Analysis',
    home_daily_analysis_desc: 'Discover what your skin needs today with AI scan.',
    home_scan_btn: 'Scan & Analyze',
    home_morning_routine: 'Morning Routine',
    home_see_all: 'See All',
    home_step1_tag: 'STEP 1',
    home_step1_name: 'Gentle Cleanser',
    home_step2_tag: 'STEP 2',
    home_step2_name: 'Hyaluronic Acid Serum',
    home_step3_tag: 'STEP 3',
    home_step3_name: 'SPF 50+ Sunscreen',
    home_tip_title: 'Tip',
    home_tip_desc: 'Niacinamide helps reduce pore appearance. Add it to your morning routine to balance sebum production in the T-zone.',

    // Routine
    routine_title: 'My Routine',
    routine_morning: 'Morning',
    routine_evening: 'Evening',
    routine_conflict_title: 'Caution',
    routine_conflict_desc: 'Retinol and Vitamin C together can cause irritation. Consider separating them into morning and evening routines.',
    routine_cat_cleanser: 'CLEANSER',
    routine_cat_toner: 'TONER',
    routine_cat_serum: 'SERUM',
    routine_cat_moisturizer: 'MOISTURIZER',
    routine_match_suffix: 'Match',
    routine_conflict_tag: 'Conflict',

    // Profile
    profile_greeting: 'Hello, Elif.',
    profile_desc_start: 'Your skin profile indicates a ',
    profile_desc_highlight: 'Karma & Dehydrated',
    profile_desc_end: ' state. We recommend focusing on barrier repair and hydration.',
    profile_btn_retake: 'Retake Quiz',
    profile_btn_face_scan: 'New Face Analysis',
    profile_barrier_health: 'BARRIER HEALTH',
    profile_ingredient_heading: 'Ingredient Profile',
    profile_love_title: 'Love',
    profile_love_desc: 'Ingredients your skin responds best to for hydration and barrier repair.',
    profile_avoid_title: 'Avoid',
    profile_avoid_desc: 'Ingredients known to trigger dehydration or irritation in your skin profile.',
    profile_pill_ceramides: 'Ceramides',
    profile_pill_niacinamide: 'Niacinamide',
    profile_pill_hyaluronic: 'Hyaluronic Acid',
    profile_pill_alcohol: 'Alcohol Denat',
    profile_pill_fragrance: 'Fragrance',
    profile_pill_essential_oils: 'Essential Oils',

    // Product Result
    result_suitable: 'Suitable',
    result_add_morning: 'Add to Morning Routine',
    result_add_favorites: 'Add to Favorites',
    result_key_ingredients: 'Key Ingredients',
    result_high_match: 'High Match',
    result_safe: 'Safe',
    result_flagged_title: 'Things to Watch Out For',
    result_low_risk: 'Low Risk',
    result_flagged_fragrance_desc: 'Contains fragrance. May carry slight irritation risk for sensitive skin, but formulation ratio is low.',
    result_usage_guide: 'Usage Guide',
    result_usage_morning: 'Morning Routine',
    result_usage_morning_desc: 'Apply after cleansing. Always follow with sunscreen.',

    // Quiz
    quiz_back: 'BACK',
    quiz_opt_tight_dry: 'Tight and Dry',
    quiz_opt_tzone: 'Only T-zone Oily',
    quiz_opt_oily: 'Completely Oily',
    quiz_opt_sensitive: 'Sensitive and Red',
    quiz_save_btn: 'Save & Continue',
  },
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'tr',
  toggleLanguage: () => {},
  setLanguage: () => {},
  t: (key: string) => key,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('tr');

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'tr' ? 'en' : 'tr'));
  };

  const t = (key: string): string => {
    return translations[language]?.[key] || translations.tr[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
