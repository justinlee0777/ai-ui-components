import { defineConfig } from 'vite';

export default defineConfig({
  mode: 'development',
  css: {
    modules: {
      generateScopedName: '[local]', // disables hashing
    },
  },
});
