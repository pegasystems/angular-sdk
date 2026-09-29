import type { StorybookConfig } from '@storybook/angular';
import { fileURLToPath } from 'node:url';

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/app/_components/custom-sdk/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-links', '@storybook/addon-docs', '@chromatic-com/storybook', '@storybook/addon-a11y'],
  framework: {
    name: '@storybook/angular',
    options: {}
  },
  webpackFinal: async config => {
    if (config.resolve?.alias && !Array.isArray(config.resolve.alias)) {
      config.resolve.alias['@pega/auth/lib/sdk-auth-manager'] = fileURLToPath(new URL('../__mocks__/authManager.ts', import.meta.url));
    }

    return config;
  }
};
export default config;
