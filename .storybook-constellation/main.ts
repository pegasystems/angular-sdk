import path from 'path';

/** @type { import('@storybook/react-webpack5').StorybookConfig } */
const config = {
  stories: ['../src/app/_components//custom-constellation/**/*.stories.@(js|jsx|ts|tsx)'],

  typescript: {
    reactDocgen: 'react-docgen-typescript'
  },

  addons: ['@storybook/addon-links', '@storybook/addon-essentials', '@storybook/addon-interactions', '@chromatic-com/storybook'],
  framework: '@storybook/react-webpack5',

  webpackFinal: async config => {
    if (config.resolve?.alias) {
      config.resolve.alias['@pega/auth/lib/sdk-auth-manager'] = path.resolve(__dirname, '../__mocks__/authManager.tsx');
    }

    if (config.module) {
      config.module.rules?.push(
        {
          test: /\.(d.ts)$/,
          loader: 'null-loader'
        },
        {
          test: /\.(map)$/,
          loader: 'null-loader'
        },
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/
        }
      );
    }

    return config;
  }
};

export default config;
