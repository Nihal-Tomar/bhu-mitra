'use client';

import React, { useState, useEffect, useRef, useTransition } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { sendAiQuery, fetchAiBriefing, getAiReportCsvUrl } from '../../lib/ai-client';
import { AiMessageRenderer } from './AiMessageRenderer';
import type {
  AiMessage,
  AiContext,
  SupportedLanguage,
  AiConversationContext,
} from '@bhumitra/types';

type UserMode = 'OFFICER' | 'CITIZEN';

type VoiceState =
  | 'IDLE'
  | 'LISTENING'
  | 'PROCESSING'
  | 'SPEAKING';

const OFFICER_GREETING_EN: AiMessage = {
  id: 'msg-welcome-officer-en',
  role: 'assistant',
  content:
    'Welcome to Bhu-Mitra AI Command Center. I am the national land acquisition decision-support system for the Department of Land Resources (DoLR), Ministry of Rural Development, Government of India. How can I assist your infrastructure monitoring and statutory workflows today?',
  structuredResponse: {
    title: 'Bhu-Mitra Officer Command Center',
    summary:
      'Welcome to Bhu-Mitra AI Command Center. I am the national land acquisition decision-support system for the Department of Land Resources (DoLR), Ministry of Rural Development, Government of India. How can I assist your infrastructure monitoring and statutory workflows today?',
    language: 'en',
    detectedIntent: 'WELCOME',
    actions: [
      { label: "Today's Priorities", actionType: 'NAVIGATE', payload: { action: 'briefing' } },
      { label: 'Railway Projects', actionType: 'NAVIGATE', payload: { sector: 'Rail' } },
      { label: 'Delayed Corridors', actionType: 'NAVIGATE', payload: { action: 'delayed' } },
      { label: 'Open National GIS', actionType: 'NAVIGATE', payload: { url: '/gis' } },
    ],
    sources: ['Department of Land Resources (DoLR), Ministry of Rural Development'],
  },
  timestamp: new Date().toISOString(),
};

const OFFICER_GREETING_HI: AiMessage = {
  id: 'msg-welcome-officer-hi',
  role: 'assistant',
  content:
    'नमस्ते अधिकारी महोदय। भू-मित्र एआई कमांड केंद्र में आपका स्वागत है। मैं भूमि संसाधन विभाग (DoLR), भारत सरकार का राष्ट्रीय भूमि अधिग्रहण एवं निर्णय समर्थन सहायक हूँ। आज मैं आपकी परियोजना निगरानी और वैधानिक प्रक्रियाओं में क्या सहायता कर सकता हूँ?',
  structuredResponse: {
    title: 'भू-मित्र एआई कमांड केंद्र',
    summary:
      'नमस्ते अधिकारी महोदय। भू-मित्र एआई कमांड केंद्र में आपका स्वागत है। मैं भूमि संसाधन विभाग (DoLR), भारत सरकार का राष्ट्रीय भूमि अधिग्रहण एवं निर्णय समर्थन सहायक हूँ। आज मैं आपकी परियोजना निगरानी और वैधानिक प्रक्रियाओं में क्या सहायता कर सकता हूँ?',
    language: 'hi',
    detectedIntent: 'WELCOME',
    actions: [
      { label: 'आज की प्राथमिकताएं', actionType: 'NAVIGATE', payload: { action: 'briefing' } },
      { label: 'रेलवे परियोजनाएं', actionType: 'NAVIGATE', payload: { sector: 'Rail' } },
      { label: 'विलंबित परियोजनाएं', actionType: 'NAVIGATE', payload: { action: 'delayed' } },
      { label: 'राष्ट्रीय जीआईएस', actionType: 'NAVIGATE', payload: { url: '/gis' } },
    ],
    sources: ['भूमि संसाधन विभाग (DoLR), ग्रामीण विकास मंत्रालय, भारत सरकार'],
  },
  timestamp: new Date().toISOString(),
};

const CITIZEN_GREETING_EN: AiMessage = {
  id: 'msg-welcome-citizen-en',
  role: 'assistant',
  content:
    'Namaste! Welcome to the Bhu-Mitra Citizen Assistance Portal. You can check your land acquisition status, compensation calculations, objection hearings, or mandatory documents under the RFCTLARR Act 2013. You can speak or type in Hindi, English, or your preferred language.',
  structuredResponse: {
    title: 'Bhu-Mitra Citizen Assistance Portal',
    summary:
      'Namaste! Welcome to the Bhu-Mitra Citizen Assistance Portal. You can check your land acquisition status, compensation calculations, objection hearings, or mandatory documents under the RFCTLARR Act 2013. You can speak or type in Hindi, English, or your preferred language.',
    language: 'en',
    detectedIntent: 'CITIZEN_GREETING',
    actions: [
      { label: 'Track My Land (Survey #103/10)', actionType: 'OPEN_PARCEL', payload: { parcelId: '103-10' } },
      { label: 'Check Compensation', actionType: 'OPEN_COMPENSATION', payload: {} },
    ],
    sources: ['Bhu-Mitra Citizen Transparency & Land Access Portal'],
  },
  timestamp: new Date().toISOString(),
};

