export default function setPCoreMocks() {
  if (!window.PCore) {
    window.PCore = {} as any;
  }

  window.PCore.getEnvironmentInfo = () => {
    return {
      getUseLocale: () => 'en-GB',
      getLocale: () => 'en-GB',
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
