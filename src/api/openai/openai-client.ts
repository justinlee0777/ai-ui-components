import { ClientOptions, OpenAI } from 'openai';

export default function getOpenAIApi() {
  const configuration: ClientOptions = {
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
    maxRetries: 0,
  };

  return new OpenAI(configuration);
}
