import React from 'react';
import { SeoConfig, AppMode } from '../types';
import { Settings, Image as ImageIcon, FileText, Sparkles, Command } from 'lucide-react';

interface SidebarProps {
  config: SeoConfig;
  setConfig: React.Dispatch<React.SetStateAction<SeoConfig>>;
  onOpenSettings: () => void;
  mode: AppMode;
  setMode: (mode: AppMode) => void;
}

const SliderControl: React.FC<{
  label: string;
  minVal: number;
  maxVal: number;
  minLimit: number;
  maxLimit: number;
  onChangeMin: (val: number) => void;
  onChangeMax: (val: number) => void;
}> = ({ label, minVal, maxVal, minLimit, maxLimit, onChangeMin, onChangeMax }) => {
  return (
    <div className="mb-6 group">
      <div className="flex justify-between text-xs text-slate-400 mb-2 group-hover:text-slate-300 transition-colors">
        <span className="font-medium">{label}</span>
        <span className="font-mono text-primary-400">{minVal} - {maxVal}</span>
      </div>
      <div className="space-y-3">
        <div className="relative">
          <input
            type="range"
            min={minLimit}
            max={maxLimit}
            value={minVal}
            onChange={(e) => {
              const val = parseInt(e.target.value);
              if (val <= maxVal) onChangeMin(val);
            }}
            className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary-500 hover:accent-primary-400 transition-all"
          />
        </div>
        <div className="relative">
          <input
            type="range"
            min={minLimit}
            max={maxLimit}
            value={maxVal}
            onChange={(e) => {
              const val = parseInt(e.target.value);
              if (val >= minVal) onChangeMax(val);
            }}
            className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary-500 hover:accent-primary-400 transition-all"
          />
        </div>
      </div>
    </div>
  );
};

export const Sidebar: React.FC<SidebarProps> = ({ config, setConfig, onOpenSettings, mode, setMode }) => {
  return (
    <div className="w-80 h-full bg-slate-900/50 border-r border-white/5 backdrop-blur-xl flex flex-col shadow-2xl z-20">
      {/* Brand Header */}
      <div className="p-6 border-b border-white/5 flex items-center gap-3">
        <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary-500/20">
          <Command size={18} strokeWidth={3} />
        </div>
        <div>
          <h1 className="text-lg font-bold text-white tracking-tight leading-none">Gemini<span className="text-primary-400">Pro</span></h1>
          <p className="text-[10px] text-slate-400 font-medium tracking-wide mt-1">AI IMAGE TOOLKIT</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="p-4 flex flex-col gap-2">
        <button 
          onClick={() => setMode('seo')}
          className={`w-full py-3 px-4 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-3 border ${
            mode === 'seo' 
            ? 'bg-primary-500/10 text-primary-400 border-primary-500/20 shadow-inner' 
            : 'bg-transparent text-slate-400 border-transparent hover:bg-white/5 hover:text-slate-200'
          }`}
        >
          <FileText size={18} className={mode === 'seo' ? 'text-primary-400' : 'text-slate-500'} /> 
          <span>SEO Metadata</span>
          {mode === 'seo' && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-400 shadow-[0_0_8px_rgba(99,102,241,0.8)]"></div>}
        </button>
        
        <button 
          onClick={() => setMode('prompt')}
          className={`w-full py-3 px-4 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-3 border ${
            mode === 'prompt' 
            ? 'bg-primary-500/10 text-primary-400 border-primary-500/20 shadow-inner' 
            : 'bg-transparent text-slate-400 border-transparent hover:bg-white/5 hover:text-slate-200'
          }`}
        >
          <ImageIcon size={18} className={mode === 'prompt' ? 'text-primary-400' : 'text-slate-500'} /> 
          <span>Image to Prompt</span>
          {mode === 'prompt' && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-400 shadow-[0_0_8px_rgba(99,102,241,0.8)]"></div>}
        </button>
      </div>

      {/* Settings Area */}
      <div className="flex-1 overflow-y-auto px-6 py-2 custom-scrollbar">
        <div className="mb-6 flex items-center gap-2">
           <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Configuration</span>
           <div className="h-px bg-white/5 flex-1"></div>
        </div>

        {mode === 'seo' ? (
          <div className="animate-fade-in space-y-2">
            <SliderControl
              label="Title Length"
              minVal={config.minTitleWords}
              maxVal={config.maxTitleWords}
              minLimit={1}
              maxLimit={50}
              onChangeMin={(v) => setConfig(prev => ({ ...prev, minTitleWords: v }))}
              onChangeMax={(v) => setConfig(prev => ({ ...prev, maxTitleWords: v }))}
            />

            <SliderControl
              label="Keywords Limit"
              minVal={config.minKeywords}
              maxVal={config.maxKeywords}
              minLimit={5}
              maxLimit={100}
              onChangeMin={(v) => setConfig(prev => ({ ...prev, minKeywords: v }))}
              onChangeMax={(v) => setConfig(prev => ({ ...prev, maxKeywords: v }))}
            />

            <SliderControl
              label="Description Words"
              minVal={config.minDescWords}
              maxVal={config.maxDescWords}
              minLimit={10}
              maxLimit={200}
              onChangeMin={(v) => setConfig(prev => ({ ...prev, minDescWords: v }))}
              onChangeMax={(v) => setConfig(prev => ({ ...prev, maxDescWords: v }))}
            />
          </div>
        ) : (
          <div className="bg-gradient-to-b from-slate-800/50 to-slate-900/50 rounded-xl p-5 border border-white/5 animate-fade-in">
            <div className="flex items-center gap-3 mb-4 text-primary-400">
               <div className="p-2 bg-primary-500/10 rounded-lg">
                <Sparkles size={18} />
               </div>
               <span className="text-sm font-bold text-white">Vision Mode</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Gemini Vision analyzes visual structure, lighting, and style to reverse-engineer prompts.
            </p>
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 text-[10px] text-slate-500 bg-black/20 p-2 rounded">
                 <div className="w-1 h-1 bg-primary-500 rounded-full"></div> Perfect for Midjourney v6
              </div>
              <div className="flex items-center gap-2 text-[10px] text-slate-500 bg-black/20 p-2 rounded">
                 <div className="w-1 h-1 bg-primary-500 rounded-full"></div> Compatible with DALL-E 3
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-white/5 bg-slate-900/30">
         <button 
           onClick={onOpenSettings}
           className="group w-full flex items-center justify-between text-slate-400 hover:text-white transition-all duration-200 text-sm py-3 px-4 hover:bg-white/5 rounded-xl border border-transparent hover:border-white/5"
         >
            <span className="flex items-center gap-3">
              <Settings size={18} className="group-hover:rotate-45 transition-transform duration-300" /> 
              Settings
            </span>
            <span className="text-[10px] font-mono text-slate-600 group-hover:text-slate-500">v1.3</span>
         </button>
      </div>
    </div>
  );
};