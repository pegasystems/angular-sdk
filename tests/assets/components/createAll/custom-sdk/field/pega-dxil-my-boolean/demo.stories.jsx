import { useState } from 'react';
import { withKnobs } from '@storybook/addon-knobs';

import { configProps, stateProps } from './mock.stories';

import PegaDxilMyBoolean from './index.tsx';

export default {
  title: 'PegaDxilMyBoolean',
  decorators: [withKnobs],
  component: PegaDxilMyBoolean
};

export const BasePegaDxilMyBoolean = () => {
  const [value, setValue] = useState(configProps.value);

  const props = {
    value,
    label: configProps.label,
    helperText: configProps.helperText,
    caption: configProps.caption,
    testId: configProps.testId,
    trueLabel: configProps.trueLabel,
    falseLabel: configProps.falseLabel,

    getPConnect: () => {
      return {
        getStateProps: () => {
          return stateProps;
        },
        getConfigProps: () => {
          return configProps;
        },
        getActionsApi: () => {
          return {
            updateFieldValue: (propName, theValue) => {
              setValue(theValue);
            },
            triggerFieldChange: () => { /* nothing */}
          };
        },
        getValidationApi: () => {
          return {
            validate: () => { /* nothing */}
          };
        }
      };
    }
  };

  return (
    <>
      <PegaDxilMyBoolean {...props} />
    </>
  );
};
