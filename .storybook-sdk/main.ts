import type { StorybookConfig } from '@storybook/angular';
import path from 'path';

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/app/_components/custom-sdk/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@chromatic-com/storybook',
    '@storybook/addon-a11y'
  ],
  framework: {
    name: '@storybook/angular',
    options: {}
  },
  docs: {
    autodocs: 'tag'
  },
  webpackFinal: async config => {
    if (config.resolve?.alias) {
      config.resolve.alias['@pega/auth/lib/sdk-auth-manager'] = path.resolve(__dirname, '../__mocks__/authManager.ts');
    }

    // App is zoneless; @storybook/angular injects zone.js unless experimentalZoneless is set (unsupported on Angular 21)
    if (Array.isArray(config.entry)) {
      config.entry = config.entry.filter(entry => entry !== 'zone.js');
    }

    return config;
  }
};
export default config;
