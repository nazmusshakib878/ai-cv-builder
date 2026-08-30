'use client';

import React, { useState, useRef, KeyboardEvent } from 'react';
import { Send, Paperclip, Sparkles, X } from 'lucide-react';

interface ChatInputAreaProps {
  onSendMessage: (text: string, attachment?: string) => void;
  isAiThinking: boolean;
}

export const ChatInputArea: React.FC<ChatInputAreaProps> = ({ onSendMessage, isAiThinking }) => {
  const [inputText, setInputText] = useState('');
  const [attachment, setAttachment] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if ((!inputText.trim() && !attachment) || isAiThinking) return;
    onSendMessage(inputText.trim() || 'Please update my CV based on the attached file', attachment || undefined);
    setInputText('');
    setAttachment(null);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachment(file.name);
    }
  };

  return (
    <div className="p-3.5 sm:p-4 bg-white border-t border-slate-200/80 shrink-0">
      {/* Active Attachment Pill */}
      {attachment && (
        <div className="flex items-center justify-between mb-2.5 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900">
          <div className="flex items-center gap-2 truncate">
            <Paperclip className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span className="font-semibold truncate">{attachment}</span>
          </div>
          <button
            onClick={() => setAttachment(null)}
            className="p-1 hover:bg-blue-100 rounded text-blue-700 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Input Box */}
      <div className="relative rounded-2xl border-2 border-slate-200 bg-slate-50/70 focus-within:bg-white focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10 transition-all shadow-xs">
        <textarea
          ref={textareaRef}
          value={inputText}
          onChange={(e) => {
            setInputText(e.target.value);
            e.target.style.height = 'auto';
            e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
          }}
          onKeyDown={handleKeyDown}
          placeholder="Tell AI what to change (e.g. 'Make it one page' or 'Add my new job')..."
          rows={2}
          className="w-full bg-transparent px-4 pt-3.5 pb-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none resize-none min-h-[54px] max-h-[120px]"
        />

        {/* Bottom Toolbar inside Input Box */}
        <div className="flex items-center justify-between px-3 pb-2.5 pt-1 border-t border-slate-100/80">
          <div className="flex items-center gap-1">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".pdf,.docx,.doc,.txt"
              className="hidden"
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              title="Attach document or old resume"
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Paperclip className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Attach file</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline text-[11px] text-slate-400 select-none">
              Press Enter ↵
            </span>
            <button
              onClick={handleSend}
              disabled={(!inputText.trim() && !attachment) || isAiThinking}
              aria-label="Send message"
              className="w-8 h-8 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white flex items-center justify-center transition-all shadow-xs active:scale-95 shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
