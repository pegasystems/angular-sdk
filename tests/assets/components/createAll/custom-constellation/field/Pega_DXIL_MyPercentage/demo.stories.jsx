import { withKnobs } from '@storybook/addon-knobs';

import { configProps, stateProps, fieldMetadata } from './mock.stories.js';

import PegaDxilMyPercentage from './index.jsx';

export default {
  title: 'PegaDxilMyPercentage',
  decorators: [withKnobs],
  component: PegaDxilMyPercentage
};

export const basePegaDxilMyPercentage = () => {

  const props = {
    value: configProps.value,
    placeholder: configProps.placeholder,
    label: configProps.label,
    helperText: configProps.helperText,
    showGroupSeparators: configProps.showGroupSeparators,
    hasSuggestions: configProps.hasSuggestions,
    testId: configProps.testId,
    fieldMetadata,

    getPConnect: () => {
      return {
        getStateProps: () => {
          return stateProps;
        },
        getActionsApi: () => {
          return {
            updateFieldValue: () => {/* nothing */},
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
      <PegaDxilMyPercentage {...props} />
    </>
  );
};
