import { SkinType, BarrierHealthStatus } from '../types';

export interface IQuizOptionItem {
  id: string;
  textTr: string;
  textEn: string;
  descTr?: string;
  descEn?: string;
  iconName: 'Droplet' | 'Sparkles' | 'Waves' | 'ShieldAlert' | 'Sun' | 'Flame' | 'CheckCircle2' | 'Target';
  weightEffect: {
    oiliness?: number;
    dryness?: number;
    sensitivity?: number;
  };
  concernValue?: string;
}

export interface IQuizQuestionItem {
  id: string;
  category: 'sebum' | 'barrier' | 'sensitivity' | 'concerns';
  titleTr: string;
  titleEn: string;
  subtitleTr: string;
  subtitleEn: string;
  options: IQuizOptionItem[];
}

export interface IAnswerSelection {
  questionId: string;
  selectedOptionId: string;
  selectedOptionText: string;
  weightEffect: {
    oiliness: number;
    dryness: number;
    sensitivity: number;
  };
  concernValue?: string;
}

export interface IComputedSkinProfileResult {
  skinType: SkinType;
  barrierHealth: BarrierHealthStatus;
  barrierScore: number; // 0 - 100
  barrierBadgeTr: string;
  barrierBadgeEn: string;
  primaryConcerns: string[];
  knownSensitivities: string[];
  loveIngredients: string[];
  avoidIngredients: string[];
}

/**
 * 4 Adımlı Klinik Dinamik Cilt Analiz Anketi Soruları
 * (Baumann Skin Type & Bare-Faced Test Referanslı)
 */
