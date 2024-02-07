import { provideAnimations } from '@angular/platform-browser/animations';
import { AngularPConnectService, getSdkComponentMap } from '@pega/angular-sdk-library';
import { Preview, applicationConfig } from '@storybook/angular';

getSdkComponentMap();

class MockingAngularPConnectService {
  shouldComponentUpdate = () => true;
  registerAndSubscribeComponent = () => {
    return {
      unsubscribeFn: () => {
        /* nothing */
      },
      actions: {
        onChange: () => {
          /* nothing */
        },
        onBlur: () => {
          /* nothing */
        }
      }
    };
  };
  getComponentID = () => {
    return Math.random();
  };
}

const preview: Preview = {
  decorators: [
    applicationConfig({
      providers: [provideAnimations(), { provide: AngularPConnectService, useClass: MockingAngularPConnectService }]
    })
  ],
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/
      }
    }
  }
};

export default preview;
