import type { supportedLanguages } from '@/languages';

export interface AzureCredentials {
  azureRegion?: string;
  azureToken?: string;
}

export type LanguageIsoCode = keyof typeof supportedLanguages;

export type LanguageFloresCode =
  (typeof supportedLanguages)[keyof typeof supportedLanguages]['floresCode'];

export type LanguageBrowserCode =
  (typeof supportedLanguages)[keyof typeof supportedLanguages]['browserCode'];