export const quizQuestions: IQuizQuestionItem[] = [
  {
    id: 'q1_cleansing_reaction',
    category: 'sebum',
    titleTr: 'Yüzünüzü yıkadıktan 30-45 dk sonra cildiniz nasıl hissediyor?',
    titleEn: 'How does your skin feel 30-45 mins after washing?',
    subtitleTr: 'Hiçbir nemlendirici veya serum sürmeden önceki hissi değerlendirin.',
    subtitleEn: 'Evaluate without applying any toner or moisturizer.',
    options: [
      {
        id: 'q1_dry',
        textTr: 'Gergin ve Kuru',
        textEn: 'Tight and Dry',
        descTr: 'Özellikle yanaklarda belirgin bir gerginlik, pullanma hissi var.',
        descEn: 'Marked tightness and dry feeling especially on cheeks.',
        iconName: 'Droplet',
        weightEffect: { dryness: 3, oiliness: 0, sensitivity: 1 },
      },
      {
        id: 'q1_combo',
        textTr: 'T-Bölgesi Parlak, Yanaklar Normal/Gergin',
        textEn: 'T-Zone Shiny, Cheeks Normal/Tight',
        descTr: 'Alın ve burun yağlanmaya başlarken yanaklar kuru veya dengeli.',
        descEn: 'Forehead and nose turn shiny while cheeks stay balanced or tight.',
        iconName: 'Sparkles',
        weightEffect: { oiliness: 2, dryness: 1, sensitivity: 0 },
      },
      {
        id: 'q1_oily',
        textTr: 'Her Yeri Yağlı ve Parlak',
        textEn: 'Oily and Shiny All Over',
        descTr: 'Kısa sürede tüm yüzde belirgin bir parlama ve yağ tabakası oluşuyor.',
        descEn: 'Noticeable shine and excess oil spread across the entire face.',
        iconName: 'Waves',
        weightEffect: { oiliness: 4, dryness: 0, sensitivity: 0 },
      },
      {
        id: 'q1_normal',
        textTr: 'Rahat, Dengeli ve Yumuşak',
        textEn: 'Comfortable, Balanced and Soft',
        descTr: 'Ne aşırı kuruluk ne de rahatsız edici bir yağlanma var.',
        descEn: 'Neither extreme dryness nor noticeable excess sebum.',
        iconName: 'CheckCircle2',
        weightEffect: { oiliness: 1, dryness: 1, sensitivity: 0 },
      },
    ],
  },
  {
    id: 'q2_pores_shine',
    category: 'sebum',
    titleTr: 'Gün içinde gözeneklerinizin görünümü ve parlama durumu nedir?',
    titleEn: 'How do your pores and midday shine look throughout the day?',
    subtitleTr: 'Sebum salgısı ve gözenek belirginliğini gözlemleyin.',
    subtitleEn: 'Observe pore visibility and midday oiliness.',
    options: [
      {
        id: 'q2_oily_pores',
        textTr: 'Geniş Gözenekler & Gün Ortasında Belirgin Parlama',
        textEn: 'Large Pores & Obvious Midday Shine',
        descTr: 'Gözenekler genel olarak geniştir ve matlaştırıcı pudra/kağıt ihtiyacı duyulur.',
        descEn: 'Pores are widely visible and blotting paper is often needed.',
        iconName: 'Waves',
        weightEffect: { oiliness: 3, dryness: 0, sensitivity: 0 },
      },
      {
        id: 'q2_combo_pores',
        textTr: 'Yalnızca T-Bölgesinde Belirgin Gözenekler',
        textEn: 'Visible Pores Mostly on T-Zone',
        descTr: 'Burun ve alın çevresinde gözenekler var, yanaklarda neredeyse belirsiz.',
        descEn: 'Pores noticeable around nose and forehead, smooth on cheeks.',
        iconName: 'Sparkles',
        weightEffect: { oiliness: 2, dryness: 1, sensitivity: 0 },
      },
      {
        id: 'q2_dry_tight',
        textTr: 'Mat, Sıkı Gözenekler & Nadiren Parlama',
        textEn: 'Matte, Tight Pores & Rare Shine',
        descTr: 'Gözenekler çok küçüktür, cilt neredeyse hiç sebum üretmez.',
        descEn: 'Very fine pores with little to no oil production throughout the day.',
        iconName: 'Droplet',
        weightEffect: { dryness: 2, oiliness: 0, sensitivity: 0 },
      },
      {
        id: 'q2_flaky_rough',
        textTr: 'Mat & Zaman Zaman Pul Pul Dökülmeye Meyilli',
        textEn: 'Matte & Occasionally Prone to Flaking',
        descTr: 'Pürüzlü yüzey dokusu ve nemsizlik çizgileri hissedilebilir.',
        descEn: 'Rough surface texture with occasional flakiness and dehydration lines.',
        iconName: 'ShieldAlert',
        weightEffect: { dryness: 4, oiliness: 0, sensitivity: 2 },
      },
    ],
  },
  {
    id: 'q3_reactivity_barrier',
    category: 'sensitivity',
    titleTr: 'Cildiniz güneşe, parfümlü ürünlere veya sıcak suya karşı nasıl tepki verir?',
    titleEn: 'How does your skin react to sun, fragrance, or hot water?',
    subtitleTr: 'Cilt bariyerinin direnç seviyesini belirlemek için en kritik adım.',
    subtitleEn: 'The most critical step to evaluate your skin barrier resilience.',
    options: [
      {
        id: 'q3_high_sensitivity',
        textTr: 'Hemen Kızarır, Yanar veya Kaşınır',
        textEn: 'Instantly Flushes, Stings, or Itches',
        descTr: 'Yeni ürünlerde sık sık yanma ve kızarıklık reaksiyonu gelişir.',
        descEn: 'Frequent burning or erythema when exposed to actives or fragrances.',
        iconName: 'Flame',
        weightEffect: { sensitivity: 4, dryness: 1, oiliness: 0 },
      },
      {
        id: 'q3_moderate_sensitivity',
        textTr: 'Nadiren ve Sadece Güçlü Aktiflerde Tepki Verir',
        textEn: 'Occasionally Reacts Only to Strong Actives',
        descTr: 'Retinol veya yüksek asitlerde hafif kızarma olabilir, genelde tolere eder.',
        descEn: 'Mild transient redness with strong acids or retinol, usually recovers.',
        iconName: 'Sun',
        weightEffect: { sensitivity: 2, dryness: 0, oiliness: 0 },
      },
      {
        id: 'q3_resilient',
        textTr: 'Hiçbir Sorun Olmaz, Oldukça Dirençli',
        textEn: 'No Issues at All, Very Resilient',
        descTr: 'Hemen hemen her kozmetik ürünü ve çevresel değişimi rahat tolere eder.',
        descEn: 'Tolerates nearly all skincare actives and environmental changes.',
        iconName: 'ShieldAlert',
        weightEffect: { sensitivity: 0, dryness: 0, oiliness: 0 },
      },
    ],
  },
  {
    id: 'q4_skin_concerns',
    category: 'concerns',
    titleTr: 'En çok iyileştirmek istediğiniz temel cilt endişeniz nedir?',
    titleEn: 'What is the primary skin concern you want to target?',
    subtitleTr: 'Rutininizde odaklanılacak kahraman aktif içerikleri belirler.',
    subtitleEn: 'Determines the hero ingredients to prioritize in your routine.',
    options: [
      {
        id: 'q4_acne',
        textTr: 'Akne, Sivilce & Tıkanmış Gözenekler',
        textEn: 'Acne, Blemishes & Clogged Pores',
        descTr: 'Siyah nokta, iltihaplı sivilceler ve sebum kontrolü.',
        descEn: 'Blackheads, active breakouts, and excess sebum regulation.',
        iconName: 'Target',
        weightEffect: { oiliness: 2, dryness: 0, sensitivity: 1 },
        concernValue: 'Acne',
      },
      {
        id: 'q4_pigmentation',
        textTr: 'Lekeler, Güneş İzleri & Ton Eşitsizliği',
        textEn: 'Dark Spots, Sun Marks & Uneven Tone',
        descTr: 'Post-akne izleri ve aydınlık bir cilt tonu hedefi.',
        descEn: 'Post-inflammatory hyperpigmentation and luminous even skin.',
        iconName: 'Sun',
        weightEffect: { oiliness: 0, dryness: 0, sensitivity: 0 },
        concernValue: 'Hyperpigmentation',
      },
      {
        id: 'q4_dehydration',
        textTr: 'Derin Nemsizlik, Donukluk & Gerginlik',
        textEn: 'Dehydration, Dullness & Tightness',
        descTr: 'Cildin su tutma kapasitesini artırma ve nem bariyerini güçlendirme.',
        descEn: 'Boosting water retention capacity and reinforcing the lipid barrier.',
        iconName: 'Droplet',
        weightEffect: { dryness: 3, oiliness: 0, sensitivity: 1 },
        concernValue: 'Dehydration',
      },
      {
        id: 'q4_anti_aging',
        textTr: 'İnce Çizgiler, Kırışıklık & Elastikiyet Kaybı',
        textEn: 'Fine Lines, Wrinkles & Loss of Elasticity',
        descTr: 'Kolajen üretimini destekleme ve pürüzsüzleştirme.',
        descEn: 'Stimulating collagen synthesis and plumping skin texture.',
        iconName: 'Sparkles',
        weightEffect: { dryness: 1, oiliness: 0, sensitivity: 0 },
        concernValue: 'Fine Lines',
      },
      {
        id: 'q4_large_pores',
        textTr: 'Geniş Gözenekler & Düzensiz Doku',
        textEn: 'Enlarged Pores & Uneven Texture',
        descTr: 'Gözenek çeperlerini sıkılaştırma ve pürüzsüz görünüm.',
        descEn: 'Tightening pore walls and refining skin texture.',
        iconName: 'Waves',
        weightEffect: { oiliness: 2, dryness: 0, sensitivity: 0 },
        concernValue: 'Large Pores',
      },
    ],
  },
];

