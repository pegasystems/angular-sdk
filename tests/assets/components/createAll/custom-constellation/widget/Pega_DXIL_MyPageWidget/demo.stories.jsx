import { withKnobs } from '@storybook/addon-knobs';

import PegaDxilMyPageWidget from './index.jsx';


import configProps from './mock.stories';

export default {
  title: 'PegaDxilMyPageWidget',
  decorators: [withKnobs],
  component: PegaDxilMyPageWidget
};

export const basePegaDxilMyPageWidget = () => {

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
