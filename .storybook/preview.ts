import { provideAnimations } from "@angular/platform-browser/animations";
import { Preview, applicationConfig } from "@storybook/angular";

const preview: Preview = {
  decorators: [
    applicationConfig({
      providers: [provideAnimations()],
    }),
  ],
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      }
    },
  },
};

export default preview;