/**
 * Puanlama ve Cilt Profili Hesaplama Motoru
 * (Baumann Matrisi ve Dermatolojik Bariyer Eşiği Algoritması)
 */
export function calculateSkinProfile(answers: IAnswerSelection[]): IComputedSkinProfileResult {
  let totalOiliness = 0;
  let totalDryness = 0;
  let totalSensitivity = 0;
  const concerns: string[] = [];

  answers.forEach((ans) => {
    if (ans.weightEffect) {
      totalOiliness += ans.weightEffect.oiliness || 0;
      totalDryness += ans.weightEffect.dryness || 0;
      totalSensitivity += ans.weightEffect.sensitivity || 0;
    }
    if (ans.concernValue && !concerns.includes(ans.concernValue)) {
      concerns.push(ans.concernValue);
    }
  });

  // 1. Cilt Tipi Belirleme (Sebum/Nem Dengesi)
  let skinType: SkinType = 'Normal';
  if (totalOiliness >= 5 && totalDryness <= 2) {
    skinType = 'Oily';
  } else if (totalDryness >= 5 && totalOiliness <= 2) {
    skinType = 'Dry';
  } else if (totalOiliness >= 3 && totalDryness >= 2) {
    skinType = 'Combination';
  } else if (totalSensitivity >= 5) {
    skinType = 'Sensitive';
  } else if (totalOiliness <= 3 && totalDryness <= 3) {
    skinType = 'Normal';
  } else {
    skinType = 'Combination';
  }

  // 2. Bariyer Sağlığı & Skoru (Stratum Corneum Direnci)
  let barrierHealth: BarrierHealthStatus = 'Healthy';
  let barrierScore = 85;
  let barrierBadgeTr = 'Güçlü & Dengeli Bariyer';
  let barrierBadgeEn = 'Strong & Resilient Barrier';

  if (totalSensitivity >= 4 || (totalDryness >= 6 && totalSensitivity >= 2)) {
    barrierHealth = 'Needs Repair';
    barrierScore = Math.max(35, 60 - totalSensitivity * 6);
    barrierBadgeTr = 'Acil Onarım Gerektiren Bariyer';
    barrierBadgeEn = 'Needs Immediate Repair';
  } else if (totalSensitivity >= 2 || totalDryness >= 4) {
    barrierHealth = 'Compromised';
    barrierScore = Math.max(55, 78 - totalSensitivity * 6);
    barrierBadgeTr = 'Dengelenme & Onarım Sürecinde';
    barrierBadgeEn = 'Compromised / In Recovery';
  } else {
    barrierHealth = 'Healthy';
    barrierScore = Math.min(95, 85 + (4 - totalSensitivity) * 2);
    barrierBadgeTr = 'İdeal & Korunaklı Bariyer';
    barrierBadgeEn = 'Ideal & Protected Barrier';
  }

  // 3. İçerik Eşleştirmesi (Love vs Avoid)
  const loveIngredients: string[] = ['Ceramides', 'Hyaluronic Acid'];
  const avoidIngredients: string[] = [];

  if (skinType === 'Oily' || concerns.includes('Acne') || concerns.includes('Large Pores')) {
    loveIngredients.push('Niacinamide', 'Salicylic Acid', 'Zinc PCA');
    avoidIngredients.push('Heavy Mineral Oils', 'Coconut Oil', 'Isopropyl Myristate');
  }

  if (skinType === 'Dry' || concerns.includes('Dehydration')) {
    loveIngredients.push('Squalane', 'Glycerin', 'Panthenol');
    avoidIngredients.push('Alcohol Denat', 'Sulfates');
  }

  if (barrierHealth !== 'Healthy' || totalSensitivity >= 2) {
    loveIngredients.push('Centella Asiatica', 'Madecassoside', 'Allantoin');
    if (!avoidIngredients.includes('Alcohol Denat')) avoidIngredients.push('Alcohol Denat');
    if (!avoidIngredients.includes('Synthetic Fragrance')) avoidIngredients.push('Synthetic Fragrance');
    if (!avoidIngredients.includes('Essential Oils')) avoidIngredients.push('Essential Oils');
  }

  if (concerns.includes('Hyperpigmentation')) {
    loveIngredients.push('Alpha Arbutin', 'Tranexamic Acid', 'Vitamin C');
  }

  if (concerns.includes('Fine Lines')) {
    loveIngredients.push('Peptides', 'Bakuchiol', 'Adenosine');
  }

  return {
    skinType,
    barrierHealth,
    barrierScore,
    barrierBadgeTr,
    barrierBadgeEn,
    primaryConcerns: concerns.length > 0 ? concerns : ['Dehydration'],
    knownSensitivities: avoidIngredients,
    loveIngredients: Array.from(new Set(loveIngredients)),
    avoidIngredients: Array.from(new Set(avoidIngredients)),
  };
}
