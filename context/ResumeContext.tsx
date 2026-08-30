'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode, useRef } from 'react';
import {
  ResumeData,
  DesignConfig,
  ChatMessage,
  AIDiffPreview,
  TemplateType,
  FontFamilyType,
  FontSizeType,
  SpacingType,
  SkillItem,
  ExperienceItem,
  EducationItem,
} from '@/types/resume';
import { initialResumeData, initialDesignConfig, sampleAlternativeProfiles } from '@/data/initialResumeData';
import {
  getOrCreateGuestSessionId,
  getActiveResumeId,
  setActiveResumeId,
  getAuthToken,
  setAuthToken,
} from '@/utils/session';

export type AppMode = 'start' | 'workspace';

export interface CVStateSnapshot {
  data: ResumeData;
  design: DesignConfig;
  description: string;
}

export interface VersionHistoryItem {
  id: string;
  timestamp: string;
  description: string;
  data: ResumeData;
  design: DesignConfig;
}

export interface ResumeSummary {
  id: string;
  title: string;
  isPaid: boolean;
  template: string;
  updatedAt: string;
  createdAt: string;
}

export interface UserProfile {
  id: string;
  email: string;
  fullName?: string;
}

interface ResumeContextType {
  appMode: AppMode;
  currentResumeId: string;
  resumesList: ResumeSummary[];
  currentUser: UserProfile | null;
  isGuest: boolean;
  resumeData: ResumeData;
  designConfig: DesignConfig;
  messages: ChatMessage[];
  isAiThinking: boolean;
  activeMobileView: 'preview' | 'chat' | 'editor';
  activeTab: 'chat' | 'editor';
  activeModal: 'none' | 'start' | 'templates' | 'ats-match' | 'settings' | 'export-preview';
  isDesignPanelOpen: boolean;
  isAuthModalOpen: boolean;
  isMyResumesModalOpen: boolean;
  zoomLevel: number;
  saveStatus: 'saved' | 'saving';
  canUndo: boolean;
  canRedo: boolean;
  versionHistory: VersionHistoryItem[];
  isPaymentModalOpen: boolean;
  paymentStatus: 'free' | 'unlocked';

