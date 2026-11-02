import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    projects: [
      {
        extends: './frontend/vite.config.js',
        root: './frontend',
        test: {
          name: 'frontend',
          clearMocks: true,
        },
      },
      {
        test: {
          name: 'backend-shared',
          include: ['backend/**/*.test.js', 'shared/**/*.test.js'],
          environment: 'node',
          clearMocks: true,
        },
      },
    ],
  },
});
