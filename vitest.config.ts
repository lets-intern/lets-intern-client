import { config } from 'dotenv';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    env: {
      ...config({ path: '.env' }).parsed,
      ...config({ path: '.env.local' }).parsed,
    },
    alias: {
      '@': '/src',
    },
  },
});
