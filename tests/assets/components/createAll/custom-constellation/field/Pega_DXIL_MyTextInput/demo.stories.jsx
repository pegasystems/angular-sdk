import { withKnobs } from '@storybook/addon-knobs';

import PegaDxilMyTextInput from './index.jsx';

import { stateProps, fieldMetadata, configProps } from './mock.stories';

export default {
  title: 'PegaDxilMyTextInput',
  decorators: [withKnobs],
  component: PegaDxilMyTextInput
};

export const basePegaDxilMyTextInput = () => {

  const props = {
    value: configProps.value,
    placeholder: configProps.placeholder,
    label: configProps.label,
    helperText: configProps.helperText,
    testId: configProps.testId,
    hasSuggestions: configProps.hasSuggestions,
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
      <PegaDxilMyTextInput {...props} />
    </>
  );
};
