/**
 * Supported languages for Azure Speech to Text
 * 
 * Flores Code is a language code used by most LLMs, it is added here for reference
 * and in utility functions to allow converting codes from one type to another.
 */

export const supportedLanguages = {
  bg: {
    name: 'Bulgarian',
    floresCode: 'bul_Cyrl',
    browserCode: 'bg',
  },
  ca: {
    name: 'Catalan',
    floresCode: 'cat_Latn',
    browserCode: 'ca',
  },
  cs: {
    name: 'Czech',
    floresCode: 'ces_Latn',
    browserCode: 'cs',
  },
  de: {
    name: 'German',
    floresCode: 'deu_Latn',
    browserCode: 'de-DE',
  },
  el: {
    name: 'Greek',
    floresCode: 'ell_Grek',
    browserCode: 'el-GR',
  },
  en: {
    name: 'English',
    floresCode: 'eng_Latn',
    browserCode: 'en-US',
  },
  es: {
    name: 'Spanish',
    floresCode: 'spa_Latn',
    browserCode: 'es-ES',
  },
  fi: {
    name: 'Finnish',
    floresCode: 'fin_Latn',
    browserCode: 'fi',
  },
  fr: {
    name: 'French',
    floresCode: 'fra_Latn',
    browserCode: 'fr-FR',
  },
  hu: {
    name: 'Hungarian',
    floresCode: 'hun_Latn',
    browserCode: 'hu',
  },
  id: {
    name: 'Indonesian',
    floresCode: 'ind_Latn',
    browserCode: 'id',
  },
  it: {
    name: 'Italian',
    floresCode: 'ita_Latn',
    browserCode: 'it-IT',
  },
  ja: {
    name: 'Japanese',
    floresCode: 'jpn_Jpan',
    browserCode: 'ja',
  },
  ko: {
    name: 'Korean',
    floresCode: 'kor_Hang',
    browserCode: 'ko',
  },
  nl: {
    name: 'Dutch',
    floresCode: 'nld_Latn',
    browserCode: 'nl-NL',
  },
  pl: {
    name: 'Polish',
    floresCode: 'pol_Latn',
    browserCode: 'pl',
  },
  pt: {
    name: 'Portuguese',
    floresCode: 'por_Latn',
    browserCode: 'pt-PT',
  },
  ro: {
    name: 'Romanian',
    floresCode: 'ron_Latn',
    browserCode: 'ro-RO',
  },
  ru: {
    name: 'Russian',
    floresCode: 'rus_Cyrl',
    browserCode: 'ru',
  },
  sk: {
    name: 'Slovak',
    floresCode: 'slk_Latn',
    browserCode: 'sk',
  },
  sv: {
    name: 'Swedish',
    floresCode: 'swe_Latn',
    browserCode: 'sv-SE',
  },
  tr: {
    name: 'Turkish',
    floresCode: 'tur_Latn',
    browserCode: 'tr',
  },
  zh: {
    name: 'Chinese (Simplified)',
    floresCode: 'zho_Hans',
    browserCode: 'zh-CN',
  },
} as const;
