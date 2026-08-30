'use client';

import React, { useState } from 'react';
import { useResume } from '@/context/ResumeContext';
import {
  FileText,
  Plus,
  Copy,
  Trash2,
  CheckCircle2,
  Clock,
  Sparkles,
  X,
  Edit2,
  Lock,
} from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

export const MyResumesModal: React.FC = () => {
  const {
    isMyResumesModalOpen,
    setIsMyResumesModalOpen,
    resumesList,
    currentResumeId,
    switchResume,
    createNewResume,
    duplicateResume,
    deleteResume,
    renameResume,
    isGuest,
    setIsAuthModalOpen,
  } = useResume();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState<string>('');

  const handleStartRename = (id: string, currentTitle: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(id);
    setEditingTitle(currentTitle);
  };

  const handleSaveRename = async (id: string, e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation();
    if (editingTitle.trim()) {
      await renameResume(id, editingTitle.trim());
    }
    setEditingId(null);
  };

  return (
    <Modal
      isOpen={isMyResumesModalOpen}
      onClose={() => setIsMyResumesModalOpen(false)}
      title="My CVs"
      maxWidth="max-w-2xl"
    >
      <div className="space-y-6">
        {/* Header & Create New CTA */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500">
              Manage your resumes, switch between tailored CVs, or start a new version.
            </p>
          </div>
          <Button
            size="sm"
            variant="primary"
            onClick={async () => {
              await createNewResume('New Professional CV');
              setIsMyResumesModalOpen(false);
            }}
            icon={<Plus className="w-4 h-4" />}
            className="rounded-xl font-semibold shadow-xs"
          >
            Create New CV
          </Button>
        </div>

        {/* Guest Warning / Save Permanently Prompt */}
        {isGuest && (
          <div className="p-3.5 bg-blue-50/80 border border-blue-100 rounded-xl flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5 text-blue-900">
              <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
              <span>You are in Guest Mode. Your CVs are saved locally on this browser.</span>
            </div>
            <button
              onClick={() => {
                setIsMyResumesModalOpen(false);
                setIsAuthModalOpen(true);
              }}
              className="text-blue-700 font-bold hover:underline shrink-0 ml-2"
            >
              Sign In to Keep Permanently →
            </button>
          </div>
        )}

        {/* List of Resumes */}
        <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
          {resumesList.length === 0 ? (
            <div className="py-12 text-center text-slate-400 space-y-3">
              <FileText className="w-10 h-10 mx-auto text-slate-300" />
              <p className="text-sm">No CVs found. Create your first CV above!</p>
            </div>
          ) : (
            resumesList.map((item) => {
              const isActive = item.id === currentResumeId;
              const isEditing = editingId === item.id;

              return (
                <div
                  key={item.id}
                  onClick={async () => {
                    if (!isActive && !isEditing) {
                      await switchResume(item.id);
                      setIsMyResumesModalOpen(false);
                    }
                  }}
                  className={`group p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    isActive
                      ? 'border-blue-500 bg-blue-50/40 shadow-xs ring-1 ring-blue-500/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/60'
                  }`}
                >
                  {/* Left: Icon & Info */}
                  <div className="flex items-center gap-3.5 min-w-0 flex-1">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        isActive ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 group-hover:bg-blue-50 group-hover:text-blue-600'
                      }`}
                    >
                      <FileText className="w-5 h-5" />
                    </div>

                    <div className="min-w-0 flex-1">
                      {isEditing ? (
                        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="text"
                            value={editingTitle}
                            onChange={(e) => setEditingTitle(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSaveRename(item.id, e);
                              if (e.key === 'Escape') setEditingId(null);
                            }}
                            autoFocus
                            className="text-sm font-bold text-slate-900 border border-blue-500 rounded-md px-2 py-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                          />
                          <button
                            onClick={(e) => handleSaveRename(item.id, e)}
                            className="px-2 py-0.5 bg-blue-600 text-white text-xs font-bold rounded hover:bg-blue-700"
                          >
                            Save
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingId(null);
                            }}
                            className="px-2 py-0.5 bg-slate-200 text-slate-700 text-xs font-semibold rounded hover:bg-slate-300"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-slate-900 truncate">{item.title}</h4>
                          {isActive && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                              <CheckCircle2 className="w-3 h-3" />
                              Active
                            </span>
                          )}
                          {item.isPaid && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700">
                              PRO
                            </span>
                          )}
                        </div>
                      )}

                      <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                        <span className="capitalize">{item.template || 'Modern Pro'}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(item.updatedAt).toLocaleDateString([], {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  {!isEditing && (
                    <div className="flex items-center gap-1 shrink-0 ml-3">
                      <button
                        onClick={(e) => handleStartRename(item.id, item.title, e)}
                        className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                        title="Rename CV"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          duplicateResume(item.id);
                        }}
                        className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                        title="Duplicate CV"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>

                      {resumesList.length > 1 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm(`Are you sure you want to delete "${item.title}"?`)) {
                              deleteResume(item.id);
                            }
                          }}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete CV"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </Modal>
  );
};
