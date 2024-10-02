import type { Meta, StoryObj } from '@storybook/angular';
import { FormBuilder } from '@angular/forms';

import { configProps, stateProps } from './mock';

import { YourOrgYourComponentLibMyTextComponent } from './your-org-your-component-lib-my-text.component';

const meta: Meta<YourOrgYourComponentLibMyTextComponent> = {
  title: 'YourOrgYourComponentLibMyText',
  component: YourOrgYourComponentLibMyTextComponent,
  excludeStories: /.*Data$/,
  render: (args: YourOrgYourComponentLibMyTextComponent) => ({
    props: {
      ...args,
      pConn$: {
        resolveConfigProps: props => props,
        getConfigProps: () => {
          return configProps;
        },
        getStateProps: () => {
          return stateProps;
        }
      } as any,
      formGroup$: new FormBuilder().group({})
    }
  })
};

export default meta;
type Story = StoryObj<YourOrgYourComponentLibMyTextComponent>;

export const YourOrgYourComponentLibMyText: Story = {
  args: {
    label$: configProps.label,
    helperText: configProps.helperText,
    testId: configProps.testId,
    placeholder: configProps.placeholder,
    bReadonly$: configProps.readOnly,
    bDisabled$: configProps.disabled,
    bRequired$: configProps.required,
    bHideLabel$: configProps.hideLabel
  }
};
