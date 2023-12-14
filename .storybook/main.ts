import type { StorybookConfig } from "@storybook/angular";
const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/app/_components/custom-sdk/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions"
  ],
  framework: {
    name: "@storybook/angular",
    options: {}
  },
  features: {
    storyStoreV7: false
  },
  docs: {
    autodocs: "tag"
  }
};
export default config;
