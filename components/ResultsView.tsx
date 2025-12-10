import React from 'react';
import { UploadedFile } from '../types';
import { Copy, Check, AlertCircle, Loader2, Sparkles, Tag, Type, AlignLeft } from 'lucide-react';

interface ResultsViewProps {
  files: UploadedFile[];
  onRemove: (id: string) => void;
}

export const ResultsView: React.FC<ResultsViewProps> = ({ files, onRemove }) => {
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="grid grid-cols-1 gap-6 w-full max-w-5xl mx-auto pb-32">
      {files.map((file) => (
        <div key={file.id} className="bg-slate-900/60 backdrop-blur-md rounded-2xl overflow-hidden border border-white/5 shadow-xl hover:border-primary-500/20 transition-all duration-300 group/card animate-fade-in flex flex-col md:flex-row">
          
          {/* Image Preview Side */}
          <div className="w-full md:w-64 bg-slate-950/50 relative flex-shrink-0 border-b md:border-b-0 md:border-r border-white/5">
            <div className="h-48 md:h-full w-full relative overflow-hidden">
               <img 
                src={file.previewUrl} 
                alt="Preview" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent opacity-60"></div>
            </div>
            
            {/* Overlay Actions */}
            <div className="absolute top-3 right-3 opacity-0 group-hover/card:opacity-100 transition-opacity duration-200">
               <button 
                onClick={() => onRemove(file.id)}
                className="bg-black/50 hover:bg-red-500/80 text-white p-2 rounded-lg backdrop-blur-sm transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>

            {/* Status Badges */}
            <div className="absolute bottom-3 left-3 flex gap-2">
              {file.modeProcessed === 'prompt' && (
                <div className="bg-indigo-500/90 backdrop-blur text-white text-[10px] font-bold px-2.5 py-1 rounded-md flex items-center gap-1.5 shadow-lg">
                  <Sparkles size={10} /> PROMPT
                </div>
              )}
              <div className="bg-black/60 backdrop-blur text-slate-300 text-[10px] font-medium px-2 py-1 rounded-md border border-white/10 uppercase">
                {file.file.type.split('/')[1] || 'IMG'}
              </div>
            </div>
          </div>

          {/* Content Side */}
          <div className="flex-1 p-6 min-w-0 flex flex-col justify-center">
            {file.status === 'processing' && (
               <div className="flex flex-col items-center justify-center py-12 text-primary-400">
                  <div className="relative">
                    <div className="absolute inset-0 bg-primary-500/20 blur-xl rounded-full"></div>
                    <Loader2 className="animate-spin relative z-10" size={40} />
                  </div>
                  <span className="text-sm font-medium mt-4 text-slate-300 animate-pulse">Analyzing visual data...</span>
               </div>
            )}

            {file.status === 'error' && (
              <div className="flex flex-col items-center justify-center py-8 text-red-400 bg-red-500/5 rounded-xl border border-red-500/10">
                <AlertCircle className="mb-2" size={32} />
                <span className="text-sm font-medium">{file.errorMsg || "Analysis failed"}</span>
              </div>
            )}

            {file.status === 'completed' && (
              <div className="space-y-5">
                
                {/* SEO Result View */}
                {file.result && (
                  <>
                    <div className="group/field">
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-[11px] font-bold text-primary-400 uppercase tracking-wider flex items-center gap-1.5">
                          <Type size={12} /> Title
                        </label>
                        <button 
                          onClick={() => copyToClipboard(file.result!.title, `t-${file.id}`)}
                          className="text-slate-500 hover:text-white transition-colors p-1"
                        >
                          {copiedId === `t-${file.id}` ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                        </button>
                      </div>
                      <div className="bg-slate-950/50 p-3 rounded-lg border border-white/5 text-sm text-slate-200 group-hover/field:border-primary-500/30 transition-colors">
                        {file.result.title}
                      </div>
                    </div>

                    <div className="group/field">
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-[11px] font-bold text-primary-400 uppercase tracking-wider flex items-center gap-1.5">
                          <AlignLeft size={12} /> Description
                        </label>
                        <button 
                          onClick={() => copyToClipboard(file.result!.description, `d-${file.id}`)}
                          className="text-slate-500 hover:text-white transition-colors p-1"
                        >
                          {copiedId === `d-${file.id}` ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                        </button>
                      </div>
                      <div className="bg-slate-950/50 p-3 rounded-lg border border-white/5 text-xs text-slate-400 leading-relaxed group-hover/field:border-primary-500/30 transition-colors">
                        {file.result.description}
                      </div>
                    </div>

                    <div className="group/field">
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-[11px] font-bold text-primary-400 uppercase tracking-wider flex items-center gap-1.5">
                          <Tag size={12} /> Keywords <span className="text-slate-600 ml-1">({file.result.keywords.length})</span>
                        </label>
                        <button 
                          onClick={() => copyToClipboard(file.result!.keywords.join(', '), `k-${file.id}`)}
                          className="text-slate-500 hover:text-white transition-colors p-1"
                        >
                          {copiedId === `k-${file.id}` ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-1.5 p-2 bg-slate-950/30 rounded-lg border border-white/5 group-hover/field:border-primary-500/30 transition-colors">
                        {file.result.keywords.map((kw, idx) => (
                          <span key={idx} className="text-[11px] bg-slate-800 hover:bg-primary-900/40 text-slate-300 hover:text-primary-200 px-2.5 py-1 rounded border border-white/5 transition-colors cursor-default">
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* Prompt Result View */}
                {file.promptResult && (
                  <div className="h-full flex flex-col">
                    <div className="flex items-center justify-between mb-3">
                       <label className="text-xs font-bold text-primary-400 uppercase flex items-center gap-2 bg-primary-500/10 px-2 py-1 rounded">
                         <Sparkles size={14} /> AI Reconstruction Prompt
                       </label>
                       <button 
                          onClick={() => copyToClipboard(file.promptResult!, `p-${file.id}`)}
                          className="text-slate-400 hover:text-white bg-slate-800 p-1.5 rounded hover:bg-slate-700 transition-all"
                        >
                          {copiedId === `p-${file.id}` ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                        </button>
                    </div>
                    <div className="flex-1 bg-slate-950 p-5 rounded-xl border border-primary-500/20 relative group hover:shadow-lg hover:shadow-primary-500/5 transition-all">
                       <p className="text-sm text-slate-300 leading-7 font-light tracking-wide font-sans">
                         {file.promptResult}
                       </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};