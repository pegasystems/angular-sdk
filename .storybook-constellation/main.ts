import { fileURLToPath } from 'node:url';
import type { StorybookConfig } from '@storybook/react-webpack5';
import type { Configuration } from 'webpack';

const config: StorybookConfig = {
  stories: ['../src/app/_components//custom-constellation/**/*.stories.@(js|jsx|ts|tsx)'],

  typescript: {
    reactDocgen: 'react-docgen-typescript'
  },

  addons: [
    '@storybook/addon-links',
    {
      name: '@storybook/addon-docs',
      options: { mdxBabelOptions: { babelrc: true, configFile: true } }
    }
  ],
  framework: '@storybook/react-webpack5',

  webpackFinal: async (config: Configuration) => {
    if (config.resolve?.alias && !Array.isArray(config.resolve.alias)) {
      config.resolve.alias['@pega/auth/lib/sdk-auth-manager'] = fileURLToPath(new URL('../__mocks__/authManager.tsx', import.meta.url));
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
          use: {
            loader: 'ts-loader',
            // dev-mode watch program produces false-positive errors not reproduced by `tsc`/`storybook build`; type-checking is covered by those and the editor
            options: { transpileOnly: true }
          },
          exclude: /node_modules/
        }
      );
    }

    return config;
  }
};

export default config;