const CITIZEN_GREETING_HI: AiMessage = {
  id: 'msg-welcome-citizen-hi',
  role: 'assistant',
  content:
    'नमस्ते! भू-मित्र नागरिक सहायता केंद्र में आपका स्वागत है। आप अपनी जमीन के अधिग्रहण की स्थिति, मुआवजा गणना, आपत्ति सुनवाई, अथवा आवश्यक दस्तावेजों की जानकारी प्राप्त कर सकते हैं। आप हिंदी में बोलकर या लिखकर प्रश्न पूछ सकते हैं।',
  structuredResponse: {
    title: 'भू-मित्र नागरिक सहायता केंद्र',
    summary:
      'नमस्ते! भू-मित्र नागरिक सहायता केंद्र में आपका स्वागत है। आप अपनी जमीन के अधिग्रहण की स्थिति, मुआवजा गणना, आपत्ति सुनवाई, अथवा आवश्यक दस्तावेजों की जानकारी प्राप्त कर सकते हैं। आप हिंदी में बोलकर या लिखकर प्रश्न पूछ सकते हैं।',
    language: 'hi',
    detectedIntent: 'CITIZEN_GREETING',
    actions: [
      { label: 'मेरी जमीन की स्थिति (सर्वे #103/10)', actionType: 'OPEN_PARCEL', payload: { parcelId: '103-10' } },
      { label: 'मुआवजा स्थिति देखें', actionType: 'OPEN_COMPENSATION', payload: {} },
    ],
    sources: ['भू-मित्र नागरिक पारदर्शिता पोर्टल'],
  },
  timestamp: new Date().toISOString(),
};

const LANGUAGE_LABELS: Record<SupportedLanguage, string> = {
  en: 'English',
  hi: 'हिन्दी (Hindi)',
  hinglish: 'Hinglish (Hindi+English)',
  mr: 'मराठी (Marathi)',
  bn: 'বাংলা (Bengali)',
  ta: 'தமிழ் (Tamil)',
  te: 'తెలుగు (Telugu)',
  gu: 'ગુજરાતી (Gujarati)',
  kn: 'ಕನ್ನಡ (Kannada)',
  ml: 'മലയാളം (Malayalam)',
  pa: 'ਪੰਜਾਬੀ (Punjabi)',
};

