/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SILICONFLOW_API_TOKEN: string;
  readonly VITE_SILICONFLOW_API_URL: string;
  readonly VITE_DEFAULT_MODEL: string;
  readonly VITE_APP_NAME: string;
  readonly VITE_APP_VERSION: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
} 