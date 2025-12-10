export enum Platform {
  General = 'General',
  AdobeStock = 'AdobeStock',
  Freepik = 'Freepik',
  Shutterstock = 'Shutterstock',
  Vecteezy = 'Vecteezy',
  Depositphotos = 'Depositphotos'
}

export type AppMode = 'seo' | 'prompt';

export interface SeoConfig {
  minTitleWords: number;
  maxTitleWords: number;
  minKeywords: number;
  maxKeywords: number;
  minDescWords: number;
  maxDescWords: number;
  language: string;
  tone: string;
  apiKey?: string;
}

export interface SeoResult {
  title: string;
  description: string;
  keywords: string[];
}

export interface UploadedFile {
  id: string;
  file: File;
  previewUrl: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  result?: SeoResult;
  promptResult?: string;
  modeProcessed?: AppMode;
  errorMsg?: string;
}