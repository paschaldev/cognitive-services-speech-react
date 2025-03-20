# Simple Microsoft Cognitive Speech Service with React

This React library provides hooks for real-time speech transcription and translation using Azure Cognitive Services. It follows security best practices by keeping Azure credentials on the server side.

## Setup

1. Create an Azure Cognitive Services resource and note your:
   - Subscription Key
   - Region

2. Set up your server environment with the following variables:
   ```
   AZURE_SUBSCRIPTION_KEY=your_subscription_key
   AZURE_REGION=your_region
   ```

3. Create a server endpoint to securely exchange the subscription key for a token. Here's an example implementation:

```typescript
export const getAzureConfig = async () => {
  const TOKEN_URL = `https://${env.AZURE_REGION}.api.cognitive.microsoft.com/sts/v1.0/issueToken`;
  if (!env.AZURE_REGION || !env.AZURE_SUBSCRIPTION_KEY) {
    throw new ConvexError('Azure Config Error: Missing Azure Region or Subscription Key in environment variable');
  }
  // Azure tokens are valid for 10 minutes. Once the first token issued expires,
  // calling the Azure endpoint returns the same expired token even with the
  // cache settings. To burst the cache completely, we use the current time of
  // request. This returns a new token for every call to Azure API
  const burst = new Date(Date.now()).getTime();
  const request = await axios({
    method: 'POST',
    responseType: 'text',
    url: `${TOKEN_URL}?cache=${burst}`,
    headers: {
      'Ocp-Apim-Subscription-Key': env.AZURE_SUBSCRIPTION_KEY,
      'Content-Type': 'application/x-www-form-urlencoded',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      Pragma: 'no-cache',
    },
  });
  const token = request.data;

  if (token) {
    return {
      azureRegion: env.AZURE_REGION,
      azureToken: token,
    };
  }
  throw new ConvexError('Azure Config Error: Azure token is empty');
};
```

⚠️ **Security Note**: Never expose your Azure Subscription Key in the client-side code. Always use a server endpoint to exchange the subscription key for a temporary token.

## Prerequisites

This library uses the default microphone input as the audio source. Before using the transcription hook, you must request microphone permissions from the browser:

```typescript
const requestMicrophoneAccess = async () => {
  try {
    await navigator.mediaDevices.getUserMedia({
      audio: {
        noiseSuppression: true,
        echoCancellation: true,
      },
    });
    // Microphone access granted
  } catch (error) {
    // Handle microphone access denied
    console.error('Microphone access denied:', error);
  }
};
```

⚠️ **Important**: Only initialize the transcription hook after successfully getting microphone permissions.

## Usage Example

Here's how to use the real-time transcription hook in your React application:

```typescript
import { useAzureRealtimeTranscription } from '@paschaldev/cognitive-services-speech-react';
import { useState, useCallback } from 'react';

const MyTranscriptionComponent = () => {
  const [hasMicAccess, setHasMicAccess] = useState(false);
  const [error, setError] = useState('');

  // Fetch token from your server. Replace with your own implementation
  const { azureToken, azureRegion } = useYourTokenFetchHook();

  const requestMicAccess = useCallback(async () => {
    try {
      await navigator.mediaDevices.getUserMedia({
        audio: {
          noiseSuppression: true,
          echoCancellation: true,
        },
      });
      setHasMicAccess(true);
      setError('');
    } catch (err) {
      setError('Microphone access denied. Please grant microphone permissions.');
      console.error('Microphone access error:', err);
    }
  }, []);

  // Only initialize the hook after getting microphone permissions
  const transcription = useAzureRealtimeTranscription({
    azureToken,
    azureRegion,
    srcLanguage: 'en-US'
  });

  return (
    <div>
      {!hasMicAccess ? (
        <>
          <button onClick={requestMicAccess}>
            Grant Microphone Access
          </button>
          {error && <div style={{ color: 'red' }}>{error}</div>}
        </>
      ) : (
        <>
          <button onClick={transcription?.startTranscription}>
            Start Transcription
          </button>
          <button onClick={transcription?.stopTranscription}>
            Stop Transcription
          </button>
          <div>Transcript: {transcription?.transcript || ''}</div>
        </>
      )}
    </div>
  );
};
```
