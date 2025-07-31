// @ts-nocheck
/** This file contains the Mocks for the various pcore APIs */
export default function setPCoreMocks() {
  if (!window.PCore) {
    window.PCore = {} as any;
  }

  window.PCore.getEnvironmentInfo = () => {
    return {
      getUseLocale: () => 'en-US',
      getLocale: () => 'en-US',
      getTimeZone: () => 'America/New_York'
    } as any;
  };

  window.PCore.getLocaleUtils = () => {
    return {
      getLocaleValue: (value: any) => value
    } as any;
  };

  window.PCore.getConstants = (): any => {
    return {
      CASE_INFO: {
        INSTRUCTIONS: ''
      }
    };
  };
}
