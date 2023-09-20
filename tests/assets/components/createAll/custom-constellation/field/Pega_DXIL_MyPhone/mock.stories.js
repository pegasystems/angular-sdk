export const configProps = {
  value: '',
  label: 'Phone Sample',
  datasource: {
    source: [
      {
        value: '+1'
      },
      {
        value: '+91'
      },
      {
        value: '+48'
      },
      {
        value: '+44'
      }
    ],
    fields: {}
  },
  showCountryCode: true,
  placeholder: 'Phone Placeholder',
  helperText: 'Phone Helper Text',
  testId: 'phone-12345678',
  hasSuggestions: false
};

export const stateProps = {
  value: '.PhoneSample',
  datasource: {
    source: 'D_pyCountryCallingCodeList.pxResults',
    fields: {
      value: '.pyCallingCode'
    }
  },
  hasSuggestions: false
};
