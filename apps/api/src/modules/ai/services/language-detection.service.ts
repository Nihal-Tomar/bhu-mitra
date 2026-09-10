import { Injectable } from '@nestjs/common';
import type { SupportedLanguage } from '@bhumitra/types';

export interface DetectionResult {
  language: SupportedLanguage;
  confidence: number;
  label: string;
  isMixed: boolean;
}

@Injectable()
export class LanguageDetectionService {
  /**
   * Detect language across 11 Indian languages + Hinglish
   */
  detectLanguage(text: string): DetectionResult {
    if (!text || !text.trim()) {
      return { language: 'en', confidence: 1.0, label: 'English', isMixed: false };
    }

    const trimmed = text.trim();

    // 1. Script-based Unicode detection
    // Devanagari: Hindi (hi) or Marathi (mr)
    if (/[\u0900-\u097F]/.test(trimmed)) {
      const marathiMarkers = /\b(आहे|झाले|कधी|नाही|काय|करावे|जमीन|मिळेल|शासनाने)\b/i;
      if (marathiMarkers.test(trimmed)) {
        return { language: 'mr', confidence: 0.95, label: 'मराठी (Marathi)', isMixed: false };
      }
      return { language: 'hi', confidence: 0.98, label: 'हिन्दी (Hindi)', isMixed: false };
    }

    // Bengali: Assamese / Bengali script
    if (/[\u0980-\u09FF]/.test(trimmed)) {
      return { language: 'bn', confidence: 0.95, label: 'বাংলা (Bengali)', isMixed: false };
    }

    // Tamil
    if (/[\u0B80-\u0BFF]/.test(trimmed)) {
      return { language: 'ta', confidence: 0.95, label: 'தமிழ் (Tamil)', isMixed: false };
    }

    // Telugu
    if (/[\u0C00-\u0C7F]/.test(trimmed)) {
      return { language: 'te', confidence: 0.95, label: 'తెలుగు (Telugu)', isMixed: false };
    }

    // Gujarati
    if (/[\u0A80-\u0AFF]/.test(trimmed)) {
      return { language: 'gu', confidence: 0.95, label: 'ગુજરાતી (Gujarati)', isMixed: false };
    }

    // Kannada
    if (/[\u0C80-\u0CFF]/.test(trimmed)) {
      return { language: 'kn', confidence: 0.95, label: 'ಕನ್ನಡ (Kannada)', isMixed: false };
    }

    // Malayalam
    if (/[\u0D00-\u0D7F]/.test(trimmed)) {
      return { language: 'ml', confidence: 0.95, label: 'മലയാളം (Malayalam)', isMixed: false };
    }

    // Punjabi (Gurmukhi)
    if (/[\u0A00-\u0A7F]/.test(trimmed)) {
      return { language: 'pa', confidence: 0.95, label: 'ਪੰਜਾਬੀ (Punjabi)', isMixed: false };
    }

    // Explicit user language requests
    const lower = trimmed.toLowerCase();
    if (lower.includes('hindi mein') || lower.includes('in hindi') || lower.includes('हिंदी में') || lower.includes('हिंदी')) {
      return { language: 'hi', confidence: 1.0, label: 'हिन्दी (Hindi)', isMixed: false };
    }

    // 2. Latin script phonetic / mixed analysis (Hinglish & Romanized Regional)
    const hinglishKeywords = [
      'mera', 'meri', 'mere', 'kisan', 'zamin', 'zameen', 'muavja', 'muawza',
      'kab', 'milega', 'kitna', 'kitne', 'kitni', 'kaise', 'kya', 'hoga', 'adhigrahan', 'batao',
      'patwari', 'tehsildar', 'collector', 'khasra', 'khata', 'khatedar',
      'dastavej', 'chahiye', 'rok', 'paisa', 'hearing', 'objection', 'survey',
      'mujhe', 'humko', 'bare', 'mein', 'dikhao', 'kaunse', 'kaun', 'chal', 'rahe',
      'raha', 'rahi', 'wala', 'wali', 'wale', 'iska', 'iski', 'iske', 'uski', 'uske',
      'sabse', 'zyada', 'deri', 'bhi', 'karo', 'hain', 'hai'
    ];

    const matchedHinglish = hinglishKeywords.filter((kw) => {
      const regex = new RegExp(`\\b${kw}\\b`, 'i');
      return regex.test(lower);
    });

    if (matchedHinglish.length >= 2 || (matchedHinglish.length === 1 && (lower.includes('hai') || lower.includes('hain') || lower.includes('mein') || lower.includes('batao') || lower.includes('dikhao')))) {
      return { language: 'hi', confidence: 0.95, label: 'Hinglish / हिन्दी', isMixed: true };
    }

    // Default to English
    return { language: 'en', confidence: 0.95, label: 'English', isMixed: false };
  }

