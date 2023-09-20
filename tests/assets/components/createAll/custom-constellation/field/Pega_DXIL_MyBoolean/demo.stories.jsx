import { useState } from 'react';
import { withKnobs } from '@storybook/addon-knobs';

import { configProps, stateProps } from './mock.stories';

import PegaDxilMyBoolean from './index';

export default {
  title: 'PegaDxilMyBoolean',
  decorators: [withKnobs],
  component: PegaDxilMyBoolean
};

export const basePegaDxilMyBoolean = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [value, setValue] = useState(configProps.value);

  const props = {
    value,
    label: configProps.label,
    helperText: configProps.helperText,
    caption: configProps.caption,
    validatemessage: configProps.validatemessage,
    hideLabel: configProps.hideLabel,
    testId: configProps.testId,
    additionalProps: configProps.additionalProps,
    displayMode: configProps.displayMode,
    variant: configProps.variant,
    trueLabel: configProps.trueLabel,
    falseLabel: configProps.falseLabel,
    disabled: configProps.disabled,
    readOnly: configProps.readOnly,
    required: configProps.required,
    getPConnect: () => {
      return {
        getStateProps: () => {
          return stateProps;
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
