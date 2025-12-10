import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { ResultsView } from './components/ResultsView';
import { SettingsModal } from './components/SettingsModal';
import { Platform, SeoConfig, UploadedFile, AppMode } from './types';
import { generateSeoData, generateImagePrompt } from './services/geminiService';
import { UploadCloud, Download, Trash2, Play, LayoutGrid, Image as ImageIcon, Zap } from 'lucide-react';

const INITIAL_CONFIG: SeoConfig = {
  minTitleWords: 5,
  maxTitleWords: 15,
  minKeywords: 20,
  maxKeywords: 50,
  minDescWords: 15,
  maxDescWords: 50,
  language: 'English',
  tone: 'Professional'
};

const PLATFORMS = [
  { id: Platform.General, label: 'General', icon: LayoutGrid },
  { id: Platform.AdobeStock, label: 'AdobeStock', icon: ImageIcon },
  { id: Platform.Shutterstock, label: 'Shutterstock', icon: ImageIcon },
  { id: Platform.Freepik, label: 'Freepik', icon: ImageIcon },
  { id: Platform.Vecteezy, label: 'Vecteezy', icon: ImageIcon },
];

const STORAGE_KEY = 'gemini-seo-pro-config-v1';

function App() {
  // Load config from localStorage or use initial default
  const [config, setConfig] = useState<SeoConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : INITIAL_CONFIG;
    } catch (e) {
      return INITIAL_CONFIG;
    }
  });

  const [mode, setMode] = useState<AppMode>('seo');
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>(Platform.General);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isProcessingAll, setIsProcessingAll] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Persist config changes to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  }, [config]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles: UploadedFile[] = (Array.from(e.target.files) as File[]).map(file => ({
        id: Math.random().toString(36).substr(2, 9),
        file,
        previewUrl: URL.createObjectURL(file),
        status: 'pending'
      }));
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const processFile = async (fileId: string) => {
    setFiles(prev => prev.map(f => f.id === fileId ? { ...f, status: 'processing', modeProcessed: mode } : f));
    
    const fileObj = files.find(f => f.id === fileId);
    if (!fileObj) return;

    try {
      if (mode === 'seo') {
        const result = await generateSeoData(fileObj.file, selectedPlatform, config);
        setFiles(prev => prev.map(f => f.id === fileId ? { ...f, status: 'completed', result, modeProcessed: 'seo' } : f));
      } else {
        const promptResult = await generateImagePrompt(fileObj.file, config);
        setFiles(prev => prev.map(f => f.id === fileId ? { ...f, status: 'completed', promptResult, modeProcessed: 'prompt' } : f));
      }
    } catch (error) {
       setFiles(prev => prev.map(f => f.id === fileId ? { 
         ...f, 
         status: 'error', 
         errorMsg: error instanceof Error ? error.message : "Unknown error" 
       } : f));
    }
  };

  const processAll = async () => {
    setIsProcessingAll(true);
    const pendingFiles = files.filter(f => f.status === 'pending');
    
    await Promise.all(pendingFiles.map(f => processFile(f.id)));
    
    setIsProcessingAll(false);
  };

  const downloadCSV = () => {
    const completedSeoFiles = files.filter(f => f.status === 'completed' && f.result && f.modeProcessed === 'seo');
    
    if (completedSeoFiles.length > 0) {
      const headers = ['Filename', 'Title', 'Description', 'Keywords'];
      const rows = completedSeoFiles.map(f => [
        f.file.name,
        `"${f.result!.title.replace(/"/g, '""')}"`,
        `"${f.result!.description.replace(/"/g, '""')}"`,
        `"${f.result!.keywords.join(', ')}"`
      ]);
      const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
      triggerDownload(csvContent, 'seo_metadata.csv');
    } 
    
    const completedPromptFiles = files.filter(f => f.status === 'completed' && f.promptResult && f.modeProcessed === 'prompt');
    if (completedPromptFiles.length > 0) {
       const headers = ['Filename', 'Prompt'];
       const rows = completedPromptFiles.map(f => [
         f.file.name,
         `"${f.promptResult!.replace(/"/g, '""')}"`
       ]);
       const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
       triggerDownload(csvContent, 'image_prompts.csv');
    }
  };

  const triggerDownload = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex h-screen w-full bg-slate-950 text-slate-200 font-sans selection:bg-primary-500/30 selection:text-white overflow-hidden">
      {/* Dynamic Background Mesh */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[40%] h-[40%] bg-primary-900/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[30%] h-[30%] bg-blue-900/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="z-10 h-full flex w-full">
        <Sidebar 
          config={config} 
          setConfig={setConfig} 
          onOpenSettings={() => setIsSettingsOpen(true)}
          mode={mode}
          setMode={setMode}
        />

        <SettingsModal 
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          config={config}
          setConfig={setConfig}
        />

        <main className="flex-1 flex flex-col h-full relative">
          {/* Header / Platform Selector */}
          {mode === 'seo' ? (
            <div className="p-6 pb-4 border-b border-white/5 bg-slate-900/30 backdrop-blur-sm z-20 flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary-500"></div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Target Platform</span>
              </div>
              <div className="flex flex-wrap gap-3">
                {PLATFORMS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPlatform(p.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold border transition-all duration-300 ${
                      selectedPlatform === p.id
                        ? 'bg-primary-600 border-primary-500 text-white shadow-lg shadow-primary-900/50'
                        : 'bg-slate-800/50 border-white/5 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                    }`}
                  >
                    {p.id === Platform.General ? <LayoutGrid size={14} /> : <ImageIcon size={14} />}
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-6 pb-6 border-b border-white/5 bg-slate-900/30 backdrop-blur-sm z-20 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-primary-500/20 to-primary-600/10 text-primary-400 rounded-xl border border-primary-500/20 shadow-lg shadow-primary-900/20">
                  <ImageIcon size={24} />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-white tracking-tight">Image to Prompt</h2>
                    <p className="text-xs text-slate-400 mt-1 font-medium">Reverse engineer images into high-fidelity AI prompts</p>
                </div>
              </div>
            </div>
          )}

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-6 relative custom-scrollbar">
            
            {files.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center m-4 animate-fade-in">
                <div className="relative group cursor-pointer" onClick={() => document.getElementById('file-upload')?.click()}>
                  <div className="absolute inset-0 bg-primary-500/20 rounded-3xl blur-2xl group-hover:bg-primary-500/30 transition-all duration-500"></div>
                  <div className="relative bg-slate-900/80 backdrop-blur-xl border border-white/10 p-12 rounded-3xl flex flex-col items-center text-center max-w-lg shadow-2xl hover:border-primary-500/30 transition-all">
                    <div className="w-20 h-20 bg-slate-800 rounded-2xl flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 transition-transform duration-300">
                      <UploadCloud size={40} className="text-primary-400" />
                    </div>
                    <h2 className="text-3xl font-bold mb-3 text-white tracking-tight">Upload Images</h2>
                    <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                      Drag & drop or select high-resolution images.<br/>
                      <span className="text-slate-500 text-xs mt-2 block">Supports JPG, PNG, WEBP, SVG</span>
                    </p>
                    
                    <label className="cursor-pointer relative z-10">
                        <div className="bg-primary-600 hover:bg-primary-500 text-white px-8 py-3.5 rounded-xl font-bold shadow-lg shadow-primary-900/50 transition-all transform group-hover:translate-y-[-2px] flex items-center gap-3">
                          <UploadCloud size={20} />
                          Browse Files
                        </div>
                        <input id="file-upload" type="file" multiple accept="image/*" onChange={handleFileUpload} className="hidden" />
                    </label>
                  </div>
                </div>
              </div>
            ) : (
              <ResultsView files={files} onRemove={removeFile} />
            )}
          </div>

          {/* Footer Actions */}
          {files.length > 0 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-4xl bg-slate-900/90 backdrop-blur-xl border border-white/10 p-3 rounded-2xl flex items-center justify-between z-30 shadow-2xl animate-fade-in">
              <div className="flex items-center gap-4 px-4">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Queue</span>
                  <span className="text-sm text-white font-bold font-mono">
                    {files.length} <span className="text-slate-500 font-normal">items</span>
                  </span>
                </div>
                <div className="h-8 w-px bg-white/10 mx-2"></div>
                <button 
                  onClick={() => setFiles([])} 
                  className="text-red-400 hover:text-red-300 text-xs font-medium flex items-center gap-1.5 hover:bg-red-500/10 px-3 py-1.5 rounded-lg transition-colors"
                >
                  <Trash2 size={14} /> Clear
                </button>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={downloadCSV}
                  disabled={files.filter(f => f.status === 'completed').length === 0}
                  className="px-5 py-2.5 bg-slate-800 text-slate-200 rounded-xl text-sm font-semibold hover:bg-slate-700 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all border border-white/5"
                >
                  <Download size={16} /> Export CSV
                </button>
                <button
                  onClick={processAll}
                  disabled={isProcessingAll || files.every(f => f.status === 'completed')}
                  className="px-6 py-2.5 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white rounded-xl text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2.5 shadow-lg shadow-primary-900/30 transition-all hover:scale-[1.02]"
                >
                  {isProcessingAll ? <Loader2 className="animate-spin" size={18} /> : <Zap size={18} fill="currentColor" />}
                  {isProcessingAll ? 'Processing...' : 'Start Analysis'}
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

// Simple loader icon component for inline use if needed
const Loader2 = ({ className, size }: { className?: string, size?: number }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size || 24} 
    height={size || 24} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);

export default App;