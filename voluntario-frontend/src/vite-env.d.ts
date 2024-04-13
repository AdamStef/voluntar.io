/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PORT: number;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// interface UserConfig {
//     readonly VITE_PORT: number
// }
declare module 'tailwind-config' {
  const config: Config;
  export default config;
}
