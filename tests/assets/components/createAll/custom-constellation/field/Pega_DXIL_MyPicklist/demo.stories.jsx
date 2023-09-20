import { useState } from 'react';
import { withKnobs } from '@storybook/addon-knobs';

import { configProps, rawMetadata, fieldMetadata, stateProps } from './mock.stories.js';

import PegaDxilMyPicklist from './index.jsx';

export default {
  title: 'PegaDxilMyPicklist',
  decorators: [withKnobs],
  component: PegaDxilMyPicklist
};

export const basePegaDxilMyPicklist = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [value, setValue] = useState(configProps.value);

  const props = {
    value,
    placeholder: configProps.placeholder,
    label: configProps.label,
    helperText: configProps.helperText,
    datasource: configProps.datasource,
    testId: configProps.testId,
    hasSuggestions: configProps.hasSuggestions,
    fieldMetadata,

    getPConnect: () => {
      return {
        getConfigProps: () => {
          return configProps;
        },
        getStateProps: () => {
          return stateProps;
        },
        getLocalizedValue: val => {
          return val;
        },
        getLocaleRuleNameFromKeys: (localeClass, localeContext, localeName) => {
          return `${localeClass}!${localeContext}!${localeName}`;
        },
        getCaseInfo: () => {
          return {
            getClassName: () => {
              return 'DIXL-MediaCo-Work-NewService';
            }
          };
        },
        getRawMetadata: () => {
          return rawMetadata;
        },
        getActionsApi: () => {
          return {
            updateFieldValue: (propName, theValue) => {
              setValue(theValue);
            },
            triggerFieldChange: () => {/* nothing */}
          };
        },
        getValidationApi: () => {
          return {
            validate: () => {/* nothing */}
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
      <PegaDxilMyPicklist {...props} />
    </>
  );
};
