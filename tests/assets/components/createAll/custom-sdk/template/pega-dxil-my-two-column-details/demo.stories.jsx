import { withKnobs } from "@storybook/addon-knobs";

import PegaDxilMyTwoColumnDetails from "./index.tsx";

import operatorDetails, { pyReviewRaw } from "./mock.stories";

export default {
  title: "PegaDxilMyTwoColumnDetails",
  decorators: [withKnobs],
  component: PegaDxilMyTwoColumnDetails,
  parameters: {
    type: "DetailsRegion",
  },
};

export const BaseYourOrgRequiredDxilDetailsRegion = () => {
  if (!window.PCore) {
    window.PCore = {};
  }

  window.PCore.getUserApi = () => {
    return {
      getOperatorDetails: () => {
        return new Promise((resolve) => {
          resolve(operatorDetails);
        });
      },
    };
  };

  window.PCore.getEnvironmentInfo = () => {
    return {
      getUseLocale: () => {
        return "en-US";
      },
    };
  };

  const props = {
    NumCols: "2",
    template: "DefaultForm",
    showHighlightedData: false,
    label: "Details Region",
    showLabel: true,
    getPConnect: () => {
      return {
        getChildren: () => {
          return pyReviewRaw.children[0].children;
        },
        getRawMetadata: () => {
          return pyReviewRaw;
        },
        getInheritedProps: () => {
          return pyReviewRaw.config.inheritedProps;
        },
        setInheritedProp: () => {
          /* nothing */
        },
        resolveConfigProps: () => {
          /* nothing */
        },
      };
    },
  };

  return (
    <>
      <PegaDxilMyTwoColumnDetails
        {...props}
      ></PegaDxilMyTwoColumnDetails>
    </>
  );
};