  /**
   * Return human-friendly greeting based on detected language
   */
  getGreeting(lang: SupportedLanguage, isCitizen = false): string {
    switch (lang) {
      case 'hi':
        return isCitizen
          ? 'नमस्ते। भू-मित्र सहायक में आपका स्वागत है। आपकी भूमि या मुआवजे के संबंध में हम क्या सहायता कर सकते हैं?'
          : 'नमस्ते अधिकारी महोदय। राष्ट्रीय भूमि अधिग्रहण कमांड केंद्र में आपका स्वागत है।';
      case 'hinglish':
        return isCitizen
          ? 'Namaste! Bhu-Mitra assistant me aapka swagat hai. Aapki zameen ya muavje ke baare me aap kya janna chahte hain?'
          : 'Welcome Officer. Bhu-Mitra Command Assistant me aapka swagat hai. Aaj ke delayed projects ya priority actions check karein.';
      case 'mr':
        return isCitizen
          ? 'नमस्कार. भू-मित्र सहाय्यकामध्ये आपले स्वागत आहे. आपल्या जमिनीच्या किंवा भरपाईच्या संदर्भात आम्ही काय मदत करू शकतो?'
          : 'नमस्कार. राष्ट्रीय भूसंपादन नियंत्रण कक्षात आपले स्वागत आहे.';
      case 'gu':
        return isCitizen
          ? 'નમસ્તે. ભૂ-મિત્ર સહાયકમાં આપનું સ્વાગત છે. તમારી જમીન અથવા વળતર અંગે અમે શું મદદ કરી શકીએ?'
          : 'નમસ્તે. રાષ્ટ્રીય જમીન સંપાદન કમાન્ડ સેન્ટરમાં આપનું સ્વાગત છે.';
      case 'bn':
        return isCitizen
          ? 'নমস্কার। ভূ-মিত্র সহায়কে আপনাকে স্বাগতম। আপনার জমি বা ক্ষতিপূরণ সম্পর্কিত কী সাহায্য করতে পারি?'
          : 'নমস্কার। জাতীয় ভূমি অধিগ্রহণ কমান্ড সেন্টারে স্বাগতম।';
      case 'ta':
        return isCitizen
          ? 'வணக்கம். பூ-மித்ரா உதவியாளருக்கு வரவேற்கிறோம். உங்கள் நிலம் அல்லது இழப்பீடு பற்றி என்ன உதவி தேவை?'
          : 'வணக்கம். தேசிய நில கையகப்படுத்தல் கட்டளை மையத்திற்கு வரவேற்கிறோம்.';
      case 'te':
        return isCitizen
          ? 'నమస్కారం. భూ-మిత్ర సహాయకుడికి స్వాగతం. మీ భూమి లేదా పరిహారం గురించి ఏమి సహాయం కావాలి?'
          : 'నమస్కారం. జాతీయ భూ సేకరణ కమాండ్ సెంటర్‌కు స్వాగతం.';
      default:
        return isCitizen
          ? 'Welcome to Bhu-Mitra. How can we help you regarding your land acquisition status, compensation, or documents?'
          : 'Welcome to Bhu-Mitra Command Assistant. How can I assist your acquisition management workflow today?';
    }
  }
}
