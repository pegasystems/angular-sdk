import { withKnobs } from '@storybook/addon-knobs';
import { configProps, stateProps } from './mock.stories';
import PegaDxilMyDate from './index.jsx';

export default {
  title: 'PegaDxilMyDate',
  decorators: [withKnobs],
  component: PegaDxilMyDate
};

if (!window.PCore) {
  window.PCore = {};
}

window.PCore.getEnvironmentInfo = () => {
  return {
    getLocale: () => {
      return 'en-GB';
    }
  };
};

export const basePegaDxilMyDate = () => {
  const props = {
    getPConnect: () => {
      return {
        getActionsApi: () => {
          return {
            updateFieldValue: () => {/* nothing */},
            triggerFieldChange: () => {/* nothing */}
          };
        },
        getValidationApi: () => {
          return {
            validate: () => {/* nothing */}
          };
        },
        getStateProps: () => {
          return stateProps;
        },
        getConfigProps: () => {
          return configProps;
        },
        ignoreSuggestion: () => {/* nothing */},
        acceptSuggestion: () => {/* nothing */},
        clearErrorMessages: () => {/* nothing */}
      };
    },
    value: configProps.value,
    validatemessage: configProps.validatemessage,
    label: configProps.label,
    hideLabel: configProps.hideLabel,
    helperText: configProps.helperText,
    nextYearRange: configProps.nextYearRange,
    previousYearRange: configProps.previousYearRange,
    showWeekNumber: configProps.showWeekNumber,
    testId: configProps.testId,
    showAsFormattedText: configProps.showAsFormattedText,
    additionalProps: configProps.additionalProps,
    displayMode: configProps.displayMode,
    variant: configProps.variant,
    hasSuggestions: configProps.hasSuggestions,
    disabled: configProps.disabled,
    readOnly: configProps.readOnly,
    required: configProps.required
  };

  return (
    <>
      <PegaDxilMyDate {...props} />
    </>
  );
};
