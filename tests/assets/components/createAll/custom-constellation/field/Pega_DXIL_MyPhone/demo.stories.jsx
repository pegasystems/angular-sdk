import { withKnobs } from '@storybook/addon-knobs';

import PegaDxilMyPhone from './index.jsx';
import { stateProps, configProps } from './mock.stories';

export default {
  title: 'PegaDxilMyPhone',
  decorators: [withKnobs],
  component: PegaDxilMyPhone
};

export const basePegaDxilMyPhone = () => {

  const props = {
    value: configProps.value,
    placeholder: configProps.placeholder,
    label: configProps.label,
    testId: configProps.testId,
    hasSuggestions: configProps.hasSuggestions,
    datasource: configProps.datasource,

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
      <PegaDxilMyPhone {...props} />
    </>
  );
};
