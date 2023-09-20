import { withKnobs } from '@storybook/addon-knobs';

import { caseOpConfig, operatorDetails } from './mock.stories';

import PegaDxilMyPageCaseWidget from './index.tsx';

export default {
  title: 'PegaDxilMyPageCaseWidget',
  decorators: [withKnobs],
  component: PegaDxilMyPageCaseWidget
};

if (!window.PCore) {
  window.PCore = {};
}

window.PCore.getUserApi = () => {
  return {
    getOperatorDetails: () => {
      return new Promise(resolve => {
        resolve(operatorDetails);
      });
    }
  };
};

export const BasePegaDxilMyPageCaseWidget = () => {

  const props = {
    caseOpConfig,
    getPConnect: () => {
      return {
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
      <PegaDxilMyPageCaseWidget {...props} />
    </>
  );
};
