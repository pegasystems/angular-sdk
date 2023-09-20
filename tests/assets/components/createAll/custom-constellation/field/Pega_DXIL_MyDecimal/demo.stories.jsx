import { withKnobs } from '@storybook/addon-knobs';

import { configProps, fieldMetadata, stateProps } from './mock.stories.js';

import PegaDxilMyDecimal from './index.jsx';

export default {
  title: 'PegaDxilMyDecimal',
  decorators: [withKnobs],
  component: PegaDxilMyDecimal
};

export const basePegaDxilMyDecimal = () => {

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
      <PegaDxilMyDecimal {...props} />
    </>
  );
};
