import { useState } from 'react';
import { withKnobs } from '@storybook/addon-knobs';

import { stateProps, configProps } from './mock.stories';

import PegaDxilMyTestText from './index.jsx';

export default {
  title: 'PegaDxilMyTestText',
  decorators: [withKnobs],
  component: PegaDxilMyTestText
};

export const basePegaDxilMyTestText = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [value, setValue] = useState(configProps.value);

  const props = {
    value,
    placeholder: configProps.placeholder,
    label: configProps.label,
    testId: configProps.testId,
    hasSuggestions: configProps.hasSuggestions,

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
            triggerFieldChange: () => {/* nothing */}
          };
        },
        ignoreSuggestion: () => {/* nothing */},
        acceptSuggestion: () => {/* nothing */},
        setInheritedProps: () => {/* nothing */},
        resolveConfigProps: () => {/* nothing */}
      };
    }
  };

  return (
    <>
      <PegaDxilMyTestText {...props} />
    </>
  );
};
