import { withKnobs } from '@storybook/addon-knobs';

import AppAnnouncement from "@pega/react-sdk-components/lib/components/widget/AppAnnouncement";

import { pyHome1Resolved, pyHome1Raw } from './mock.stories';

import PegaDxilMyPage from './index.tsx';

export default {
  title: 'PegaDxilMyPage',
  decorators: [withKnobs],
  component: PegaDxilMyPage
};

export const BasePegaDxilMyPage = () => {
  
  const configProps = pyHome1Resolved.children[0].children[0].config;

  const props = {
    getPConnect: () => {
      return {
        getStateProps: () => {
          return {};
        },
        getActionsApi: () => {
          return {
            getNextWork: () => {
              return new Promise(resolve => {
                resolve({});
              });
            },
            updateFieldValue: () => {/* nothing */},
            triggerFieldChange: () => {/* nothing */}
          };
        },
        getChildren: () => {
          return pyHome1Raw.children;
        },
        getComponentName: () => {
          return '';
        },
        getLocalizedValue: value => {
          return value;
        },
        getRawMetadata: () => {
          return pyHome1Raw;
        },
        createComponent: config => {
         if(config.type === 'AppAnnouncement') {
              return (
                <AppAnnouncement
                  key='announcement'
                  header='Announcements'
                  description={configProps.description}
                  image={configProps.image.replace(/ /g, '+')}
                  datasource={configProps.datasource}
                  label={configProps.label}
                  whatsnewlink={configProps.whatsnewlink}
                />
              );
          }
        },
        ignoreSuggestion: () => {/* nothing */},
        acceptSuggestion: () => {/* nothing */},
        setInheritedProps: () => {/* nothing */},
        resolveConfigProps: () => {/* nothing */}
      };
    }
  };

  const regionAChildren = pyHome1Raw.children[0].children.map(child => {
   return props.getPConnect().createComponent(child);
  });

  return (
    <>
      <PegaDxilMyPage {...props}>{regionAChildren}</PegaDxilMyPage>
    </>
  );
};
