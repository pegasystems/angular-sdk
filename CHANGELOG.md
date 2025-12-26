# [25.1.10](https://github.com/pegasystems/angular-sdk/tree/release/25.1.10) - Released: 26/12/2025


## Breaking changes

*   The `Attachment` component now passes data in the `pageInstructions` object instead of the `content` object.

## Non Breaking changes

### **Features**

*   A new self-service portal called **MediaCoSelfService** has been introduced for the MediaCo sample application.

    **NOTE:** Please refer [What's New](https://pega-dev.zoominsoftware.io/bundle/constellation-sdk/page/constellation-sdks/sdks/angular-sdk-updates.html) for more details.

*   Support for `light`, `dark`, and `MediaCo` themes has been introduced through the `theme` attribute in the **sdk-config.json** file. The `light` theme is applied by default. For more information, see [theme](https://pega-dev.zoominsoftware.io/bundle/constellation-sdk/page/constellation-sdks/sdks/configuring-sdk-config-json.html#configuring-the-sdk-config-json-con__theme).

*   The advanced search feature is now supported in the `Data Reference` field type. For more information, see [Advanced search](https://docs.pega.com/bundle/common-data-model/page/common-data-model/implementation/advanced-search-intro.html).

*   `DefaultPage` component has been added.
*   `Location` component has been added.
*   `ObjectReference` component has been added.
*   `SelectableCards` component has been added.
*   `SelfServiceCaseView` component has been added.
---

### **Bug fixes**

*   **Playwright tests have been fixed**
*   **Semantic link component did not display links as expected**
*   **Improved the handling of phone number value changes**

---

### Refactoring

**FieldBase** component has been added for the field components to inherit

---

### **Dependencies & Infrastructure**

*   Upgraded the Angular version to 19 and the Angular Material version to 19.
*   The ESLint library has been updated to version 9.
*   The `npm` vulerabilities have been reduced.
*   The **@angular/google-maps** package has been added to support the Location component.
*   The **mat-tel-input** package has been added to support the Phone component for Angular 19.
*   The **ngx-mat-intl-tel-input** package has been removed.
*   The following table lists the packages whose versions have been updated:

| Package | Updated version |
| :--- | :--- |
| **@angular/animations** | 19.2.14 |
| **@angular/cdk** | 19.2.19 |
| **@angular/cli** | 19.2.15 |
| **@angular/common** | 19.2.14 |
| **@angular/compiler** | 19.2.14 |
| **@angular/compiler-cli** | 19.2.14 |
| **@angular/core** | 19.2.14 |
| **@angular/forms** | 19.2.14 |
| **@angular/language-service** | 19.2.14 |
| **@angular/material** | 19.2.19 |
| **@angular/material-experimental** | 19.2.19 |
| **@angular/material-moment-adapter** | 19.2.19 |
| **@angular/platform-browser** | 19.2.14 |
| **@angular/platform-browser-dynamic** | 19.2.14 |
| **@angular/router** | 19.2.14 |
| **@angular-builders/custom-webpack** | 19.0.1 |
| **@angular-devkit/build-angular** | 19.2.15 |
| **@angular-devkit/core** | 19.2.15 |
| **@danielmoncada/angular-datetime-picker**| 19.0.0 |
| **@pega/auth** | 0.2.31 |
| **@pega/configs** | 0.16.3 |
| **@playwright/test** | 1.54.2 |
| **copy-webpack-plugin** | 13.0.1 |
| **eslint-plugin-import** | 2.32.0 |
| **ng-packagr** | 19.2.2 |
| **ngx-currency** | 19.0.0 |
| **shx** | 0.4.0 |
| **typescript** | 5.5.4 |
| **webpack** | 5.101.2 |
