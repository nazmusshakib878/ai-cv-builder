import React, { useState } from 'react';
import { useResume } from '@/context/ResumeContext';
import { mockATSAnalysis } from '@/data/initialResumeData';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Search,
  Check,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const ATSMatchModal: React.FC = () => {
  const { activeModal, setActiveModal, sendMessage } = useResume();
  const [jobDescription, setJobDescription] = useState(
    'We are seeking a Principal Systems Architect to design high-throughput distributed microservices, LLM inference pipelines, and fault-tolerant cloud backends. Required: Go/Rust, Kubernetes, Kafka, SOC-2 Type II compliance experience.'
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(mockATSAnalysis);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && activeModal === 'ats-match') {
        setActiveModal('none');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeModal, setActiveModal]);

  if (activeModal !== 'ats-match') return null;

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalysis({
        ...mockATSAnalysis,
        overallScore: 96,
        matchedKeywords: [...mockATSAnalysis.matchedKeywords, 'Distributed Microservices', 'LLM Inference'],
      });
    }, 700);
  };

  const handleAutoTailor = () => {
    sendMessage(`Please tailor my resume specifically for this job description: "${jobDescription.slice(0, 150)}..."`);
    setActiveModal('none');
  };

  return (
    <div
      onClick={() => setActiveModal('none')}
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-3xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">ATS Job Match & Keyword Analyzer</h2>
              <p className="text-xs text-slate-500">Benchmark your CV against any job description</p>
            </div>
          </div>

          <button
            onClick={() => setActiveModal('none')}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs">
          {/* Job Description Input */}
          <div>
            <label className="block font-bold text-slate-900 mb-1.5 text-xs">
              Paste Target Job Description
            </label>
            <div className="relative">
              <textarea
                rows={3}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the target job requirements or responsibilities here..."
                className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50/60 text-slate-800 text-xs focus:outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all resize-none"
              />
              <button
                type="button"
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="absolute right-3 bottom-3 px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-medium flex items-center gap-1 shadow-sm transition-colors"
              >
                <Search className="w-3 h-3" />
                <span>{isAnalyzing ? 'Scanning...' : 'Re-scan Match'}</span>
              </button>
            </div>
          </div>

          {/* Match Score Card Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50/50 border border-emerald-200 text-center flex flex-col justify-center items-center">
              <div className="text-3xl font-extrabold text-emerald-700">{analysis.overallScore}%</div>
              <span className="text-xs font-bold text-emerald-950 mt-0.5">Overall Match</span>
              <span className="text-[10px] text-emerald-600 font-medium">Top 5% Candidate</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-center flex flex-col justify-center">
              <div className="text-xl font-bold text-slate-900">{analysis.keywordMatchScore}%</div>
              <span className="text-[11px] font-semibold text-slate-600 mt-0.5">Keyword Match</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-center flex flex-col justify-center">
              <div className="text-xl font-bold text-slate-900">{analysis.formattingScore}%</div>
              <span className="text-[11px] font-semibold text-slate-600 mt-0.5">ATS Formatting</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-center flex flex-col justify-center">
              <div className="text-xl font-bold text-slate-900">{analysis.quantifiableImpactScore}%</div>
              <span className="text-[11px] font-semibold text-slate-600 mt-0.5">Impact Metrics</span>
            </div>
          </div>

          {/* Keywords Match Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Matched */}
            <div className="p-4 rounded-xl border border-emerald-200/80 bg-emerald-50/30 space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-emerald-950 text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Found Keywords ({analysis.matchedKeywords.length})</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {analysis.matchedKeywords.map((kw, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded-md bg-white border border-emerald-200 text-emerald-800 text-[11px] font-medium"
                  >
                    ✓ {kw}
                  </span>
                ))}
              </div>
            </div>

            {/* Missing */}
            <div className="p-4 rounded-xl border border-amber-200/80 bg-amber-50/30 space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-amber-950 text-xs">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Missing Keywords ({analysis.missingKeywords.length})</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {analysis.missingKeywords.map((kw, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded-md bg-white border border-amber-200 text-amber-800 text-[11px] font-medium"
                  >
                    + {kw}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="space-y-2">
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">AI Optimization Insights</h3>
            <div className="space-y-1.5">
              {analysis.recommendations.map((rec) => (
                <div key={rec.id} className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 flex items-start gap-2.5">
                  {rec.type === 'strength' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  ) : (
                    <TrendingUp className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                  )}
                  <div>
                    <div className="font-bold text-slate-900 text-xs">{rec.title}</div>
                    <p className="text-slate-600 text-[11.5px] mt-0.5">{rec.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between shrink-0">
          <span className="text-xs text-slate-500">
            Powered by modern ATS parser benchmarking
          </span>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="ghost" onClick={() => setActiveModal('none')}>
              Close
            </Button>
            <Button
              size="sm"
              variant="brand"
              onClick={handleAutoTailor}
              icon={<Sparkles className="w-3.5 h-3.5" />}
            >
              Auto-Tailor CV with AI
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
