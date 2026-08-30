'use client';

import React, { useRef, useEffect } from 'react';
import { useResume } from '@/context/ResumeContext';
import { ChatMessageItem } from './ChatMessageItem';
import { ChatInputArea } from './ChatInputArea';
import { Sparkles, Wand2, ShieldCheck, Minimize2, Palette, PlusCircle, Briefcase } from 'lucide-react';

const FRIENDLY_QUICK_ACTIONS = [
  { label: 'Make my CV professional', prompt: 'Make my CV professional and enhance the summary with high-impact achievements.', icon: <Sparkles className="w-3.5 h-3.5 text-purple-600" /> },
  { label: 'Make it ATS friendly', prompt: 'Make my CV ATS friendly with clean standard single-column layout.', icon: <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> },
  { label: 'Make it one page', prompt: 'Make it one page and adjust spacing to fit cleanly.', icon: <Minimize2 className="w-3.5 h-3.5 text-blue-600" /> },
  { label: 'Add my new job', prompt: 'Add my new job experience to my CV.', icon: <Briefcase className="w-3.5 h-3.5 text-amber-600" /> },
  { label: 'Change my CV design', prompt: 'Change my CV design to modern styling with blue accents.', icon: <Palette className="w-3.5 h-3.5 text-sky-600" /> },
];

export const AIChatPanel: React.FC = () => {
  const { messages, isAiThinking, sendMessage } = useResume();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAiThinking]);

  return (
    <div className="flex flex-col h-full bg-slate-50/40">
      {/* Friendly AI Header */}
      <div className="px-5 py-3.5 bg-white border-b border-slate-200/80 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-xs">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              AI CV Assistant
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </h2>
            <p className="text-[11px] text-slate-500">Ask anything to create or update your CV</p>
          </div>
        </div>
      </div>

      {/* Suggested Quick Prompt Chips */}
      <div className="px-4 py-2.5 bg-slate-100/70 border-b border-slate-200/60 overflow-x-auto no-scrollbar shrink-0">
        <div className="flex items-center gap-1.5 whitespace-nowrap">
          {FRIENDLY_QUICK_ACTIONS.map((action, idx) => (
            <button
              key={idx}
              onClick={() => sendMessage(action.prompt)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 text-xs font-semibold rounded-full border border-slate-200 hover:border-blue-300 transition-all shadow-2xs shrink-0 active:scale-95"
            >
              {action.icon}
              <span>{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
        {messages.map((message) => (
          <ChatMessageItem
            key={message.id}
            message={message}
            onSendPrompt={(prompt) => sendMessage(prompt)}
          />
        ))}

        {/* AI Generating Indicator */}
        {isAiThinking && (
          <div className="flex gap-3 items-start animate-in fade-in duration-200">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shrink-0 shadow-xs">
              <Sparkles className="w-4 h-4 animate-spin" />
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-sm p-3.5 shadow-subtle flex items-center gap-2.5 text-xs text-slate-600">
              <span className="font-medium text-slate-800">AI is updating your CV</span>
              <div className="flex gap-1 items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Bottom Input Area */}
      <ChatInputArea onSendMessage={sendMessage} isAiThinking={isAiThinking} />
    </div>
  );
};