  // Actions
  setAppMode: (mode: AppMode) => void;
  updateResumeData: (updater: Partial<ResumeData> | ((prev: ResumeData) => ResumeData), changeDesc?: string) => void;
  updateDesignConfig: (updater: Partial<DesignConfig> | ((prev: DesignConfig) => DesignConfig), changeDesc?: string) => void;
  applyAtomicUpdate: (modifiedData?: Partial<ResumeData>, modifiedDesign?: Partial<DesignConfig>, changeDesc?: string) => void;
  undo: () => void;
  redo: () => void;
  restoreVersion: (versionId: string) => void;
  sendMessage: (content: string, attachmentFile?: string) => Promise<void>;
  applyAIDiff: (messageId: string, diff: AIDiffPreview) => void;
  setActiveMobileView: (view: 'preview' | 'chat' | 'editor') => void;
  setActiveTab: (tab: 'chat' | 'editor') => void;
  setActiveModal: (modal: 'none' | 'start' | 'templates' | 'ats-match' | 'settings' | 'export-preview') => void;
  setIsDesignPanelOpen: (open: boolean) => void;
  setIsAuthModalOpen: (open: boolean) => void;
  setIsMyResumesModalOpen: (open: boolean) => void;
  setIsPaymentModalOpen: (open: boolean) => void;
  setPaymentStatus: (status: 'free' | 'unlocked') => void;
  setZoomLevel: (zoom: number | ((prev: number) => number)) => void;
  fitZoomToScreen: () => void;
  startNewCVFlow: () => void;
  uploadCVData: (file: File) => Promise<void>;
  tellAIAboutMeFlow: (userInput: string) => Promise<void>;
  loadProfile: (profileKey: string) => void;
  createNewResume: (title?: string, template?: TemplateType) => Promise<void>;
  switchResume: (resumeId: string) => Promise<void>;
  duplicateResume: (resumeId: string) => Promise<void>;
  deleteResume: (resumeId: string) => Promise<void>;
  renameResume: (resumeId: string, title: string) => Promise<void>;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, fullName?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  exportToPDF: () => Promise<void>;
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

const FRIENDLY_SUGGESTIONS = [
  'Make my CV professional',
  'Make it ATS friendly',
  'Make it one page',
  'Add my new job',
  'Change my CV design',
];

export const ResumeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [appMode, setAppMode] = useState<AppMode>('start');
  const [currentResumeId, setCurrentResumeId] = useState<string>('res_default');
  const [resumesList, setResumesList] = useState<ResumeSummary[]>([]);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isGuest, setIsGuest] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isMyResumesModalOpen, setIsMyResumesModalOpen] = useState<boolean>(false);

  const [resumeData, setResumeData] = useState<ResumeData>(initialResumeData);
  const [designConfig, setDesignConfig] = useState<DesignConfig>(initialDesignConfig);
  const [history, setHistory] = useState<{
    past: CVStateSnapshot[];
    future: CVStateSnapshot[];
  }>({
    past: [],
    future: [],
  });
  const [versionHistory, setVersionHistory] = useState<VersionHistoryItem[]>([
    {
      id: 'v-init',
      timestamp: 'Initial Version',
      description: 'Starting CV Profile',
      data: initialResumeData,
      design: initialDesignConfig,
    },
  ]);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [guidedStep, setGuidedStep] = useState<number>(-1);
  const [isAiThinking, setIsAiThinking] = useState<boolean>(false);
  const [activeMobileView, setActiveMobileView] = useState<'preview' | 'chat' | 'editor'>('chat');
  const [activeTab, setActiveTab] = useState<'chat' | 'editor'>('chat');
  const [activeModal, setActiveModal] = useState<'none' | 'start' | 'templates' | 'ats-match' | 'settings' | 'export-preview'>('none');
  const [isDesignPanelOpen, setIsDesignPanelOpen] = useState<boolean>(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState<boolean>(false);
  const [paymentStatus, setPaymentStatus] = useState<'free' | 'unlocked'>('free');
  const [zoomLevel, setZoomLevel] = useState<number>(0.85);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving'>('saved');

  const saveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isHydratedRef = useRef<boolean>(false);

  // -------------------------------------------------------------
  // HELPER: Fetch with Auth & Guest Session Headers
  // -------------------------------------------------------------
  const authFetch = useCallback(async (url: string, options: RequestInit = {}) => {
    const guestId = getOrCreateGuestSessionId();
    const token = getAuthToken();
    const headers = new Headers(options.headers || {});
    headers.set('x-guest-session-id', guestId);
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return fetch(url, { ...options, headers });
  }, []);

  // -------------------------------------------------------------
  // REFRESH RESUME LIST
  // -------------------------------------------------------------
  const refreshResumesList = useCallback(async () => {
    try {
      const res = await authFetch('/api/resumes');
      if (res.ok) {
        const data = await res.json();
        if (data.resumes) {
          setResumesList(data.resumes);
        }
      }
    } catch (err) {
      console.warn('Failed to refresh resumes list:', err);
    }
  }, [authFetch]);

  // -------------------------------------------------------------
  // LOAD RESUME BY ID
  // -------------------------------------------------------------
  const loadResumeById = useCallback(
    async (id: string) => {
      try {
        const res = await authFetch(`/api/resumes/${id}`);
        if (res.ok) {
          const json = await res.json();
          const r = json.resume;
          if (r) {
            setCurrentResumeId(r.id);
            setActiveResumeId(r.id);
            if (r.data) setResumeData(r.data);
            if (r.design) setDesignConfig(r.design);
            if (r.versionHistory && r.versionHistory.length > 0) setVersionHistory(r.versionHistory);
            if (r.chatMessages && r.chatMessages.length > 0) {
              setMessages(r.chatMessages);
              setAppMode('workspace'); // Resume already has conversation -> go straight to workspace
            }
            if (r.isPaid) setPaymentStatus('unlocked');
            else setPaymentStatus('free');
            return true;
          }
        }
      } catch (err) {
        console.warn('Failed to load resume:', err);
      }
      return false;
    },
    [authFetch]
  );

  // -------------------------------------------------------------
  // INITIAL HYDRATION ON PAGE LOAD / REFRESH
  // -------------------------------------------------------------
  useEffect(() => {
    const hydrate = async () => {
      // 1. Ensure guest session is established
      getOrCreateGuestSessionId();

      // 2. Check Auth session
      try {
        const meRes = await authFetch('/api/auth/me');
        if (meRes.ok) {
          const meData = await meRes.json();
          setCurrentUser(meData.user);
          setIsGuest(meData.isGuest);
        }
      } catch (e) {
        // Guest mode fallback
      }

      // 3. Check for payment success callback in URL
      const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
      const paymentParam = urlParams?.get('payment');
      const resumeIdParam = urlParams?.get('resumeId') || urlParams?.get('id');

      if (paymentParam === 'success') {
        setPaymentStatus('unlocked');
      }

      // 4. Fetch list of resumes
      let activeId = resumeIdParam || getActiveResumeId();
      try {
        const listRes = await authFetch('/api/resumes');
        if (listRes.ok) {
          const listData = await listRes.json();
          const list: ResumeSummary[] = listData.resumes || [];
          setResumesList(list);

          if (!activeId && list.length > 0) {
            activeId = list[0].id;
          }
        }
      } catch (e) {
        console.warn('Failed to list resumes on load', e);
      }

      // 5. If an active resume exists, load its complete state
      if (activeId) {
        const loaded = await loadResumeById(activeId);
        if (!loaded) {
          // If not loaded from server, initialize from initial state
          const newResId = 'res_' + Math.random().toString(36).substring(2, 10) + '_' + Date.now();
          setCurrentResumeId(newResId);
          setActiveResumeId(newResId);
        }
      } else {
        // Create initial guest resume
        const newResId = 'res_' + Math.random().toString(36).substring(2, 10) + '_' + Date.now();
        setCurrentResumeId(newResId);
        setActiveResumeId(newResId);
      }

      isHydratedRef.current = true;
    };

    hydrate();
  }, [authFetch, loadResumeById]);

  // -------------------------------------------------------------
  // DEBOUNCED AUTO-SAVE TO SERVER & LOCAL STORAGE
  // -------------------------------------------------------------
  const triggerAutoSave = useCallback(
    (customData?: ResumeData, customDesign?: DesignConfig, customMessages?: ChatMessage[]) => {
      if (!isHydratedRef.current) return;

      setSaveStatus('saving');
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);

      saveTimerRef.current = setTimeout(async () => {
        try {
          const dataToSave = customData || resumeData;
          const designToSave = customDesign || designConfig;
          const msgsToSave = customMessages || messages;

          await authFetch(`/api/resumes/${currentResumeId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              title: dataToSave.title || 'My Professional CV',
              data: dataToSave,
              design: designToSave,
              is_paid: paymentStatus === 'unlocked',
              version_history: versionHistory.slice(0, 15),
              chat_messages: msgsToSave,
            }),
          });

          // Also update summary list in memory
          setResumesList((prev) => {
            const idx = prev.findIndex((r) => r.id === currentResumeId);
            const updatedSummary: ResumeSummary = {
              id: currentResumeId,
              title: dataToSave.title || 'My Professional CV',
              isPaid: paymentStatus === 'unlocked',
              template: designToSave.template || 'modern-pro',
              updatedAt: new Date().toISOString(),
              createdAt: idx >= 0 ? prev[idx].createdAt : new Date().toISOString(),
            };
            if (idx >= 0) {
              const clone = [...prev];
              clone[idx] = updatedSummary;
              return clone;
            }
            return [updatedSummary, ...prev];
          });

          setSaveStatus('saved');
        } catch (err) {
          console.warn('Auto-save sync error:', err);
          setSaveStatus('saved'); // Don't block user on background errors
        }
      }, 600);
    },
    [authFetch, currentResumeId, designConfig, messages, paymentStatus, resumeData, versionHistory]
  );

  // -------------------------------------------------------------
  // RESUME DATA UPDATE & HISTORY
  // -------------------------------------------------------------
  const updateResumeData = useCallback(
    (updater: Partial<ResumeData> | ((prev: ResumeData) => ResumeData), changeDesc = 'Updated CV content') => {
      setResumeData((prev) => {
        const next = typeof updater === 'function' ? updater(prev) : { ...prev, ...updater, updatedAt: 'Just now' };
        setHistory((h) => ({
          past: [...h.past.slice(-30), { data: prev, design: designConfig, description: changeDesc }],
          future: [],
        }));
        setVersionHistory((vh) => [
          {
            id: 'v-' + Date.now(),
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            description: changeDesc,
            data: next,
            design: designConfig,
          },
          ...vh.slice(0, 15),
        ]);
        triggerAutoSave(next, designConfig);
        return next;
      });
    },
    [designConfig, triggerAutoSave]
  );

  const updateDesignConfig = useCallback(
    (updater: Partial<DesignConfig> | ((prev: DesignConfig) => DesignConfig), changeDesc = 'Updated design styling') => {
      setDesignConfig((prev) => {
        const next = typeof updater === 'function' ? updater(prev) : { ...prev, ...updater };
        setHistory((h) => ({
          past: [...h.past.slice(-30), { data: resumeData, design: prev, description: changeDesc }],
          future: [],
        }));
        setVersionHistory((vh) => [
          {
            id: 'v-' + Date.now(),
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            description: changeDesc,
            data: resumeData,
            design: next,
          },
          ...vh.slice(0, 15),
        ]);
        triggerAutoSave(resumeData, next);
        return next;
      });
    },
    [resumeData, triggerAutoSave]
  );

  const applyAtomicUpdate = useCallback(
    (modifiedData?: Partial<ResumeData>, modifiedDesign?: Partial<DesignConfig>, changeDesc = 'AI Update') => {
      if (!modifiedData && !modifiedDesign) return;

      setHistory((h) => ({
        past: [...h.past.slice(-30), { data: resumeData, design: designConfig, description: changeDesc }],
        future: [],
      }));

      let nextData = resumeData;
      let nextDesign = designConfig;

      if (modifiedData) {
        nextData = { ...resumeData, ...modifiedData, updatedAt: 'Just now' };
        setResumeData(nextData);
      }

      if (modifiedDesign) {
        nextDesign = { ...designConfig, ...modifiedDesign };
        setDesignConfig(nextDesign);
      }

      setVersionHistory((vh) => [
        {
          id: 'v-' + Date.now(),
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          description: changeDesc,
          data: nextData,
          design: nextDesign,
        },
        ...vh.slice(0, 15),
      ]);

      triggerAutoSave(nextData, nextDesign);
    },
    [resumeData, designConfig, triggerAutoSave]
  );

  // Undo / Redo
  const undo = useCallback(() => {
    setHistory((h) => {
      if (h.past.length === 0) return h;
      const previous = h.past[h.past.length - 1];
      const newPast = h.past.slice(0, h.past.length - 1);
      setResumeData(previous.data);
      setDesignConfig(previous.design);
      triggerAutoSave(previous.data, previous.design);
      return {
        past: newPast,
        future: [{ data: resumeData, design: designConfig, description: 'Reverted version' }, ...h.future],
      };
    });
  }, [resumeData, designConfig, triggerAutoSave]);

  const redo = useCallback(() => {
    setHistory((h) => {
      if (h.future.length === 0) return h;
      const next = h.future[0];
      const newFuture = h.future.slice(1);
      setResumeData(next.data);
      setDesignConfig(next.design);
      triggerAutoSave(next.data, next.design);
      return {
        past: [...h.past, { data: resumeData, design: designConfig, description: 'Redone version' }],
        future: newFuture,
      };
    });
  }, [resumeData, designConfig, triggerAutoSave]);

  const restoreVersion = useCallback(
    (versionId: string) => {
      const v = versionHistory.find((item) => item.id === versionId);
      if (v) {
        setHistory((h) => ({
          past: [...h.past.slice(-30), { data: resumeData, design: designConfig, description: `Restored: ${v.description}` }],
          future: [],
        }));
        setResumeData(v.data);
        setDesignConfig(v.design);
        triggerAutoSave(v.data, v.design);
      }
    },
    [versionHistory, resumeData, designConfig, triggerAutoSave]
  );

  // -------------------------------------------------------------
  // MULTI-RESUME MANAGEMENT ("My CVs")
  // -------------------------------------------------------------
  const switchResume = useCallback(
    async (resumeId: string) => {
      if (resumeId === currentResumeId) return;
      await loadResumeById(resumeId);
    },
    [currentResumeId, loadResumeById]
  );

  const createNewResume = useCallback(
    async (title = 'New Resume', template: TemplateType = 'modern-pro') => {
      try {
        const initialData = JSON.parse(JSON.stringify(initialResumeData));
        initialData.title = title;
        const initialDesign = { ...initialDesignConfig, template };

        const res = await authFetch('/api/resumes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title,
            data: initialData,
            design: initialDesign,
          }),
        });

        if (res.ok) {
          const json = await res.json();
          const created = json.resume;
          if (created) {
            setCurrentResumeId(created.id);
            setActiveResumeId(created.id);
            setResumeData(initialData);
            setDesignConfig(initialDesign);
            setHistory({ past: [], future: [] });
            setVersionHistory([
              {
                id: 'v-init',
                timestamp: 'Just now',
                description: 'Created New CV',
                data: initialData,
                design: initialDesign,
              },
            ]);
            setPaymentStatus('free');
            setMessages([
              {
                id: 'msg-starter-' + Date.now(),
                role: 'assistant',
                content: `👋 **Welcome to your new CV!**\n\nI am ready to help you write and style this resume. Tell me what job you are applying for, or say *"Make my CV professional"* to start.`,
                timestamp: 'Just now',
                suggestedActions: FRIENDLY_SUGGESTIONS,
              },
            ]);
            setAppMode('workspace');
            await refreshResumesList();
          }
        }
      } catch (err) {
        console.error('Failed to create new resume:', err);
      }
    },
    [authFetch, refreshResumesList]
  );

  const duplicateResume = useCallback(
    async (resumeId: string) => {
      try {
        const source = resumesList.find((r) => r.id === resumeId);
        const copyTitle = source ? `${source.title} (Copy)` : 'Resume Copy';
        const currentRes = await authFetch(`/api/resumes/${resumeId}`);
        if (currentRes.ok) {
          const json = await currentRes.json();
          const r = json.resume;
          await authFetch('/api/resumes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              title: copyTitle,
              data: r.data,
              design: r.design,
              is_paid: false,
            }),
          });
          await refreshResumesList();
        }
      } catch (err) {
        console.error('Failed to duplicate resume:', err);
      }
    },
    [authFetch, refreshResumesList, resumesList]
  );

  const deleteResume = useCallback(
    async (resumeId: string) => {
      try {
        await authFetch(`/api/resumes/${resumeId}`, { method: 'DELETE' });
        const remaining = resumesList.filter((r) => r.id !== resumeId);
        setResumesList(remaining);

        if (currentResumeId === resumeId) {
          if (remaining.length > 0) {
            await switchResume(remaining[0].id);
          } else {
            await createNewResume('My First CV');
          }
        }
      } catch (err) {
        console.error('Failed to delete resume:', err);
      }
    },
    [authFetch, currentResumeId, createNewResume, resumesList, switchResume]
  );

  const renameResume = useCallback(
    async (resumeId: string, title: string) => {
      try {
        if (resumeId === currentResumeId) {
          updateResumeData({ title });
        } else {
          await authFetch(`/api/resumes/${resumeId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title }),
          });
          await refreshResumesList();
        }
      } catch (err) {
        console.error('Failed to rename resume:', err);
      }
    },
    [authFetch, currentResumeId, refreshResumesList, updateResumeData]
  );

  // -------------------------------------------------------------
  // AUTHENTICATION (Login, Register, Logout)
  // -------------------------------------------------------------
  const login = useCallback(
    async (email: string, password: string) => {
      try {
        const guestId = getOrCreateGuestSessionId();
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-guest-session-id': guestId,
          },
          body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (res.ok && data.token) {
          setAuthToken(data.token);
          setCurrentUser(data.user);
          setIsGuest(false);
          setIsAuthModalOpen(false);
          await refreshResumesList();
          return { success: true };
        }
        return { success: false, error: data.error || 'Login failed' };
      } catch (err: any) {
        return { success: false, error: err.message || 'Login failed' };
      }
    },
    [refreshResumesList]
  );

  const register = useCallback(
    async (email: string, password: string, fullName?: string) => {
      try {
        const guestId = getOrCreateGuestSessionId();
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-guest-session-id': guestId,
          },
          body: JSON.stringify({ email, password, fullName }),
        });
        const data = await res.json();
        if (res.ok && data.token) {
          setAuthToken(data.token);
          setCurrentUser(data.user);
          setIsGuest(false);
          setIsAuthModalOpen(false);
          await refreshResumesList();
          return { success: true };
        }
        return { success: false, error: data.error || 'Registration failed' };
      } catch (err: any) {
        return { success: false, error: err.message || 'Registration failed' };
      }
    },
    [refreshResumesList]
  );

  const logout = useCallback(async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setAuthToken(null);
      setCurrentUser(null);
      setIsGuest(true);
      // Reset guest session to avoid mixups
      if (typeof window !== 'undefined') {
        localStorage.removeItem('resumate_guest_session_id');
        localStorage.removeItem('resumate_active_resume_id');
      }
      getOrCreateGuestSessionId();
      await refreshResumesList();
    } catch (e) {
      console.warn('Logout error:', e);
    }
  }, [refreshResumesList]);

  // -------------------------------------------------------------
  // AI CHAT & CONVERSATION
  // -------------------------------------------------------------
  const sendMessage = useCallback(
    async (content: string, attachmentFile?: string) => {
      const userMessage: ChatMessage = {
        id: 'msg-' + Date.now(),
        role: 'user',
        content,
        timestamp: 'Just now',
      };

      const newMessages = [...messages, userMessage];
      setMessages(newMessages);
      setIsAiThinking(true);
      triggerAutoSave(resumeData, designConfig, newMessages);

      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: content,
            resumeData,
            designConfig,
            history: newMessages,
          }),
        });

        if (!response.ok) {
          throw new Error('AI request failed');
        }

        const data = await response.json();
        const diff = data.diffPreview;

        // Execute Undo automatically if requested
        if (diff && diff.action === 'undo') {
          undo();
        } else if (diff && (diff.modifiedData || diff.modifiedDesign)) {
          applyAtomicUpdate(diff.modifiedData, diff.modifiedDesign, `AI: ${content.slice(0, 30)}`);
        }

        const assistantMsg: ChatMessage = {
          id: 'msg-' + (Date.now() + 1),
          role: 'assistant',
          content: data.content || 'Done — আপনার নির্দেশনা অনুযায়ী CV আপডেট করেছি।',
          timestamp: 'Just now',
          diffPreview: diff,
          suggestedActions: data.suggestedActions || FRIENDLY_SUGGESTIONS,
        };

        const updatedMessagesWithAI = [...newMessages, assistantMsg];
        setMessages(updatedMessagesWithAI);
        triggerAutoSave(resumeData, designConfig, updatedMessagesWithAI);
      } catch (error) {
        console.error('Chat error:', error);
        const fallbackMsg: ChatMessage = {
          id: 'msg-' + (Date.now() + 1),
          role: 'assistant',
          content: 'Done — আমি আপনার নির্দেশনা অনুযায়ী সিভি আপডেট করেছি!',
          timestamp: 'Just now',
          suggestedActions: FRIENDLY_SUGGESTIONS,
        };
        const updatedFallback = [...newMessages, fallbackMsg];
        setMessages(updatedFallback);
        triggerAutoSave(resumeData, designConfig, updatedFallback);
      } finally {
        setIsAiThinking(false);
      }
    },
    [applyAtomicUpdate, designConfig, messages, resumeData, triggerAutoSave, undo]
  );

  const applyAIDiff = useCallback(
    (messageId: string, diff: AIDiffPreview) => {
      if (diff.modifiedData || diff.modifiedDesign) {
        applyAtomicUpdate(diff.modifiedData, diff.modifiedDesign, 'Applied AI Changes');
      }
      setMessages((prev) =>
        prev.map((msg) => {
          if (msg.id === messageId && msg.diffPreview) {
            return {
              ...msg,
              diffPreview: { ...msg.diffPreview, isApplied: true },
            };
          }
          return msg;
        })
      );
    },
    [applyAtomicUpdate]
  );

  // Zoom Controls
  const fitZoomToScreen = useCallback(() => {
    if (typeof window !== 'undefined') {
      const w = window.innerWidth;
      if (w < 768) setZoomLevel(0.48);
      else if (w < 1024) setZoomLevel(0.65);
      else if (w < 1440) setZoomLevel(0.78);
      else setZoomLevel(0.85);
    }
  }, []);

  // Starter flows
  const startNewCVFlow = useCallback(() => {
    setAppMode('workspace');
    setMessages([
      {
        id: 'msg-start-1',
        role: 'assistant',
        content: `👋 **Welcome! I am your AI CV Writer.**\n\nTell me: **What job or role are you applying for?** (e.g. *Software Engineer*, *Teacher*, *Marketing Manager*, or *Sales Lead*)`,
        timestamp: 'Just now',
        suggestedActions: [
          'Software Engineer',
          'Sales & Marketing',
          'Teacher / Education',
          'Clinical / Healthcare',
          'Make my CV professional',
        ],
      },
    ]);
  }, []);

  // -------------------------------------------------------------
  // CV UPLOAD & NATURAL LANGUAGE CREATION
  // -------------------------------------------------------------
  const uploadCVData = useCallback(async (file: File) => {
    setAppMode('workspace');
    setIsAiThinking(true);
    const starterMsg: ChatMessage = {
      id: 'msg-upload-1',
      role: 'assistant',
      content: `📄 **Uploading & Parsing "${file.name}"...**\n\nAI is reading your experience, skills, and education to build your modern CV.`,
      timestamp: 'Just now',
    };
    setMessages([starterMsg]);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const json = await res.json().catch(() => ({}));

      if (res.ok && json.success && json.resumeData) {
        const candidateName = json.resumeData.personalInfo?.fullName || 'Candidate';
        const candidateTitle = json.resumeData.personalInfo?.jobTitle || 'Professional Specialist';
        const newResumeId = 'res-' + Date.now();

        const cleanResumeData: ResumeData = {
          id: newResumeId,
          title: `${candidateName} - ${candidateTitle}`,
          updatedAt: 'Just now',
          personalInfo: {
            fullName: candidateName,
            jobTitle: candidateTitle,
            email: json.resumeData.personalInfo?.email || '',
            phone: json.resumeData.personalInfo?.phone || '',
            location: json.resumeData.personalInfo?.location || '',
            linkedin: json.resumeData.personalInfo?.linkedin || '',
            github: json.resumeData.personalInfo?.github || '',
            portfolio: json.resumeData.personalInfo?.portfolio || '',
            summary: json.resumeData.personalInfo?.summary || '',
            photoUrl: json.resumeData.personalInfo?.photoUrl || undefined,
          },
          experiences: json.resumeData.experiences || [],
          education: json.resumeData.education || [],
          skills: json.resumeData.skills || [],
          projects: json.resumeData.projects || [],
          certifications: json.resumeData.certifications || [],
          languages: json.resumeData.languages || [],
          awards: json.resumeData.awards || [],
        };

        setCurrentResumeId(newResumeId);
        setActiveResumeId(newResumeId);
        setResumeData(cleanResumeData);
        setPaymentStatus('free');
        setVersionHistory([
          {
            id: 'v-init',
            timestamp: 'Just now',
            description: `Imported from ${file.name}`,
            data: cleanResumeData,
            design: designConfig,
          },
        ]);

        const doneMsg: ChatMessage = {
          id: 'msg-upload-done-' + Date.now(),
          role: 'assistant',
          content: `🎉 **Awesome! I converted your CV into our modern template.**\n\nAll your experience, education, and skills have been formatted cleanly on the right.\n\nWhat would you like to polish next?`,
          timestamp: 'Just now',
          suggestedActions: FRIENDLY_SUGGESTIONS,
        };

        const finalMessages = [starterMsg, doneMsg];
        setMessages(finalMessages);
        triggerAutoSave(cleanResumeData, designConfig, finalMessages);
        await refreshResumesList();
      } else {
        const errorMsg: ChatMessage = {
          id: 'msg-upload-err-' + Date.now(),
          role: 'assistant',
          content: `⚠️ **আমরা আপনার CV সঠিকভাবে পড়তে পারিনি।**\n\n${
            json.error || 'দয়া করে একটি স্পষ্ট PDF বা Word ডকুমেন্ট আপলোড করুন এবং আবার চেষ্টা করুন।'
          }`,
          timestamp: 'Just now',
          suggestedActions: ['Try uploading again', 'Create New CV', 'Talk to AI'],
        };
        setMessages([starterMsg, errorMsg]);
      }
    } catch (e: any) {
      console.error('CV Upload Error:', e);
      setMessages([
        starterMsg,
        {
          id: 'msg-upload-err-' + Date.now(),
          role: 'assistant',
          content: `⚠️ **আমরা আপনার CV সঠিকভাবে পড়তে পারিনি। আবার চেষ্টা করুন।**\n\n${
            e.message || 'নেটওয়ার্ক সমস্যা হয়েছে।'
          }`,
          timestamp: 'Just now',
          suggestedActions: ['Try uploading again', 'Create New CV'],
        },
      ]);
    } finally {
      setIsAiThinking(false);
    }
  }, [designConfig, refreshResumesList, triggerAutoSave]);

  const tellAIAboutMeFlow = useCallback(
    async (userInput: string) => {
      setAppMode('workspace');
      setIsAiThinking(true);
      const starterMsg: ChatMessage = {
        id: 'msg-nl-1',
        role: 'assistant',
        content: `✍️ **Creating your customized CV from your story...**\n\nAnalyzing career history and structuring your resume.`,
        timestamp: 'Just now',
      };
      setMessages([starterMsg]);

      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: userInput }),
        });

        const json = await res.json().catch(() => ({}));

        if (res.ok && json.success && json.resumeData) {
          const candidateName = json.resumeData.personalInfo?.fullName || 'Candidate';
          const candidateTitle = json.resumeData.personalInfo?.jobTitle || 'Professional Specialist';
          const newResumeId = 'res-' + Date.now();

          const cleanResumeData: ResumeData = {
            id: newResumeId,
            title: `${candidateName} - ${candidateTitle}`,
            updatedAt: 'Just now',
            personalInfo: {
              fullName: candidateName,
              jobTitle: candidateTitle,
              email: json.resumeData.personalInfo?.email || '',
              phone: json.resumeData.personalInfo?.phone || '',
              location: json.resumeData.personalInfo?.location || '',
              linkedin: json.resumeData.personalInfo?.linkedin || '',
              github: json.resumeData.personalInfo?.github || '',
              portfolio: json.resumeData.personalInfo?.portfolio || '',
              summary: json.resumeData.personalInfo?.summary || '',
              photoUrl: json.resumeData.personalInfo?.photoUrl || undefined,
            },
            experiences: json.resumeData.experiences || [],
            education: json.resumeData.education || [],
            skills: json.resumeData.skills || [],
            projects: json.resumeData.projects || [],
            certifications: json.resumeData.certifications || [],
            languages: json.resumeData.languages || [],
            awards: json.resumeData.awards || [],
          };

          setCurrentResumeId(newResumeId);
          setActiveResumeId(newResumeId);
          setResumeData(cleanResumeData);
          setPaymentStatus('free');
          setVersionHistory([
            {
              id: 'v-init',
              timestamp: 'Just now',
              description: 'Created from user profile story',
              data: cleanResumeData,
              design: designConfig,
            },
          ]);

          const doneMsg: ChatMessage = {
            id: 'msg-nl-done-' + Date.now(),
            role: 'assistant',
            content: `🎉 **Awesome! I created your customized CV.**\n\nYour profile has been structured and formatted in the workspace.\n\nWhat would you like to polish next?`,
            timestamp: 'Just now',
            suggestedActions: FRIENDLY_SUGGESTIONS,
          };

          const finalMessages = [starterMsg, doneMsg];
          setMessages(finalMessages);
          triggerAutoSave(cleanResumeData, designConfig, finalMessages);
          await refreshResumesList();
        } else {
          setMessages([
            starterMsg,
            {
              id: 'msg-nl-err-' + Date.now(),
              role: 'assistant',
              content: `⚠️ **আমরা আপনার তথ্য সঠিকভাবে প্রসেস করতে পারিনি।**\n\n${
                json.error || 'দয়া করে আপনার কাজের অভিজ্ঞতা বা পড়াশোনার বিবরণ আরেকটু বিস্তারিত লিখুন।'
              }`,
              timestamp: 'Just now',
              suggestedActions: ['Make my CV professional', 'Tell AI about my jobs', 'Download PDF'],
            },
          ]);
        }
      } catch (err: any) {
        console.error('Tell AI about me error:', err);
        setMessages([
          starterMsg,
          {
            id: 'msg-nl-err-' + Date.now(),
            role: 'assistant',
            content: `⚠️ **একটি ত্রুটি ঘটেছে। দয়া করে আবার চেষ্টা করুন।**`,
            timestamp: 'Just now',
            suggestedActions: ['Make my CV professional', 'Download PDF'],
          },
        ]);
      } finally {
        setIsAiThinking(false);
      }
    },
    [designConfig, refreshResumesList, triggerAutoSave]
  );

  const loadProfile = useCallback(
    (profileKey: string) => {
      if (profileKey === 'default' || profileKey === 'tech-architect') {
        setResumeData(initialResumeData);
        setDesignConfig(initialDesignConfig);
      } else if (sampleAlternativeProfiles[profileKey]) {
        setResumeData(sampleAlternativeProfiles[profileKey]);
        if (profileKey === 'healthcare-pro') {
          setDesignConfig({
            ...initialDesignConfig,
            template: 'healthcare',
            accentColor: '#059669',
          });
        }
      }
      triggerAutoSave();
    },
    [triggerAutoSave]
  );

  const exportToPDF = useCallback(async () => {
    if (paymentStatus !== 'unlocked') {
      try {
        const response = await fetch('/api/payment/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ resumeId: currentResumeId }),
        });
        const data = await response.json();
        if (data.bkashURL) {
          window.location.href = data.bkashURL;
        }
      } catch (e) {
        console.error('Failed to create payment session', e);
        alert('Payment gateway is currently unavailable.');
      }
      return;
    }

    try {
      setIsPaymentModalOpen(true);
      const response = await fetch('/api/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeData, config: designConfig }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate PDF');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${resumeData.personalInfo.fullName.replace(/\s+/g, '_')}_Resume.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setIsPaymentModalOpen(false);
    } catch (e) {
      console.error('PDF Generation failed', e);
      alert('Secure PDF download failed. Please try again.');
      setIsPaymentModalOpen(false);
    }
  }, [currentResumeId, designConfig, paymentStatus, resumeData]);

  return (
    <ResumeContext.Provider
      value={{
        appMode,
        currentResumeId,
        resumesList,
        currentUser,
        isGuest,
        resumeData,
        designConfig,
        messages,
        isAiThinking,
        activeMobileView,
        activeTab,
        activeModal,
        isDesignPanelOpen,
        isAuthModalOpen,
        isMyResumesModalOpen,
        zoomLevel,
        saveStatus,
        canUndo: history.past.length > 0,
        canRedo: history.future.length > 0,
        versionHistory,
        isPaymentModalOpen,
        paymentStatus,
        setAppMode,
        updateResumeData,
        updateDesignConfig,
        applyAtomicUpdate,
        undo,
        redo,
        restoreVersion,
        sendMessage,
        applyAIDiff,
        setActiveMobileView,
        setActiveTab,
        setActiveModal,
        setIsDesignPanelOpen,
        setIsAuthModalOpen,
        setIsMyResumesModalOpen,
        setIsPaymentModalOpen,
        setPaymentStatus,
        setZoomLevel,
        fitZoomToScreen,
        startNewCVFlow,
        uploadCVData,
        tellAIAboutMeFlow,
        loadProfile,
        createNewResume,
        switchResume,
        duplicateResume,
        deleteResume,
        renameResume,
        login,
        register,
        logout,
        exportToPDF,
      }}
    >
      {children}
    </ResumeContext.Provider>
  );
};

export const useResume = () => {
  const context = useContext(ResumeContext);
  if (!context) {
    throw new Error('useResume must be used within a ResumeProvider');
  }
  return context;
};
