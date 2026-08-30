'use client';

import React from 'react';
import { ChatMessage, AIDiffPreview } from '@/types/resume';
import { Sparkles, Check, ArrowRight, User, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface ChatMessageItemProps {
  message: ChatMessage;
  onSendPrompt: (prompt: string) => void;
}

export const ChatMessageItem: React.FC<ChatMessageItemProps> = ({
  message,
  onSendPrompt,
}) => {
  const isAssistant = message.role === 'assistant';

  const renderFormattedContent = (content: string) => {
    const lines = content.split('\n');
    return (
      <div className="space-y-1.5 text-[13.5px] leading-relaxed">
        {lines.map((line, idx) => {
          if (line.startsWith('• ') || line.startsWith('- ') || line.startsWith('* ')) {
            const itemText = line.replace(/^[•\-*]\s*/, '');
            return (
              <div key={idx} className="flex items-start gap-2 pl-1">
                <span className="text-blue-500 font-bold select-none">•</span>
                <span>{renderInlineStyles(itemText)}</span>
              </div>
            );
          }
          if (line.trim() === '') {
            return <div key={idx} className="h-1" />;
          }
          return <p key={idx}>{renderInlineStyles(line)}</p>;
        })}
      </div>
    );
  };

  const renderInlineStyles = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*|\*.*?\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-bold text-slate-950">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('*') && part.endsWith('*')) {
        return <em key={i} className="text-slate-700 italic">{part.slice(1, -1)}</em>;
      }
      return part;
    });
  };

  return (
    <div className={`flex gap-3 ${isAssistant ? 'items-start' : 'items-start flex-row-reverse'}`}>
      {/* Avatar */}
      <div
        className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs shadow-2xs ${
          isAssistant
            ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white'
            : 'bg-slate-800 text-white font-bold'
        }`}
      >
        {isAssistant ? <Sparkles className="w-4 h-4" /> : <User className="w-4 h-4" />}
      </div>

      {/* Message Content Container */}
      <div className={`max-w-[88%] space-y-2.5 ${isAssistant ? 'text-slate-800' : 'text-slate-900'}`}>
        <div
          className={`p-4 rounded-2xl text-sm leading-relaxed ${
            isAssistant
              ? 'bg-white border border-slate-200/90 shadow-subtle rounded-tl-sm text-slate-800'
              : 'bg-blue-600 text-white shadow-subtle rounded-tr-sm'
          }`}
        >
          {isAssistant ? renderFormattedContent(message.content) : message.content}
        </div>

        {/* Removed diffPreview manual apply box to support automatic ChatGPT-style live updates */}

        {/* Suggested Quick Prompt Chips */}
        {message.suggestedActions && message.suggestedActions.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {message.suggestedActions.map((action, idx) => (
              <button
                key={idx}
                onClick={() => onSendPrompt(action)}
                className="text-xs bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 font-medium border border-slate-200/90 hover:border-blue-300 px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 group shadow-2xs active:scale-[0.98]"
              >
                <span>{action}</span>
                <ArrowRight className="w-3 h-3 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-blue-600" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
