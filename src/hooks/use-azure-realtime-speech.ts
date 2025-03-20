import * as sdk from 'microsoft-cognitiveservices-speech-sdk';
import { useCallback, useRef } from 'react';
import type { AzureCredentials, LanguageBrowserCode } from '@/types';

interface RealtimeTranscriptionProps extends AzureCredentials {
  srcLanguage: LanguageBrowserCode;
  onInterimTranscript: (
    transcript: sdk.ConversationTranscriptionResult,
  ) => void;
  onFinalTranscript: (transcript: sdk.ConversationTranscriptionResult) => void;
}

interface RealtimeTranslationProps extends AzureCredentials {
  srcLanguage: LanguageBrowserCode;
  tgtLanguages: LanguageBrowserCode[];
}

export const useAzureRealtimeTranscription = ({
  srcLanguage = 'en-US', // Default Source language is English
  azureToken,
  azureRegion,
  onFinalTranscript,
  onInterimTranscript,
}: RealtimeTranscriptionProps) => {
  // Create a reference to the conversation transcriber
  const conversationTranscriberRef = useRef<sdk.ConversationTranscriber | null>(
    null,
  );
  // Function to start real-time transcription
  const startTranscription = useCallback(() => {
    // Get Azure Config
    if (!azureToken || !azureRegion) {
      throw new Error('Valid credentials for Azure speech to text not found.');
    }
    // Use browser's microphone as audio input
    const audioConfig = sdk.AudioConfig.fromDefaultMicrophoneInput();
    // Create speech config from Azure authorization token and region
    const speechConfig = sdk.SpeechConfig.fromAuthorizationToken(
      azureToken,
      azureRegion,
    );
    // Set the source language if provided
    if (srcLanguage) {
      speechConfig.speechRecognitionLanguage = srcLanguage;
    }

    // A valid audio and speech config is required
    if (!speechConfig || !audioConfig) {
      throw new Error('Azure setup error. No speech or audio configuration');
    }
    // Initialize conversation transcriber
    const conversationTranscriber = new sdk.ConversationTranscriber(
      speechConfig,
      audioConfig,
    );
    // Handle interim transcription
    // On this event, we get the text as it is being recognized
    // no punctuation and speaker identification yet
    conversationTranscriber.transcribing = (_, e) => {
      onInterimTranscript(e.result);
    };
    // Handle finalized transcription with speaker diarization and punctuation
    conversationTranscriber.transcribed = (_, e) => {
      onFinalTranscript(e.result);
    };

    // Start transcription with Diarization
    conversationTranscriber.startTranscribingAsync(
      () => console.info('Transcription started.'),
      (err) => console.error('Error starting transcription:', err),
    );
    // Store a reference to the conversation transcriber
    conversationTranscriberRef.current = conversationTranscriber;
  }, [
    azureToken,
    azureRegion,
    srcLanguage,
    onFinalTranscript,
    onInterimTranscript,
  ]);

  const stopTranscription = () => {
    conversationTranscriberRef.current?.stopTranscribingAsync(() => {
      conversationTranscriberRef.current?.close();
      conversationTranscriberRef.current = null;
    });
  };

  return {
    stopTranscription,
    startTranscription,
  };
};

export const useAzureRealtimeTranslation = ({
  azureToken,
  azureRegion,
  srcLanguage = 'en-US', // Default Source language is English
  tgtLanguages = ['es-ES'], // Default Target language is Spanish
}: RealtimeTranslationProps) => {
  // Save a ref to the translation recognizer
  const translationRecognizerRef = useRef<sdk.TranslationRecognizer | null>(
    null,
  );

  const startTranslation = useCallback(() => {
    // Check Azure Config
    if (!azureToken || !azureRegion) {
      throw new Error('Valid credentials for Azure speech to text not found.');
    }
    // Use browser's microphone as audio input
    const audioConfig = sdk.AudioConfig.fromDefaultMicrophoneInput();
    const speechConfig = sdk.SpeechTranslationConfig.fromAuthorizationToken(
      azureToken,
      azureRegion,
    );
    // Set the source language
    if (srcLanguage) {
      speechConfig.speechRecognitionLanguage = srcLanguage;
    }

    // A valid audio and speech config is required
    if (!speechConfig || !audioConfig) {
      throw new Error('Azure setup error. No speech or audio configuration');
    }

    const translationRecognizer = new sdk.TranslationRecognizer(
      speechConfig,
      audioConfig,
    );

    translationRecognizer.recognizeOnceAsync(
      (result) => {
        if (result.reason === sdk.ResultReason.TranslatedSpeech) {
          for (const key of tgtLanguages) {
            const translation = result.translations.get(key);
            console.log(`${key}: ${translation}`);
          }
        }

        translationRecognizerRef.current?.close();
        translationRecognizerRef.current = null;
      },
      (err) => {
        console.error('Error translating:', err);
        translationRecognizerRef.current?.close();
        translationRecognizerRef.current = null;
      },
    );

    translationRecognizerRef.current = translationRecognizer;
  }, [azureToken, azureRegion, srcLanguage, tgtLanguages]);

  const stopTranslation = () => {
    translationRecognizerRef.current?.stopContinuousRecognitionAsync(() => {
      translationRecognizerRef.current?.close();
      translationRecognizerRef.current = null;
    });
  };

  return {
    stopTranslation,
    startTranslation,
  };
};