export const BhuMitraAiAssistant: React.FC = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [userMode, setUserMode] = useState<UserMode>('OFFICER');
  const [selectedLang, setSelectedLang] = useState<SupportedLanguage>('hi');
  const [messages, setMessages] = useState<AiMessage[]>([OFFICER_GREETING_HI]);
  const [inputText, setInputText] = useState('');
  const [isPending, startTransition] = useTransition();
  const [detectedLangDisplay, setDetectedLangDisplay] = useState<string | null>('🌐 हिन्दी (Hindi)');
  const [conversationId, setConversationId] = useState<string>('session-' + Date.now());
  const [useCurrentContext, setUseCurrentContext] = useState(true);
  const [conversationContext, setConversationContext] = useState<AiConversationContext | undefined>(undefined);
  const [lastSpokenText, setLastSpokenText] = useState<string>('');
  const [voiceMuted, setVoiceMuted] = useState(false);

  // Voice Engine Configuration
  const VOICE_CONFIG = {
    silenceTimeout: 1300, // 1.3s pause threshold before auto-submitting
    minQueryLength: 2,
  };

  const [voiceState, setVoiceState] = useState<VoiceState>('IDLE');
  const recognitionRef = useRef<any>(null);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isSubmittingRef = useRef(false);
  const latestTranscriptRef = useRef('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isMinimized]);

  // Mode & Language change handler
  const handleModeChange = (mode: UserMode) => {
    setUserMode(mode);
    if (mode === 'CITIZEN') {
      setMessages([selectedLang === 'hi' ? CITIZEN_GREETING_HI : CITIZEN_GREETING_EN]);
    } else {
      setMessages([selectedLang === 'hi' ? OFFICER_GREETING_HI : OFFICER_GREETING_EN]);
    }
  };

  const handleLanguageChange = (lang: SupportedLanguage) => {
    setSelectedLang(lang);
    setDetectedLangDisplay(`🌐 ${LANGUAGE_LABELS[lang] || lang}`);
    if (messages.length <= 1) {
      if (userMode === 'CITIZEN') {
        setMessages([lang === 'hi' ? CITIZEN_GREETING_HI : CITIZEN_GREETING_EN]);
      } else {
        setMessages([lang === 'hi' ? OFFICER_GREETING_HI : OFFICER_GREETING_EN]);
      }
    }
  };

  // Global Keyboard Shortcut: Ctrl + Space or Cmd + K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey && e.code === 'Space') || (e.metaKey && e.key.toLowerCase() === 'k')) {
        e.preventDefault();
        setIsOpen((prev) => !prev);
        setIsMinimized(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Text Sanitization for Speech Synthesis
  const cleanTextForSpeech = (text: string): string => {
    if (!text) return '';
    return text
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/\[([^\]]+)\]/g, '')
      .replace(/https?:\/\/\S+/g, '')
      .replace(/[*#_`~>|]/g, '')
      .replace(/•\s*/g, '')
      .replace(/₹/g, 'Rupees ')
      .replace(/%/g, ' percent ')
      .replace(/\s+/g, ' ')
      .replace(/(\n|\r)+/g, '. ')
      .replace(/\.{2,}/g, '.')
      .trim();
  };

  // Trigger Automatic Submission on Silence Detection
  const triggerVoiceAutoSubmit = () => {
    if (isSubmittingRef.current) return;
    const query = latestTranscriptRef.current.trim();

    if (!query || query.length < VOICE_CONFIG.minQueryLength || /^(uh|um|hmm|ah)+$/i.test(query)) {
      return;
    }

    isSubmittingRef.current = true;
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }

    try {
      recognitionRef.current?.stop();
    } catch {}

    setVoiceState('PROCESSING');
    handleSend(query, 'voice');
  };

  // Initialize Speech Recognition (Web Speech API)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang =
          selectedLang === 'hi' || selectedLang === 'hinglish'
            ? 'hi-IN'
            : selectedLang === 'mr'
            ? 'mr-IN'
            : selectedLang === 'ta'
            ? 'ta-IN'
            : selectedLang === 'te'
            ? 'te-IN'
            : selectedLang === 'bn'
            ? 'bn-IN'
            : selectedLang === 'gu'
            ? 'gu-IN'
            : 'en-IN';

        recognition.onstart = () => {
          setVoiceState('LISTENING');
          isSubmittingRef.current = false;
        };

        recognition.onspeechstart = () => {
          if (silenceTimerRef.current) {
            clearTimeout(silenceTimerRef.current);
            silenceTimerRef.current = null;
          }
        };

        recognition.onresult = (event: any) => {
          let finalTranscript = '';
          let interimTranscript = '';

          for (let i = 0; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript;
            } else {
              interimTranscript += event.results[i][0].transcript;
            }
          }

          const combined = (finalTranscript + ' ' + interimTranscript).trim();
          if (combined) {
            setInputText(combined);
            latestTranscriptRef.current = combined;
          }

          if (silenceTimerRef.current) {
            clearTimeout(silenceTimerRef.current);
            silenceTimerRef.current = null;
          }

          if (combined.length >= VOICE_CONFIG.minQueryLength && !isSubmittingRef.current) {
            silenceTimerRef.current = setTimeout(() => {
              triggerVoiceAutoSubmit();
            }, VOICE_CONFIG.silenceTimeout);
          }
        };

        recognition.onspeechend = () => {
          if (
            latestTranscriptRef.current.trim().length >= VOICE_CONFIG.minQueryLength &&
            !silenceTimerRef.current &&
            !isSubmittingRef.current
          ) {
            silenceTimerRef.current = setTimeout(() => {
              triggerVoiceAutoSubmit();
            }, VOICE_CONFIG.silenceTimeout);
          }
        };

        recognition.onerror = () => {
          if (silenceTimerRef.current) {
            clearTimeout(silenceTimerRef.current);
            silenceTimerRef.current = null;
          }
          isSubmittingRef.current = false;
          setVoiceState('IDLE');
        };

        recognition.onend = () => {
          if (silenceTimerRef.current) {
            clearTimeout(silenceTimerRef.current);
            silenceTimerRef.current = null;
          }
          if (voiceState === 'LISTENING' && !isSubmittingRef.current) {
            setVoiceState('IDLE');
          }
        };

        recognitionRef.current = recognition;
      }
    }
  }, [selectedLang]);

  // Derive Current Application Context
  const currentContext: AiContext = {
    currentPage: pathname || '/',
    currentModule: pathname?.split('/')[1] || 'overview',
    projectId: searchParams?.get('id') || (pathname?.includes('projects') ? 'DOLR-2026-0084' : undefined),
    parcelId: searchParams?.get('parcel') || (pathname?.includes('gis') ? '103-10' : undefined),
    language: selectedLang,
  };

  const contextLabel = currentContext.parcelId
    ? `Parcel #${currentContext.parcelId}`
    : currentContext.projectId
    ? `NH-48 Bharatmala (Gujarat)`
    : currentContext.currentModule === 'gis'
    ? `National Acquisition GIS`
    : currentContext.currentModule === 'risk'
    ? `SLA & Delay Diagnostics`
    : currentContext.currentModule === 'compensation'
    ? `Compensation DBT`
    : selectedLang === 'hi'
    ? 'राष्ट्रीय अवलोकन (National Overview)'
    : 'National Overview';

  // Toggle Voice Input / Interrupt Speech
  const toggleVoiceInput = () => {
    // If speaking, interrupt TTS immediately and start listening
    if (voiceState === 'SPEAKING') {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      latestTranscriptRef.current = '';
      setInputText('');
      isSubmittingRef.current = false;
      try {
        setVoiceState('LISTENING');
        recognitionRef.current?.start();
      } catch {
        setVoiceState('IDLE');
      }
      return;
    }

    // If currently listening, stop
    if (voiceState === 'LISTENING') {
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = null;
      }
      try {
        recognitionRef.current?.stop();
      } catch {}
      isSubmittingRef.current = false;
      setVoiceState('IDLE');
      return;
    }

    // Start listening
    if (typeof window !== 'undefined' && !('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Microphone access is unavailable in this browser. You can type your question directly.');
      return;
    }

    latestTranscriptRef.current = '';
    setInputText('');
    isSubmittingRef.current = false;
    try {
      setVoiceState('LISTENING');
      recognitionRef.current?.start();
    } catch {
      setVoiceState('IDLE');
    }
  };

  // Text-to-Speech Speak function (Language-Aware & Natural Context)
  const handleSpeak = (rawText: string, lang?: SupportedLanguage, _fromVoiceQuery: boolean = false) => {
    if (voiceMuted || typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (voiceState === 'SPEAKING' && !rawText) {
      window.speechSynthesis.cancel();
      setVoiceState('IDLE');
      return;
    }

    window.speechSynthesis.cancel();
    const cleanText = cleanTextForSpeech(rawText);
    if (!cleanText) {
      setVoiceState('IDLE');
      return;
    }

    setLastSpokenText(cleanText);
    const utterance = new SpeechSynthesisUtterance(cleanText);
    const targetLang = lang || selectedLang;
    utterance.lang =
      targetLang === 'hi' || targetLang === 'hinglish'
        ? 'hi-IN'
        : targetLang === 'mr'
        ? 'mr-IN'
        : targetLang === 'ta'
        ? 'ta-IN'
        : targetLang === 'te'
        ? 'te-IN'
        : targetLang === 'bn'
        ? 'bn-IN'
        : 'en-IN';

    // Match best available voice
    const voices = window.speechSynthesis.getVoices();
    const matchedVoice = voices.find((v) => v.lang.startsWith(utterance.lang.slice(0, 2)));
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    utterance.rate = 0.95;
    utterance.onstart = () => setVoiceState('SPEAKING');
    utterance.onend = () => setVoiceState('IDLE');
    utterance.onerror = () => setVoiceState('IDLE');

    window.speechSynthesis.speak(utterance);
  };

  // Replay Last Voice Output
  const handleReplaySpeak = () => {
    if (lastSpokenText) {
      handleSpeak(lastSpokenText, selectedLang, false);
    }
  };

  // Send message - Unified Data Pipeline for BOTH typed and voice
  const handleSend = (textToSend?: string, inputSource: 'text' | 'voice' = 'text') => {
    const query = (textToSend || inputText).trim();
    if (!query) return;

    isSubmittingRef.current = false;
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }

    try {
      recognitionRef.current?.stop();
    } catch {}

    const userMsg: AiMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    latestTranscriptRef.current = '';
    setVoiceState('PROCESSING');

    startTransition(async () => {
      try {
        const response = await sendAiQuery({
          message: query,
          context: useCurrentContext ? currentContext : {},
          conversationContext,
          conversationId,
          language: selectedLang,
          inputSource,
        });

        setMessages((prev) => [...prev, response]);

        if (response.structuredResponse?.conversationContext) {
          setConversationContext(response.structuredResponse.conversationContext);
        }

        if (response.structuredResponse?.language) {
          const lang = response.structuredResponse.language;
          const label = LANGUAGE_LABELS[lang] || lang;
          setDetectedLangDisplay(`🌐 ${label}`);
          if (lang !== selectedLang) {
            setSelectedLang(lang);
          }
        }

        // Automatic voice response if user spoke via microphone
        const shouldAutoSpeak =
          !voiceMuted && (inputSource === 'voice' || (userMode === 'CITIZEN' && response.structuredResponse?.speakResponse));

        if (shouldAutoSpeak) {
          const textToSpeak =
            response.structuredResponse?.spokenSummary ||
            response.structuredResponse?.summary ||
            response.content;

          if (textToSpeak) {
            handleSpeak(textToSpeak, response.structuredResponse?.language || selectedLang, true);
          } else {
            setVoiceState('IDLE');
          }
        } else {
          setVoiceState('IDLE');
        }
      } catch {
        setVoiceState('IDLE');
        setMessages((prev) => [
          ...prev,
          {
            id: `err-${Date.now()}`,
            role: 'assistant',
            content:
              selectedLang === 'hi'
                ? 'माफ़ कीजिए, अभी परियोजना डेटा प्राप्त नहीं हो पाया। कृपया कुछ क्षण बाद पुनः प्रयास करें।'
                : 'I am unable to retrieve project records at this moment. Operating data remains accessible on the primary dashboard.',
            timestamp: new Date().toISOString(),
          },
        ]);
      }
    });
  };

  // Quick prompt handler
  const handleQuickPrompt = (prompt: string) => {
    setInputText(prompt);
    handleSend(prompt, 'text');
  };

  // Daily Briefing Handler
  const handleDailyBriefing = () => {
    setVoiceState('PROCESSING');
    startTransition(async () => {
      try {
        const briefingMsg = await fetchAiBriefing();
        setMessages((prev) => [...prev, briefingMsg]);
        setVoiceState('IDLE');
      } catch {
        handleQuickPrompt(selectedLang === 'hi' ? 'आज की एआई प्रशासनिक ब्रीफिंग' : "Today's Priorities and AI Briefing");
      }
    });
  };

  // Plain Language Explain Simply
  const handleExplainSimply = () => {
    handleQuickPrompt(
      selectedLang === 'hi'
        ? 'इसे एक आम नागरिक के लिए सरल भाषा में समझाएं'
        : 'Explain this in simple words for a citizen',
    );
  };

  // Document Upload Handler (Statutory Notice OCR / Extraction)
  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert('Document size exceeds 10MB limit.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const prompt =
        selectedLang === 'hi'
          ? `कृपया इस अपलोड किए गए दस्तावेज़ (${file.name}) का विश्लेषण करें: संबंधित धारा, सर्वे नंबर, समयसीमा निकालें और सरल शब्दों में समझाएं।`
          : `Please analyze this uploaded statutory notice (${file.name}): Extract legal Section, Survey numbers, deadlines, and explain simply.`;
      handleSend(prompt);
    };
    reader.readAsText(file.slice(0, 1000));
  };

  // Start new conversation
  const handleNewConversation = () => {
    setConversationId('session-' + Date.now());
    if (userMode === 'CITIZEN') {
      setMessages([selectedLang === 'hi' ? CITIZEN_GREETING_HI : CITIZEN_GREETING_EN]);
    } else {
      setMessages([selectedLang === 'hi' ? OFFICER_GREETING_HI : OFFICER_GREETING_EN]);
    }
    setDetectedLangDisplay(null);
    setConversationContext(undefined);
    setVoiceState('IDLE');
  };

  return (
    <>
      {/* ──────────────────────────────────────────────────────────────────────── */}
      {/* Floating Action Trigger Button (Bottom Right)                           */}
      {/* ──────────────────────────────────────────────────────────────────────── */}
      <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 select-none">
        <button
          type="button"
          onClick={() => {
            setIsOpen((prev) => !prev);
            setIsMinimized(false);
          }}
          className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-[#0C5A37] hover:bg-[#084228] text-white shadow-xl hover:shadow-2xl transition-all duration-200 active:scale-95 border-2 border-emerald-400/40"
          aria-label="Open Bhu-Mitra AI Command Center"
        >
          {/* Glowing Status Indicator */}
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-[#FF9933]" />
          </span>

          <span className="font-extrabold text-xs sm:text-sm tracking-wide">
            {isOpen && !isMinimized
              ? selectedLang === 'hi' ? 'कमांड सेंटर बंद करें' : 'Close Command Center'
              : userMode === 'CITIZEN'
              ? selectedLang === 'hi' ? 'भू-मित्र से पूछें' : 'Speak with Bhu-Mitra'
              : selectedLang === 'hi' ? 'भू-मित्र एआई' : 'Bhu-Mitra AI'}
          </span>

          <span className="hidden lg:inline text-[10px] font-mono bg-[#084228] px-2 py-0.5 rounded text-emerald-200 border border-emerald-600/40">
            Ctrl+Space
          </span>
        </button>
      </div>

      {/* ──────────────────────────────────────────────────────────────────────── */}
      {/* Interactive Bhu-Mitra AI Command Center Panel                           */}
      {/* ──────────────────────────────────────────────────────────────────────── */}
      {isOpen && (
        <div
          className={`fixed z-50 transition-all duration-200 flex flex-col bg-white overflow-hidden shadow-2xl border border-slate-300/90 ${
            isMinimized
              ? 'bottom-20 right-4 sm:right-6 w-[340px] h-[58px] rounded-2xl'
              : 'bottom-4 right-4 sm:bottom-6 sm:right-6 w-[calc(100vw-2rem)] sm:w-[540px] lg:w-[580px] h-[calc(100vh-2.5rem)] sm:h-[88vh] max-h-[92vh] rounded-[24px]'
          }`}
          role="dialog"
          aria-label="Bhu-Mitra AI Command Center"
        >
          {/* Header Bar */}
          <div className="bg-[#0B1F33] text-white p-3.5 sm:p-4 flex flex-col gap-2.5 border-b border-slate-800 shrink-0">
            
            {/* Top Row: Brand, Title, Status & Window Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-700 to-[#0C5A37] border border-emerald-400/40 flex items-center justify-center font-extrabold text-emerald-200 text-base shadow-inner">
                  ✦
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs sm:text-[14px] font-extrabold tracking-tight text-white">
                      Bhu-Mitra AI Command Center
                    </h3>
                    <span className="text-[9.5px] font-mono uppercase px-1.5 py-0.5 bg-emerald-950/80 text-emerald-300 border border-emerald-600/40 rounded font-bold">
                      SIH 2026
                    </span>
                  </div>
                  <div className="text-[10.5px] text-slate-300 flex items-center gap-2 mt-0.5">
                    <span className="flex items-center gap-1 font-semibold text-emerald-400">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      AI Online
                    </span>
                    <span className="text-slate-500">·</span>
                    <span className="text-slate-300 font-medium">
                      {selectedLang === 'hi' ? 'वाक् एवं बहुभाषी सक्षम' : 'Multilingual & Voice-Enabled'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons: Language, Minimize, Close */}
              <div className="flex items-center gap-1.5">
                <select
                  value={selectedLang}
                  onChange={(e) => handleLanguageChange(e.target.value as SupportedLanguage)}
                  className="bg-slate-800/90 border border-slate-700 text-slate-200 text-[11px] font-bold rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
                  aria-label="Select Assistant Language"
                >
                  <option value="hi">हिन्दी (Hindi)</option>
                  <option value="en">English</option>
                  <option value="mr">मराठी (Marathi)</option>
                  <option value="gu">ગુજરાતી (Gujarati)</option>
                  <option value="bn">বাংলা (Bengali)</option>
                  <option value="ta">தமிழ் (Tamil)</option>
                  <option value="te">తెలుగు (Telugu)</option>
                </select>

                <button
                  type="button"
                  onClick={() => setIsMinimized((prev) => !prev)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                  title={isMinimized ? 'Expand' : 'Minimize'}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 12H5" />
                  </svg>
                </button>

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                  title="Close Assistant"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Second Row (only when expanded): Officer vs Citizen Toggle & Voice Status */}
            {!isMinimized && (
              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[11px]">
                <div className="flex items-center bg-slate-900/90 rounded-xl p-0.5 border border-slate-700">
                  <button
                    type="button"
                    onClick={() => handleModeChange('OFFICER')}
                    className={`px-3 py-1 rounded-lg font-bold transition-all text-[11px] ${
                      userMode === 'OFFICER'
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    🏢 {selectedLang === 'hi' ? 'अधिकारी मोड' : 'Officer Mode'}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleModeChange('CITIZEN')}
                    className={`px-3 py-1 rounded-lg font-bold transition-all text-[11px] ${
                      userMode === 'CITIZEN'
                        ? 'bg-[#FF9933] text-slate-950 shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    👤 {selectedLang === 'hi' ? 'नागरिक मोड' : 'Citizen Mode'}
                  </button>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setVoiceMuted((prev) => !prev)}
                    className={`px-2 py-1 rounded-lg text-[10.5px] font-semibold border transition-all ${
                      voiceMuted
                        ? 'bg-red-950/60 border-red-800 text-red-300'
                        : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:text-white'
                    }`}
                    title={voiceMuted ? 'Voice is Muted' : 'Voice is Active'}
                  >
                    {voiceMuted ? '🔇 Voice Off' : '🔊 Voice On'}
                  </button>

                  <button
                    type="button"
                    onClick={handleNewConversation}
                    className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
                    title="New conversation"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Main Feed and Controls (Visible when not minimized) */}
          {!isMinimized && (
            <>
              {/* Active Context Banner */}
              <div className="bg-slate-100/95 border-b border-slate-200 px-4 py-2 flex items-center justify-between text-[11px] text-slate-600 shrink-0">
                {userMode === 'OFFICER' ? (
                  <>
                    <div className="flex items-center gap-1.5 truncate">
                      <span className="text-emerald-800 font-extrabold">
                        {selectedLang === 'hi' ? '📍 सक्रिय संदर्भ:' : '📍 Active Context:'}
                      </span>
                      <span className="font-semibold text-slate-800 truncate">
                        {conversationContext?.contextLabel || contextLabel}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={handleDailyBriefing}
                        className="text-[10.5px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 hover:bg-emerald-200 text-emerald-900 transition-colors border border-emerald-300"
                      >
                        ⚡ {selectedLang === 'hi' ? 'AI ब्रीफिंग' : 'AI Briefing'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setUseCurrentContext((prev) => !prev)}
                        className={`text-[10.5px] font-semibold px-2 py-0.5 rounded transition-colors ${
                          useCurrentContext ? 'bg-slate-200 text-slate-700' : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {useCurrentContext ? 'Synced' : 'Global'}
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-700">
                    <span className="text-emerald-800 font-bold">🔒 {selectedLang === 'hi' ? 'नागरिक सुरक्षा:' : 'Citizen Privacy:'}</span>
                    <span>{selectedLang === 'hi' ? 'प्रमाणीकृत सुरक्षित अभिलेख · RFCTLARR एक्ट 2013' : 'Authorized Access · RFCTLARR Act 2013 Protected'}</span>
                  </div>
                )}
              </div>

              {/* 4-State Voice Status Waveform Banner */}
              {voiceState !== 'IDLE' && (
                <div
                  className={`px-4 py-2.5 text-xs font-bold flex items-center justify-between transition-colors shadow-inner shrink-0 ${
                    voiceState === 'LISTENING'
                      ? 'bg-red-600 text-white animate-pulse'
                      : voiceState === 'PROCESSING'
                      ? 'bg-amber-600 text-white'
                      : 'bg-[#0C5A37] text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {/* Animated waveform bars */}
                    <div className="flex items-center gap-0.5 h-4">
                      <span className="w-1 bg-white rounded-full animate-bounce [animation-delay:-0.3s] h-3" />
                      <span className="w-1 bg-white rounded-full animate-bounce [animation-delay:-0.15s] h-4" />
                      <span className="w-1 bg-white rounded-full animate-bounce h-2" />
                      <span className="w-1 bg-white rounded-full animate-bounce [animation-delay:-0.25s] h-4" />
                    </div>
                    <span className="font-medium">
                      {voiceState === 'LISTENING' &&
                        (selectedLang === 'hi'
                          ? 'सुन रहा हूँ... अपनी भाषा में बोलें (रुकने पर स्वतः भेजा जाएगा)'
                          : 'Listening... Speak naturally (Auto-submits after pause)')}
                      {voiceState === 'PROCESSING' &&
                        (selectedLang === 'hi'
                          ? 'जानकारी खोज रहा हूँ...'
                          : 'Processing speech & searching live records...')}
                      {voiceState === 'SPEAKING' &&
                        (selectedLang === 'hi'
                          ? 'उत्तर दे रहा हूँ... (रोकने के लिए माइक दबाएं)'
                          : 'Speaking answer aloud (Click mic to interrupt)...')}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {voiceState === 'SPEAKING' && (
                      <button
                        type="button"
                        onClick={handleReplaySpeak}
                        className="text-[10.5px] bg-white/25 hover:bg-white/35 px-2 py-0.5 rounded text-white font-semibold"
                      >
                        {selectedLang === 'hi' ? 'पुनः सुनें' : 'Replay'}
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                          window.speechSynthesis.cancel();
                        }
                        try {
                          recognitionRef.current?.stop();
                        } catch {}
                        if (silenceTimerRef.current) {
                          clearTimeout(silenceTimerRef.current);
                          silenceTimerRef.current = null;
                        }
                        isSubmittingRef.current = false;
                        setVoiceState('IDLE');
                      }}
                      className="text-[10.5px] bg-black/40 hover:bg-black/60 px-2 py-0.5 rounded text-white font-semibold"
                    >
                      {selectedLang === 'hi' ? 'रोकें' : 'Stop'}
                    </button>
                  </div>
                </div>
              )}

              {/* Chat Messages Feed */}
              <div className="flex-1 overflow-y-auto p-4 bg-[#F8FAFC] space-y-2.5">
                {messages.map((msg) => (
                  <AiMessageRenderer
                    key={msg.id}
                    message={msg}
                    onSpeak={handleSpeak}
                    isSpeaking={voiceState === 'SPEAKING'}
                    onExplainSimply={handleExplainSimply}
                    onAskQuestion={(q) => {
                      setInputText(q);
                      handleSend(q);
                    }}
                    userLanguage={selectedLang}
                  />
                ))}

                {isPending && (
                  <div className="flex items-center gap-2.5 p-3.5 bg-white rounded-2xl border border-slate-200 max-w-[85%] text-xs text-slate-700 shadow-sm animate-pulse">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                    <span className="font-medium">
                      {selectedLang === 'hi'
                        ? 'परियोजना डेटा एवं भूमि रिकॉर्ड्स की जांच कर रहा हूँ...'
                        : 'Analyzing acquisition telemetry & RFCTLARR milestones...'}
                    </span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Suggested Quick Action Chips (Mode & Language Aware) */}
              <div className="p-2.5 bg-white border-t border-slate-200 flex items-center gap-1.5 overflow-x-auto text-[11px] whitespace-nowrap scrollbar-none shrink-0">
                <span className="text-[10px] uppercase font-bold text-slate-400 pl-1 shrink-0">
                  {selectedLang === 'hi' ? 'सुझाव:' : 'Quick:'}
                </span>

                {userMode === 'OFFICER' ? (
                  selectedLang === 'hi' ? (
                    <>
                      <button
                        type="button"
                        onClick={handleDailyBriefing}
                        className="px-3 py-1 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-bold transition-all border border-emerald-300 shadow-2xs"
                      >
                        ⚡ आज की AI ब्रीफिंग
                      </button>
                      <button
                        type="button"
                        onClick={() => handleQuickPrompt('मुझे रेलवे की परियोजनाएं हिंदी में बताओ')}
                        className="px-3 py-1 rounded-full bg-slate-100 hover:bg-emerald-50 text-slate-800 hover:text-emerald-900 font-medium transition-all border border-slate-200 shadow-2xs"
                      >
                        🚆 रेलवे परियोजनाएं
                      </button>
                      <button
                        type="button"
                        onClick={() => handleQuickPrompt('कौन सी परियोजनाएं देरी से चल रही हैं?')}
                        className="px-3 py-1 rounded-full bg-slate-100 hover:bg-emerald-50 text-slate-800 hover:text-emerald-900 font-medium transition-all border border-slate-200 shadow-2xs"
                      >
                        ⚠️ विलंबित परियोजनाएं
                      </button>
                      <button
                        type="button"
                        onClick={() => handleQuickPrompt('मुझे हाईवे की परियोजनाएं दिखाओ')}
                        className="px-3 py-1 rounded-full bg-slate-100 hover:bg-emerald-50 text-slate-800 hover:text-emerald-900 font-medium transition-all border border-slate-200 shadow-2xs"
                      >
                        🛣️ हाईवे परियोजनाएं
                      </button>
                      <button
                        type="button"
                        onClick={() => handleQuickPrompt('NH-48 भरतमाला क्यों लेट है?')}
                        className="px-3 py-1 rounded-full bg-slate-100 hover:bg-emerald-50 text-slate-800 hover:text-emerald-900 font-medium transition-all border border-slate-200 shadow-2xs"
                      >
                        NH-48 विलंब कारण
                      </button>
                      <button
                        type="button"
                        onClick={() => window.open(getAiReportCsvUrl(), '_blank')}
                        className="px-3 py-1 rounded-full bg-slate-100 hover:bg-emerald-50 text-slate-800 hover:text-emerald-900 font-medium transition-all border border-slate-200 shadow-2xs"
                      >
                        📊 एमआईएस रिपोर्ट (CSV)
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={handleDailyBriefing}
                        className="px-3 py-1 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-bold transition-all border border-emerald-300 shadow-2xs"
                      >
                        ⚡ Today&apos;s AI Briefing
                      </button>
                      <button
                        type="button"
                        onClick={() => handleQuickPrompt('Show current railway projects')}
                        className="px-3 py-1 rounded-full bg-slate-100 hover:bg-emerald-50 text-slate-800 hover:text-emerald-900 font-medium transition-all border border-slate-200 shadow-2xs"
                      >
                        🚆 Railway Projects
                      </button>
                      <button
                        type="button"
                        onClick={() => handleQuickPrompt('Which projects are delayed?')}
                        className="px-3 py-1 rounded-full bg-slate-100 hover:bg-emerald-50 text-slate-800 hover:text-emerald-900 font-medium transition-all border border-slate-200 shadow-2xs"
                      >
                        ⚠️ Delayed Corridors
                      </button>
                      <button
                        type="button"
                        onClick={() => handleQuickPrompt('Show highway projects')}
                        className="px-3 py-1 rounded-full bg-slate-100 hover:bg-emerald-50 text-slate-800 hover:text-emerald-900 font-medium transition-all border border-slate-200 shadow-2xs"
                      >
                        🛣️ Highway Projects
                      </button>
                      <button
                        type="button"
                        onClick={() => handleQuickPrompt('Why is NH-48 delayed?')}
                        className="px-3 py-1 rounded-full bg-slate-100 hover:bg-emerald-50 text-slate-800 hover:text-emerald-900 font-medium transition-all border border-slate-200 shadow-2xs"
                      >
                        Why is NH-48 delayed?
                      </button>
                      <button
                        type="button"
                        onClick={() => window.open(getAiReportCsvUrl(), '_blank')}
                        className="px-3 py-1 rounded-full bg-slate-100 hover:bg-emerald-50 text-slate-800 hover:text-emerald-900 font-medium transition-all border border-slate-200 shadow-2xs"
                      >
                        📊 Export MIS (CSV)
                      </button>
                    </>
                  )
                ) : (
                  selectedLang === 'hi' ? (
                    <>
                      <button
                        type="button"
                        onClick={() => handleQuickPrompt('सर्वे नंबर 103/10 की भूमि स्थिति क्या है?')}
                        className="px-3 py-1 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-950 font-bold transition-all border border-amber-300 shadow-2xs"
                      >
                        📍 जमीन स्थिति (सर्वे 103/10)
                      </button>
                      <button
                        type="button"
                        onClick={() => handleQuickPrompt('मुझे कितना मुआवजा मिलेगा?')}
                        className="px-3 py-1 rounded-full bg-slate-100 hover:bg-emerald-50 text-slate-800 hover:text-emerald-900 font-medium transition-all border border-slate-200 shadow-2xs"
                      >
                        💰 मुआवजा राशि
                      </button>
                      <button
                        type="button"
                        onClick={() => handleQuickPrompt('मुआवजा पाने हेतु कौन से दस्तावेज चाहिए?')}
                        className="px-3 py-1 rounded-full bg-slate-100 hover:bg-emerald-50 text-slate-800 hover:text-emerald-900 font-medium transition-all border border-slate-200 shadow-2xs"
                      >
                        📑 आवश्यक दस्तावेज
                      </button>
                      <button
                        type="button"
                        onClick={() => handleQuickPrompt('धारा 11 नोटिस के बाद क्या होता है?')}
                        className="px-3 py-1 rounded-full bg-slate-100 hover:bg-emerald-50 text-slate-800 hover:text-emerald-900 font-medium transition-all border border-slate-200 shadow-2xs"
                      >
                        ❓ धारा 11 के बाद क्या होगा?
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => handleQuickPrompt('What is the status of my land for survey 103/10?')}
                        className="px-3 py-1 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-950 font-bold transition-all border border-amber-300 shadow-2xs"
                      >
                        📍 Track My Land (103/10)
                      </button>
                      <button
                        type="button"
                        onClick={() => handleQuickPrompt('How much compensation will I receive?')}
                        className="px-3 py-1 rounded-full bg-slate-100 hover:bg-emerald-50 text-slate-800 hover:text-emerald-900 font-medium transition-all border border-slate-200 shadow-2xs"
                      >
                        💰 Compensation Amount
                      </button>
                      <button
                        type="button"
                        onClick={() => handleQuickPrompt('What documents are required for DBT compensation?')}
                        className="px-3 py-1 rounded-full bg-slate-100 hover:bg-emerald-50 text-slate-800 hover:text-emerald-900 font-medium transition-all border border-slate-200 shadow-2xs"
                      >
                        📑 Required Documents
                      </button>
                      <button
                        type="button"
                        onClick={() => handleQuickPrompt('What happens after Section 11 preliminary notice?')}
                        className="px-3 py-1 rounded-full bg-slate-100 hover:bg-emerald-50 text-slate-800 hover:text-emerald-900 font-medium transition-all border border-slate-200 shadow-2xs"
                      >
                        ❓ Next Steps After Sec 11
                      </button>
                    </>
                  )
                )}
              </div>

              {/* Input Area & Controls */}
              <div className="p-3.5 bg-white border-t border-slate-200 flex items-center gap-2.5 shrink-0">
                
                {/* Document / Gazette Upload Button */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleDocumentUpload}
                  accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2.5 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 transition-colors shrink-0"
                  title={selectedLang === 'hi' ? 'राजपत्र अधिसूचना / दस्तावेज़ अपलोड करें' : 'Upload Acquisition Notice / Document'}
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                </button>

                {/* Microphone Button (Voice-First Experience) */}
                <button
                  type="button"
                  onClick={toggleVoiceInput}
                  className={`p-3 rounded-xl transition-all relative shrink-0 active:scale-95 ${
                    voiceState === 'LISTENING'
                      ? 'bg-red-600 text-white ring-4 ring-red-300 shadow-lg scale-105 animate-pulse'
                      : 'bg-[#0C5A37] text-white hover:bg-[#084228] shadow-sm'
                  }`}
                  title={
                    voiceState === 'LISTENING'
                      ? selectedLang === 'hi' ? 'बोलना बंद करने के लिए क्लिक करें' : 'Click to stop listening'
                      : selectedLang === 'hi' ? 'अपनी भाषा में बोलकर प्रश्न पूछें' : 'Click to speak in your language'
                  }
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                </button>

                {/* Input Text Field */}
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder={
                    userMode === 'CITIZEN'
                      ? selectedLang === 'hi'
                        ? 'अपनी भाषा में पूछें (उदा: मेरी जमीन का मुआवजा कितना होगा?)...'
                        : 'Ask about your land or compensation (e.g. Survey 103/10)...'
                      : selectedLang === 'hi'
                      ? 'प्रश्न पूछें (उदा: रेलवे की नई परियोजनाएं कौन सी हैं?)...'
                      : 'Ask Bhu-Mitra AI (e.g. Show current railway projects)...'
                  }
                  className="flex-1 text-xs sm:text-[13px] p-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:border-[#0C5A37] focus:ring-1 focus:ring-[#0C5A37] text-slate-900 font-medium transition-all"
                />

                {/* Send Button */}
                <button
                  type="button"
                  disabled={!inputText.trim() || isPending}
                  onClick={() => handleSend()}
                  className="p-2.5 rounded-xl bg-[#0C5A37] hover:bg-[#084228] disabled:opacity-40 disabled:cursor-not-allowed text-white transition-all shadow-sm active:scale-95 shrink-0"
                  title="Send Message"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
            </>
          )}

        </div>
      )}
    </>
  );
};
