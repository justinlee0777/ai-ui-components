declare module '*.module.css';

interface ImportMetaEnv {
  readonly OPENAI_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
