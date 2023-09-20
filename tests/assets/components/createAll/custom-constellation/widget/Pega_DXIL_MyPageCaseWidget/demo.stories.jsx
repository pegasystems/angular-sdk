import { withKnobs } from '@storybook/addon-knobs';

import PegaDxilMyPageCaseWidget from './index.jsx';

import { configProps, operatorDetails } from './mock.stories';

export default {
  title: 'PegaDxilMyPageCaseWidget',
  decorators: [withKnobs],
  component: PegaDxilMyPageCaseWidget
};

if (!window.PCore) {
  window.PCore = {};
}

window.PCore.getLocaleUtils = () => {
  return {
    getLocaleValue: value => {
      return value;
    }
  };
};

window.PCore.getUserApi = () => {
  return {
    getOperatorDetails: () => {
      return new Promise(resolve => {
        resolve(operatorDetails);
      });
    }
  };
};

export const basePegaDxilMyPageCaseWidget = () => {

  const props = {
    label: configProps.label,
    createLabel: configProps.createLabel,
    updateLabel: configProps.updateLabel,
    createOperator: configProps.createOperator,
    updateOperator: configProps.updateOperator,
    createDateTime: configProps.createDateTime,
    updateDateTime: configProps.updateDateTime,
    hideLabel: configProps.hideLabel,

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
