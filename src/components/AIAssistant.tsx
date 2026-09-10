import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  Mic,
  MicOff,
  RotateCcw,
  User,
  ArrowRight,
  Info,
  Volume2,
  VolumeX,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { ChatMessage } from '../types';

interface AIAssistantProps {
  onNavigateToTab?: (tab: string) => void;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-init-1',
    role: 'assistant',
    text: `Hello! I am your **CareMesh AI Logistics Assistant**.\n\nAsk me any question in simple English about medicine stocks, clinics running out of medicine, or how we move extra boxes between clinics to prevent waste. You can type or click the **microphone button** to speak your question!`,
    timestamp: 'Just now',
  },
];

const SUGGESTED_QUERIES = [
  'Which clinics are running out of Paracetamol?',
  'Why is CareMesh moving medicine from PHC-03 to PHC-07?',
  'What happens if a medicine delivery is delayed by 5 days?',
  'How do we stop medicines from expiring unused?',
  'Are health centres ready for a sudden fever surge?',
];

// Helper to clean Markdown syntax before Text-to-Speech
function stripMarkdown(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/•\s*/g, '')
    .replace(/#{1,6}\s*/g, '')
    .replace(/`{1,3}(.*?)`{1,3}/g, '$1')
    .trim();
}

// Client-side simple fallback generator
function generateSimpleAnswer(query: string): string {
  const q = query.toLowerCase();

  if (q.includes('paracetamol') || q.includes('shortage') || q.includes('run out')) {
    return `Here is what is happening with medicine supplies in plain English:

• **Clinic in need**: **PHC-07 in Maduranthakam** has only about **4 days of Paracetamol** left (216 tablets remaining, and patients need around 46 tablets every day).
• **Where we get help**: Nearby **PHC-03 in Uthiramerur** has surplus stock.
• **The Action**: We are moving **600 tablets** by road (just 1.5 hours away).
• **What this means**: Patients will get their fever medicines without interruption, and no clinic runs empty.`;
  }

  if (q.includes('phc-03') || q.includes('phc-07') || q.includes('transfer') || q.includes('why')) {
    return `Why we are moving medicine between PHC-03 and PHC-07:

• **PHC-07 needs medicine**: They are almost out of Paracetamol due to high patient demand.
• **PHC-03 has extra medicine**: They have surplus boxes that might expire in a month if unused.
• **Close distance**: The clinics are only 38 km apart (about 1.5 hours drive).
• **Double benefit**: Moving 600 tablets stops the shortage at PHC-07 and prevents medicine from being wasted at PHC-03.`;
  }

  if (q.includes('delay') || q.includes('supplier') || q.includes('s-04')) {
    return `What happens if a supplier delivery is delayed:

• **Automatic Backup**: Even if Supplier S-04 is delayed by 5 days, patients won't suffer.
• **Borrowing from Neighbors**: CareMesh finds nearby health centres with extra boxes and sets up quick road transfers.
• **Outcome**: Doctors have the medicines they need while the regular supplier order catches up.`;
  }

  if (q.includes('expir') || q.includes('waste') || q.includes('wastage')) {
    return `How CareMesh stops medicine waste:

• **The Problem**: Some rural clinics receive more boxes than their patients consume, leading to medicine expiring on shelves.
• **The Solution**: CareMesh tracks batch expiry dates. When a clinic has boxes expiring in under 45 days, we transfer them to busier hospitals where they are used immediately.
• **Result**: Over ₹2.4 Lakhs worth of essential medicine was saved from disposal this month alone.`;
  }

  if (q.includes('fever') || q.includes('dengue') || q.includes('surge') || q.includes('outbreak')) {
    return `Emergency surge readiness:

• **Surge Detection**: During fever or dengue season, medicine usage can jump by 40% in a few days.
• **Pre-emptive Supply**: CareMesh instantly routes IV fluids and fever tablets from low-demand zones into outbreak clusters.
• **Safety**: All monitored health centres maintain emergency buffer stock so no patient is turned away.`;
  }

  return `Here is a quick overview of your medicine supply network:

• **Network Status**: 20 clinics and hospitals are monitored across Tamil Nadu, with an 87% overall health score.
• **Active Relief**: 4 clinics are running low on fever and IV medicines, and automated local transfers are moving stock to replenish them.
• **Core Goal**: Ensuring every patient gets their medicine on time while preventing unused medicines from expiring.`;
}

