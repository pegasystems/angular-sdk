export const configProps = {
  value: '',
  label: 'Picklist Sample',
  placeholder: 'Select...',
  listType: 'associated',
  datasource: [
    {
      key: 'Option 1',
      value: 'Option 1'
    },
    {
      key: 'Option 2',
      value: 'Option 2'
    },
    {
      key: 'Option 3',
      value: 'Option 3'
    }
  ],
  helperText: 'Picklist Helper Text',
  testId: 'picklist-12345678',
  hasSuggestions: false
};

export const stateProps = {
  value: '.PicklistSample',
  placeholder: 'Select...',
  datasource: '.PicklistSample',
  hasSuggestions: false
};

export const rawMetadata = {
  type: 'Dropdown',
  config: {
    value: '@P .PicklistSample',
    label: '@L Picklist Sample',
    placeholder: '@L Select...',
    listType: 'associated',
    datasource: '@ASSOCIATED .PicklistSample',
    helperText: '@L Picklist Helper Text',
    testId: 'picklist-12345678'
  }
};

export const fieldMetadata = {
  classID: 'DIXL-MediaCo-Work-NewService',
  type: 'Text',
  displayAs: 'pxDropdown',
  label: 'Picklist sample',
  datasource: {
    tableType: 'PromptList',
    records: [
      {
        key: 'Option 1',
        value: 'Option 1'
      },
      {
        key: 'Option 2',
        value: 'Option 2'
      },
      {
        key: 'Option 3',
        value: 'Option 3'
      }
    ]
  }
};
