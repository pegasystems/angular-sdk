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
          value: "90.89",
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
            label: "Create operator",
            createLabel: "Created",
            updateLabel: "Updated",
            updateDateTime: "2023-03-10T15:45:56.919Z",
            createDateTime: "2023-03-10T15:45:40.154Z",
            updateOperator: {
              userId: "rep@mediaco",
              userName: "representative",
            },
            createOperator: {
              userId: "rep@mediaco",
              userName: "representative",
            },
          },
        },
      ],
    },
  ],
  classID: "MyCo-MyCompon-Work-MyComponents",
};
