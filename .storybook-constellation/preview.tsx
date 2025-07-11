import { Preview } from '@storybook/react';
import { Configuration, PopoverManager, Toaster, ModalManager, WorkTheme } from '@pega/cosmos-react-core';
import setPCoreMocks from '../__mocks__/pcoreMocks';

setPCoreMocks();

const decorators = [
  (Story, context) => {
    return (
      <Configuration>
        <PopoverManager>
          <Toaster dismissAfter={5000}>
            <ModalManager>
              <Story {...context} />
            </ModalManager>
          </Toaster>
        </PopoverManager>
      </Configuration>
    );
  }
];

const parameters = {
  backgrounds: {
    default: 'App',
    values: [
      {
        name: 'App',
        value: WorkTheme.base.palette['app-background']
      },
      {
        name: 'Primary',
        value: WorkTheme.base.palette['primary-background']
      },
      {
        name: 'Secondary',
        value: WorkTheme.base.palette['secondary-background']
      }
    ]
  },
  docs: {
    source: { type: 'code' },
    codePanel: true
  }
};

const preview: Preview = {
  decorators,
  parameters
};

export default preview;
