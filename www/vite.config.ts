import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3000,
  },
  base: '/',
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
    css: true,
    reporters: ['verbose', 'vitest-sonar-reporter'],
    outputFile: { 'vitest-sonar-reporter': 'coverage/sonar-report.xml' },
    threads: false,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      include: ['src/**/*'],
      exclude: ['src/test/**/*'],
    },
  },
});
