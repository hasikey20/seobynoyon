import React from 'react';
import { SeoConfig } from '../types';
import { X, ShieldCheck, Key, AlertTriangle } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: SeoConfig;
  setConfig: React.Dispatch<React.SetStateAction<SeoConfig>>;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, config, setConfig }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex justify-center items-center p-4">
      <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-200 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/5 bg-slate-900/50">
          <h2 className="text-lg font-bold text-white tracking-tight">Global Settings</h2>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 p-1.5 rounded-lg"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          
          {/* API Key Configuration */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Key size={14} className="text-primary-500" /> API Configuration
            </label>
            
            <div className="bg-slate-950 border border-white/5 rounded-xl p-4 transition-all focus-within:border-primary-500/50">
              <div className="mb-4">
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Google AI Studio API Key</label>
                <input 
                  type="password"
                  placeholder="System Default (Secure)"
                  value={config.apiKey || ''}
                  onChange={(e) => setConfig(prev => ({...prev, apiKey: e.target.value}))}
                  className="w-full bg-slate-900 text-white text-sm border border-slate-700 rounded-lg p-2.5 focus:border-primary-500 focus:outline-none placeholder-slate-600 font-mono transition-colors"
                />
                <p className="text-[10px] text-slate-500 mt-2">
                  Optional. Only provide if you want to override the built-in system key.
                </p>
              </div>

              {config.apiKey ? (
                <div className="flex items-center gap-2 text-xs text-amber-400 bg-amber-400/10 p-2.5 rounded-lg border border-amber-400/20">
                  <AlertTriangle size={14} />
                  <span className="font-medium">Using Custom API Key</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-400/10 p-2.5 rounded-lg border border-emerald-400/20">
                  <ShieldCheck size={14} />
                  <span className="font-medium">Using System Secure Key</span>
                </div>
              )}
            </div>
          </div>

          <div className="h-px bg-white/5 w-full"></div>

          <div className="grid grid-cols-2 gap-4">
            {/* Language Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Language</label>
              <select 
                value={config.language}
                onChange={(e) => setConfig(prev => ({...prev, language: e.target.value}))}
                className="w-full bg-slate-950 text-white text-sm border border-slate-700 rounded-lg p-3 focus:border-primary-500 focus:outline-none transition-all appearance-none cursor-pointer hover:bg-slate-900"
              >
                <option value="English">English</option>
                <option value="Spanish">Spanish</option>
                <option value="French">French</option>
                <option value="German">German</option>
                <option value="Italian">Italian</option>
                <option value="Portuguese">Portuguese</option>
                <option value="Bengali">Bengali</option>
                <option value="Hindi">Hindi</option>
              </select>
            </div>

            {/* Tone Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Tone</label>
              <select 
                value={config.tone}
                onChange={(e) => setConfig(prev => ({...prev, tone: e.target.value}))}
                className="w-full bg-slate-950 text-white text-sm border border-slate-700 rounded-lg p-3 focus:border-primary-500 focus:outline-none transition-all appearance-none cursor-pointer hover:bg-slate-900"
              >
                <option value="Standard">Standard</option>
                <option value="Professional">Professional</option>
                <option value="Creative">Creative</option>
                <option value="Punchy">Punchy</option>
                <option value="Descriptive">Descriptive</option>
              </select>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/5 bg-slate-900/50 flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2.5 bg-primary-600 hover:bg-primary-500 text-white text-sm font-semibold rounded-lg transition-colors shadow-lg shadow-primary-500/20"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};