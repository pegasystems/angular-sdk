import { withKnobs } from '@storybook/addon-knobs';

import PegaDxilMyUrl from './index.jsx';
import { stateProps, configProps } from './mock.stories';

export default {
  title: 'PegaDxilMyUrl',
  decorators: [withKnobs],
  component: PegaDxilMyUrl
};

export const basePegaDxilMyUrl = () => {

  const props = {
    value: configProps.value,
    placeholder: configProps.placeholder,
    label: configProps.label,
    helperText: configProps.helperText,
    testId: configProps.testId,
    hasSuggestions: configProps.hasSuggestions,

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
      <PegaDxilMyUrl {...props} />
    </>
  );
};