export const AIAssistant: React.FC<AIAssistantProps> = () => {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [speechTranscript, setSpeechTranscript] = useState<string>('');
  const [micNotice, setMicNotice] = useState<string | null>(null);
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);
  const [autoVoiceReply, setAutoVoiceReply] = useState<boolean>(true);

  const chatBottomRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading, speechTranscript]);

  // Clean up speech synthesis and recognition on unmount
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore
        }
      }
    };
  }, []);

  // Text-to-Speech function to speak answer aloud
  const speakText = (msgId: string, text: string) => {
    if (!('speechSynthesis' in window)) {
      setMicNotice('Voice readout not supported in this browser.');
      setTimeout(() => setMicNotice(null), 3000);
      return;
    }

    if (speakingMsgId === msgId) {
      window.speechSynthesis.cancel();
      setSpeakingMsgId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const cleanText = stripMarkdown(text);
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'en-US';
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onstart = () => {
      setSpeakingMsgId(msgId);
    };

    utterance.onend = () => {
      setSpeakingMsgId(null);
    };

    utterance.onerror = () => {
      setSpeakingMsgId(null);
    };

    window.speechSynthesis.speak(utterance);
  };

  const handleSend = async (queryText?: string, wasSpoken: boolean = false) => {
    const textToSend = (queryText || inputValue).trim();
    if (!textToSend || isLoading) return;

    // Stop active recording if ongoing
    if (isRecording && recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
      setIsRecording(false);
      setSpeechTranscript('');
    }

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setInputValue('');
    setSpeechTranscript('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          conversationHistory: newHistory.slice(-6).map((m) => ({
            role: m.role,
            text: m.text,
          })),
        }),
      });

      let replyText = '';
      if (response.ok) {
        const data = await response.json();
        replyText = data.reply;
      }

      if (!replyText) {
        replyText = generateSimpleAnswer(textToSend);
      }

      const assistantMsgId = `assistant-${Date.now()}`;
      const assistantMessage: ChatMessage = {
        id: assistantMsgId,
        role: 'assistant',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // If user queried via voice or auto-voice is active, speak the answer aloud
      if (wasSpoken || autoVoiceReply) {
        setTimeout(() => {
          speakText(assistantMsgId, replyText);
        }, 200);
      }
    } catch {
      const fallbackReply = generateSimpleAnswer(textToSend);
      const assistantMsgId = `assistant-${Date.now()}`;
      const fallbackMessage: ChatMessage = {
        id: assistantMsgId,
        role: 'assistant',
        text: fallbackReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMessage]);

      if (wasSpoken || autoVoiceReply) {
        setTimeout(() => {
          speakText(assistantMsgId, fallbackReply);
        }, 200);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleMic = async () => {
    // If currently recording, stop it and submit transcript if present
    if (isRecording) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore
        }
      }
      setIsRecording(false);
      if (speechTranscript.trim()) {
        handleSend(speechTranscript.trim(), true);
      }
      setSpeechTranscript('');
      setMicNotice(null);
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setMicNotice(
        'Speech recognition is not supported in this browser. You can click any suggested question to ask.'
      );
      setTimeout(() => setMicNotice(null), 5000);
      return;
    }

    try {
      // Request mic permission if mediaDevices is available
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
          await navigator.mediaDevices.getUserMedia({ audio: true });
        } catch (permErr) {
          console.warn('Microphone permission check:', permErr);
        }
      }

      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;
      recognitionRef.current = recognition;

      recognition.onstart = () => {
        setIsRecording(true);
        setSpeechTranscript('');
        setMicNotice('Listening... Speak your question now.');
      };

      recognition.onresult = (event: any) => {
        let interim = '';
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const piece = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += piece;
          } else {
            interim += piece;
          }
        }
        const currentText = finalTranscript || interim;
        setSpeechTranscript(currentText);
        setInputValue(currentText);

        if (finalTranscript) {
          setIsRecording(false);
          setMicNotice(null);
          handleSend(finalTranscript, true);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsRecording(false);
        if (event.error === 'not-allowed') {
          setMicNotice('Microphone access was blocked. Please allow microphone permission.');
        } else if (event.error === 'no-speech') {
          setMicNotice('No speech detected. Please click the mic and speak clearly.');
        } else {
          setMicNotice('Voice capture paused. You can also type or use sample questions.');
        }
        setTimeout(() => setMicNotice(null), 4000);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognition.start();
    } catch (err: any) {
      console.warn('Error starting speech recognition:', err);
      setIsRecording(false);
      setMicNotice('Could not start microphone. You can click any suggested question below.');
      setTimeout(() => setMicNotice(null), 4000);
    }
  };

  return (
    <div className="space-y-4 pb-12 max-w-4xl mx-auto" id="ai-assistant-view">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-3 gap-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-sm shrink-0">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              CareMesh AI Logistics Assistant
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-teal-600" />
                Voice Active
              </span>
            </h1>
            <p className="text-xs text-slate-500">
              Clear, simple answers to medicine inventory, stockout risks, and redistribution.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Toggle Auto Voice Readout */}
          <button
            type="button"
            onClick={() => setAutoVoiceReply(!autoVoiceReply)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
              autoVoiceReply
                ? 'bg-teal-50 border-teal-300 text-teal-800'
                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
            title="When enabled, the assistant speaks its answer aloud"
          >
            {autoVoiceReply ? (
              <Volume2 className="w-3.5 h-3.5 text-teal-600" />
            ) : (
              <VolumeX className="w-3.5 h-3.5 text-slate-400" />
            )}
            <span>Voice Speech: {autoVoiceReply ? 'On' : 'Off'}</span>
          </button>

          {/* Reset Chat */}
          <button
            onClick={() => {
              if ('speechSynthesis' in window) window.speechSynthesis.cancel();
              setSpeakingMsgId(null);
              setMessages(INITIAL_MESSAGES);
            }}
            className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 px-2 py-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer border border-slate-200"
            title="Reset conversation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Clear Chat</span>
          </button>
        </div>
      </div>

      {/* Suggested Queries Chips */}
      <div className="space-y-1.5">
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
          Suggested Questions (Click to Ask):
        </span>
        <div className="flex flex-wrap gap-2">
          {SUGGESTED_QUERIES.map((sq, i) => (
            <button
              key={i}
              onClick={() => handleSend(sq)}
              className="text-xs px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:border-teal-500 hover:text-teal-800 hover:bg-teal-50/50 transition-all text-left shadow-2xs flex items-center gap-1.5 cursor-pointer"
            >
              <span>{sq}</span>
              <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-teal-600 shrink-0" />
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 md:p-6 min-h-[420px] max-h-[580px] overflow-y-auto space-y-4">
        {messages.map((m) => {
          const isAssistant = m.role === 'assistant';
          const isSpeakingThis = speakingMsgId === m.id;

          return (
            <div
              key={m.id}
              className={`flex gap-3 ${isAssistant ? 'justify-start' : 'justify-end'}`}
            >
              {isAssistant && (
                <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                  isAssistant
                    ? 'bg-slate-50 border border-slate-200 text-slate-800 shadow-2xs'
                    : 'bg-teal-600 text-white rounded-tr-none shadow-2xs'
                }`}
              >
                <div className="whitespace-pre-wrap font-normal">{m.text}</div>

                <div
                  className={`flex items-center justify-between mt-2.5 pt-2 border-t text-[10px] ${
                    isAssistant
                      ? 'border-slate-200/80 text-slate-400'
                      : 'border-teal-500/50 text-teal-100'
                  }`}
                >
                  <span className="font-mono">{m.timestamp}</span>

                  {/* Read Aloud Button for Assistant Messages */}
                  {isAssistant && (
                    <button
                      type="button"
                      onClick={() => speakText(m.id, m.text)}
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded font-medium transition-colors cursor-pointer ${
                        isSpeakingThis
                          ? 'bg-teal-600 text-white animate-pulse'
                          : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
                      }`}
                      title={isSpeakingThis ? 'Stop speaking' : 'Listen to answer'}
                    >
                      {isSpeakingThis ? (
                        <>
                          <VolumeX className="w-3 h-3" />
                          <span>Stop</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-3 h-3 text-teal-600" />
                          <span>Listen</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>

              {!isAssistant && (
                <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {/* Loading Spinner */}
        {isLoading && (
          <div className="flex gap-3 items-center text-slate-500 text-xs">
            <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 animate-spin" />
            </div>
            <div className="bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-2xl flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-teal-500 animate-bounce" />
              <span className="h-1.5 w-1.5 rounded-full bg-teal-500 animate-bounce [animation-delay:0.2s]" />
              <span className="h-1.5 w-1.5 rounded-full bg-teal-500 animate-bounce [animation-delay:0.4s]" />
              <span className="text-slate-600 text-xs font-medium">CareMesh finding simple answer...</span>
            </div>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* Active Voice Recording Live Bar */}
      {isRecording && (
        <div className="p-3.5 rounded-xl bg-rose-50 border-2 border-rose-400 text-rose-900 shadow-sm flex items-center justify-between animate-in fade-in duration-200">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-full bg-rose-500 text-white flex items-center justify-center animate-pulse shrink-0">
              <Mic className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold flex items-center gap-2">
                <span>Listening in English...</span>
                <span className="inline-block w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              </div>
              <p className="text-[11px] text-rose-700 truncate mt-0.5">
                {speechTranscript ? `"${speechTranscript}"` : 'Speak your question clearly into your microphone...'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => {
                if (speechTranscript.trim()) {
                  handleSend(speechTranscript.trim(), true);
                } else {
                  handleToggleMic();
                }
              }}
              className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
            >
              {speechTranscript.trim() ? 'Send Question' : 'Stop'}
            </button>
          </div>
        </div>
      )}

      {/* Mic Status Banner / Notices */}
      {micNotice && !isRecording && (
        <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2">
          <Info className="w-4 h-4 text-amber-600 shrink-0" />
          <span>{micNotice}</span>
        </div>
      )}

      {/* Chat Input Bar with Activated Voice Button */}
      <div className="bg-white rounded-xl border border-slate-200 p-2 shadow-xs flex items-center gap-2">
        {/* Voice Button */}
        <button
          id="btn-voice-input"
          type="button"
          onClick={handleToggleMic}
          className={`p-2.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
            isRecording
              ? 'bg-rose-600 text-white animate-pulse shadow-xs ring-2 ring-rose-300'
              : 'bg-teal-50 text-teal-700 hover:bg-teal-100 border border-teal-200'
          }`}
          title={isRecording ? 'Click to stop listening' : 'Click to speak your question'}
          aria-label="Voice input button"
        >
          {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          <span className="text-xs font-bold hidden sm:inline">
            {isRecording ? 'Listening...' : 'Voice'}
          </span>
        </button>

        {/* Text Input */}
        <input
          id="chat-input-field"
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSend();
          }}
          placeholder="Ask a question in simple words (e.g. Which clinics need Paracetamol?)..."
          className="flex-1 text-xs sm:text-sm bg-transparent border-none text-slate-800 placeholder-slate-400 focus:outline-none px-2"
        />

        {/* Send Button */}
        <button
          id="btn-send-message"
          type="button"
          onClick={() => handleSend()}
          disabled={!inputValue.trim() || isLoading}
          className="p-2.5 rounded-lg bg-teal-600 hover:bg-teal-700 disabled:opacity-40 text-white transition-colors cursor-pointer flex items-center justify-center shrink-0"
          aria-label="Send message"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
