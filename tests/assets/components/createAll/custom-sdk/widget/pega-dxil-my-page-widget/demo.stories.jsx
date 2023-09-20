import { withKnobs } from '@storybook/addon-knobs';

import PegaDxilMyPageWidget from './index.tsx';

import { configProps } from './mock.stories';

export default {
  title: 'PegaDxilMyPageWidget',
  decorators: [withKnobs],
  component: PegaDxilMyPageWidget
};

export const BasePegaDxilMyPageWidget = () => {
  
  const props = {
    label: configProps.label,
    header: configProps.header,
    description: configProps.description,
    image: configProps.image,
    datasource: configProps.datasource,
    whatsnewlink: configProps.whatsnewlink
  };

  return (
    <>
      <PegaDxilMyPageWidget {...props} />
    </>
  );
};
