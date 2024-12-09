import type { StorybookConfig } from '@storybook/angular';
import path from 'path';

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/app/_components/custom-sdk/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials', '@storybook/addon-interactions'],
  framework: {
    name: '@storybook/angular',
    options: {}
  },
  features: {
    storyStoreV7: false
  },
  docs: {
    autodocs: 'tag'
  },
  webpackFinal: async config => {
    if (config.resolve?.alias) {
      config.resolve.alias['@pega/auth/lib/sdk-auth-manager'] = path.resolve(__dirname, '../__mocks__/authManager.tsx');
    }

    return config;
  }
};
export default config;
