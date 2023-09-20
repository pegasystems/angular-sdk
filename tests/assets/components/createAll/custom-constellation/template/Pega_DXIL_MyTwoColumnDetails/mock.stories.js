export const pyReviewRaw = {
  name: 'pyReview',
  type: 'View',
  config: {
    template: 'Details',
    ruleClass: 'MyCo-MyCompon-Work-MyComponents',
    showLabel: true,
    label: '@L Details',
    localeReference: '@LR MYCO-MYCOMPON-WORK-MYCOMPONENTS!VIEW!PYREVIEW',
    showHighlightedData: true,
    highlightedData: [
      {
        type: 'TextInput',
        config: {
          value: '@P .pyStatusWork',
          label: '@L Work Status',
          displayMode: 'STACKED_LARGE_VAL',
          displayAsStatus: true,
          key: 'pyStatusWork'
        }
      },
      {
        type: 'TextInput',
        config: {
          value: '@P .pyID',
          label: '@L Case ID',
          displayMode: 'STACKED_LARGE_VAL',
          key: 'pyID'
        }
      },
      {
        type: 'DateTime',
        config: {
          value: '@P .pxCreateDateTime',
          label: '@L Create date/time',
          displayMode: 'STACKED_LARGE_VAL',
          key: 'pxCreateDateTime'
        }
      },
      {
        type: 'UserReference',
        config: {
          label: '@L Create Operator',
          value: '@USER .pxCreateOperator',
          placeholder: 'Select...',
          displayMode: 'STACKED_LARGE_VAL',
          key: 'pxCreateOperator'
        }
      }
    ],
    inheritedProps: [
      {
        prop: 'label',
        value: '@L Details'
      },
      {
        prop: 'showLabel',
        value: true
      }
    ]
  },
  children: [
    {
      name: 'A',
      type: 'Region',
      key: 'A',
      getPConnect: () => {
        return {
          getRawMetadata: () => {
            return pyReviewRaw.children[0];
          }
        };
      },
      children: [
        {
          type: 'DateTime',
          config: {
            value: '@P .pySLADeadline',
            label: '@L SLA Deadline',
            key: 'pySLADeadline'
          }
        },
        {
          type: 'DateTime',
          config: {
            value: '@P .pySLAGoal',
            label: '@L SLA Goal',
            key: 'pySLAGoal'
          }
        },
        {
          type: 'RadioButtons',
          config: {
            value: '@P .pySLAStartTime',
            label: '@L SLA Start Time',
            listType: 'associated',
            datasource: '@ASSOCIATED .pySLAStartTime',
            key: 'pySLAStartTime'
          }
        }
      ]
    },
    {
      name: 'B',
      type: 'Region',
      key: 'B',
      getPConnect: () => {
        return {
          getRawMetadata: () => {
            return pyReviewRaw.children[0];
          }
        };
      },
      children: [
        {
          type: 'DateTime',
          config: {
            value: '@P .pySLADeadline',
            label: '@L SLA Deadline',
            key: 'pySLADeadline'
          }
        },
        {
          type: 'DateTime',
          config: {
            value: '@P .pySLAGoal',
            label: '@L SLA Goal',
            key: 'pySLAGoal'
          }
        },
        {
          type: 'RadioButtons',
          config: {
            value: '@P .pySLAStartTime',
            label: '@L SLA Start Time',
            listType: 'associated',
            datasource: '@ASSOCIATED .pySLAStartTime',
            key: 'pySLAStartTime'
          }
        }
      ]
    }
  ],
  classID: 'MyCo-MyCompon-Work-MyComponents'
};

export const pyReviewResolved = {
  readOnly: true,
  template: 'Details',
  ruleClass: 'MyCo-MyCompon-Work-MyComponents',
  showLabel: true,
  label: 'Details',
  localeReference: 'MYCO-MYCOMPON-WORK-MYCOMPONENTS!VIEW!PYREVIEW',
  showHighlightedData: true,
  highlightedData: [
    {
      type: 'TextInput',
      config: {
        value: 'New',
        label: 'Work Status',
        displayMode: 'STACKED_LARGE_VAL',
        displayAsStatus: true
      }
    },
    {
      type: 'TextInput',
      config: {
        value: 'M-1002',
        label: 'Case ID',
        displayMode: 'STACKED_LARGE_VAL'
      }
    },
    {
      type: 'DateTime',
      config: {
        value: '2022-12-11T20:06:27.232Z',
        label: 'Create date/time',
        displayMode: 'STACKED_LARGE_VAL'
      }
    },
    {
      type: 'UserReference',
      config: {
        label: 'Create Operator',
        value: {
          userId: 'conns',
          userName: 'Sara Connor'
        },
        placeholder: 'Select...',
        displayMode: 'STACKED_LARGE_VAL'
      }
    }
  ],
  displayMode: 'LABELS_LEFT'
};

export const regionChildrenResolved = [
  {
    readOnly: true,
    value: '',
    label: 'SLA Deadline',
    displayMode: 'LABELS_LEFT',
    key: 'SLA Deadline'
  },
  {
    readOnly: true,
    value: '',
    label: 'SLA Goal',
    displayMode: 'LABELS_LEFT',
    key: 'SLA Goal'
  },
  {
    readOnly: true,
    value: '',
    label: 'SLA Start Time',
    listType: 'associated',
    datasource: [
      {
        key: 'AssignmentCreation',
        value: 'The creation time of the Assignment'
      },
      {
        key: 'CurrentTime',
        value: 'Current Date Time'
      }
    ],
    displayMode: 'LABELS_LEFT',
    key: 'SLA Start Time'
  }
];
