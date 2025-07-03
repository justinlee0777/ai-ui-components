import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  css: {
    modules: {
      generateScopedName: '[local]', // disables hashing
    },
  },
});
