const operatorDetails = {
  data: {
    pzLoadTime: "January 18, 2023 10:33:19 AM EST",
    pzPageNameHash: "_pa1519192551088960pz",
    pyOperatorInfo: {
      pyUserName: "french DigV2",
      pyPosition: "",
      pyImageInsKey: "",
      pySkills: [
        {
          pySkillName: "",
          pzIndexOwnerKey: "DATA-ADMIN-OPERATOR-ID FRENCHTEST.DIGV2",
          pySkillRating: 0,
        },
      ],
      pyReportToUserName: "",
      pyReportTo: "",
      pyOrganization: "DXIL",
      pyTitle: "",
      pyLabel: "frenchTest.DigV2",
      pyEmailAddress: "User@DigV2",
      pyTelephone: "",
    },
  },
  status: 200,
  statusText: "",
  headers: {
    "content-length": "435",
    "content-type": "application/json;charset=UTF-8",
  },
  request: {},
};

export default operatorDetails;

export const pyReviewRaw = {
  name: "pyReview",
  type: "View",
  config: {
    template: "Details",
    ruleClass: "MyCo-MyCompon-Work-MyComponents",
    showLabel: true,
    label: "@L Details",
    localeReference: "@LR MYCO-MYCOMPON-WORK-MYCOMPONENTS!VIEW!PYREVIEW",
    showHighlightedData: true,
    highlightedData: [
      {
        type: "TextInput",
        config: {
          value: "@P .pyStatusWork",
          label: "@L Work Status",
          displayMode: "STACKED_LARGE_VAL",
          displayAsStatus: true,
        },
      },
      {
        type: "TextInput",
        config: {
          value: "@P .pyID",
          label: "@L Case ID",
          displayMode: "STACKED_LARGE_VAL",
        },
      },
      {
        type: "DateTime",
        config: {
          value: "@P .pxCreateDateTime",
          label: "@L Create date/time",
          displayMode: "STACKED_LARGE_VAL",
        },
      },
      {
        type: "UserReference",
        config: {
          label: "@L Create Operator",
          value: "@USER .pxCreateOperator",
          placeholder: "Select...",
          displayMode: "STACKED_LARGE_VAL",
        },
      },
    ],
    inheritedProps: [
      {
        prop: "label",
        value: "@L Details",
      },
      {
        prop: "showLabel",
        value: true,
      },
    ],
  },
  children: [
    {
      name: "A",
      type: "Region",
      getPConnect: () => {
        return {
          getRawMetadata: () => {
            return pyReviewRaw.children[0];
          },
        };
      },
      children: [
        {
          readOnly: undefined,
          placeholder: "First Name",
          value: "John",
          label: "First Name",
          hasSuggestions: false,
          displayMode: "LABELS_LEFT",
        },
        {
          readOnly: undefined,
          placeholder: "Middle Name",
          value: "",
          label: "Middle Name",
          hasSuggestions: false,
          displayMode: "LABELS_LEFT",
        },
        {
          readOnly: undefined,
          placeholder: "Last Name",
          value: "Doe",
          label: "Last Name",
          hasSuggestions: false,
          displayMode: "LABELS_LEFT",
        },
        {
          value: "john@doe.com",
          label: "Email",
          required: true,
          testId: "CE8AE9DA5B7CD6C3DF2929543A9AF92D",
          hasSuggestions: false,
          displayMode: "LABELS_LEFT",
        },
        {
          readOnly: undefined,
          value: "+16397975093",
          label: "Phone",
          displayMode: "LABELS_LEFT",
          hasSuggestions: false,
        },
        {
          readOnly: undefined,
          placeholder: "Price",
          value: "90.99",
          label: "Price",
          hasSuggestions: false,
          displayMode: "LABELS_LEFT",
          getPConnect: () => {
            return {
              getActionsApi: () => {/* nothing */},
              getStateProps: () => {
                return {
                  value: "",
                };
              },
              getComponentName: () => {
                return "currency";
              },
            };
          },
        },
        {
          readOnly: undefined,
          value: "100 Mbps",
          label: "Internet Plan",
          hasSuggestions: false,
          displayMode: "LABELS_LEFT",
          getPConnect: () => {
            return {
              getActionsApi: () => {/* nothing */},
              getStateProps: () => {
                return {
                  value: "",
                };
              },
              getComponentName: () => {
                return "radio";
              },
              getConfigProps: () => {
                return {};
              },
              getDataObject: () => {
                return {};
              },
            };
          },
        },
        {
          caseOpConfig: {
            label: "Update operator",
            createLabel: "Created",
            updateLabel: "Updated",
            updateDateTime: "2023-03-10T12:53:04.670Z",
            createDateTime: "2023-03-10T12:52:20.054Z",
            updateOperator: {
              userId: "User.DigV2",
              userName: "User DigV2",
            },
            createOperator: {
              userId: "User.DigV2",
              userName: "User DigV2",
            },
          },
        },
      ],
    },
  ],
  classID: "MyCo-MyCompon-Work-MyComponents",
};

export const pyReviewResolved = {
  readOnly: true,
  template: "Details",
  ruleClass: "MyCo-MyCompon-Work-MyComponents",
  showLabel: true,
  label: "Details",
  localeReference: "MYCO-MYCOMPON-WORK-MYCOMPONENTS!VIEW!PYREVIEW",
  showHighlightedData: true,
  highlightedData: [
    {
      type: "TextInput",
      config: {
        value: "New",
        label: "Work Status",
        displayMode: "STACKED_LARGE_VAL",
        displayAsStatus: true,
      },
    },
    {
      type: "TextInput",
      config: {
        value: "M-1002",
        label: "Case ID",
        displayMode: "STACKED_LARGE_VAL",
      },
    },
    {
      type: "DateTime",
      config: {
        value: "2022-12-11T20:06:27.232Z",
        label: "Create date/time",
        displayMode: "STACKED_LARGE_VAL",
      },
    },
    {
      type: "UserReference",
      config: {
        label: "Create Operator",
        value: {
          userId: "conns",
          userName: "Sara Connor",
        },
        placeholder: "Select...",
        displayMode: "STACKED_LARGE_VAL",
      },
    },
  ],
  displayMode: "LABELS_LEFT",
};

export const regionChildrenResolved = [
  {
    readOnly: true,
    value: "",
    label: "SLA Deadline",
    displayMode: "LABELS_LEFT",
  },
  {
    readOnly: true,
    value: "",
    label: "SLA Goal",
    displayMode: "LABELS_LEFT",
  },
  {
    readOnly: true,
    value: "",
    label: "SLA Start Time",
    listType: "associated",
    datasource: [
      {
        key: "AssignmentCreation",
        value: "The creation time of the Assignment",
      },
      {
        key: "CurrentTime",
        value: "Current Date Time",
      },
    ],
    displayMode: "LABELS_LEFT",
  },
];
