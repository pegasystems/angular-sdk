# [25.1.12](https://github.com/pegasystems/angular-sdk/tree/release/25.1.12) - Released: 27/03/2026

## Breaking changes

*   Upgraded the `Angular` version to 21 and the `Angular Material` version to 21.


## Non Breaking changes

### **Bug fixes**

*   **When condition not working for Add & Delete actions in FieldGroupTemplate**
      * Github: [PR-444](https://github.com/pegasystems/angular-sdk-components/pull/444)
*   **Confirmation view not getting rendered issue**
      * Github: [PR-452](https://github.com/pegasystems/angular-sdk-components/pull/452)
---

### **Dependencies & Infrastructure**

*   The following table lists the packages whose versions have been updated:

| Package | Updated version |
| :--- | :--- |
| **@angular/animations** | 21.2.4 |
| **@angular/cdk** | 21.2.2 |
| **@angular/cli** | 21.2.2 |
| **@angular/common** | 21.2.4 |
| **@angular/compiler** | 21.2.4 |
| **@angular/compiler-cli** | 21.2.4 |
| **@angular/core** | 21.2.4 |
| **@angular/forms** | 21.2.4 |
| **@angular/language-service** | 21.2.4 |
| **@angular/material** | 21.2.2 |
| **@angular/platform-browser** | 21.2.4 |
| **@angular/platform-browser-dynamic** | 21.2.4 |
| **@angular/router** | 21.2.4 |
| **@angular-builders/custom-webpack** | 21.0.3 |
| **@angular-devkit/build-angular** | 21.2.2 |
| **@angular-devkit/core** | 21.2.2 |
| **@angular-eslint/eslint-plugin** | 21.3.1 |
| **@angular-eslint/eslint-plugin-template** | 21.3.1 |
| **@angular-eslint/template-parser** | 21.3.1 |
| **eslint** | 9.36.0 |
| **jest** | 30.2.0 |
| **jest-environment-jsdom** | 30.2.0 |
| **typescript** | 5.9.3 |
| **typescript-eslint** | 8.48.1 |
| **zone.js** | 0.16.1 |


# [25.1.11](https://github.com/pegasystems/angular-sdk/tree/release/25.1.11) - Released: 15/01/2026

## Non Breaking changes

### **Bug fixes**

*   **Location field appeared editable even in a read-only state issue fixed**
      * Github: [PR-418](https://github.com/pegasystems/angular-sdk-components/pull/418)
*   **Checkbox required validation handled correctly**
      * Github: [PR-419](https://github.com/pegasystems/angular-sdk-components/pull/419)

| Package | Updated version |
| :--- | :--- |
| **@angular/animations** | 20.3.15 |
| **@angular/cdk** | 20.2.14 |
| **@angular/cli** | 20.3.13 |
| **@angular/common** | 20.3.15 |
| **@angular/compiler** | 20.3.15 |
| **@angular/compiler-cli** | 20.3.15 |
| **@angular/core** | 20.3.15 |
| **@angular/forms** | 20.3.15 |
| **@angular/language-service** | 20.3.15 |
| **@angular/material** | 20.2.14 |
| **@angular/material-experimental** | 20.2.14 |
| **@angular/material-moment-adapter** | 20.2.14 |
| **@angular/platform-browser** | 20.3.15 |
| **@angular/platform-browser-dynamic** | 20.3.15 |
| **@angular/router** | 20.3.15 |
| **@angular-builders/custom-webpack** | 20.0.0 |
| **@angular-devkit/build-angular** | 20.3.13 |
| **@angular-devkit/core** | 20.3.13 |
| **@danielmoncada/angular-datetime-picker**| 20.0.1 |
| **@pega/auth** | 0.2.34 |
| **ng-packagr** | 20.3.0 |


# [25.1.10](https://github.com/pegasystems/angular-sdk/tree/release/25.1.10) - Released: 26/12/2025


## Breaking changes

*   The `Attachment` component now passes data in the `pageInstructions` object instead of the `content` object.
    * Github: [PR-370](https://github.com/pegasystems/angular-sdk-components/pull/370)

## Non Breaking changes

### **Features**

*   A new self-service portal called **MediaCoSelfService** has been introduced for the MediaCo sample application.

    * Github: [PR-355](https://github.com/pegasystems/angular-sdk-components/pull/355)

    **NOTE:** Please refer [What's New](https://pega-dev.zoominsoftware.io/bundle/constellation-sdk/page/constellation-sdks/sdks/angular-sdk-updates.html) for more details.


*   Support for `light`, `dark`, and `MediaCo` themes has been introduced through the `theme` attribute in the **sdk-config.json** file. The `light` theme is applied by default. For more information, see [theme](https://pega-dev.zoominsoftware.io/bundle/constellation-sdk/page/constellation-sdks/sdks/configuring-sdk-config-json.html#configuring-the-sdk-config-json-con__theme).

    * Github: [PR-321](https://github.com/pegasystems/angular-sdk-components/pull/321)

*   The advanced search feature is now supported in the `Data Reference` field type. For more information, see [Advanced search](https://docs.pega.com/bundle/common-data-model/page/common-data-model/implementation/advanced-search-intro.html).

    * Github: [PR-326](https://github.com/pegasystems/angular-sdk-components/pull/326)

*   `ListView` now supports `Select all`
    * Github: [PR-374](https://github.com/pegasystems/angular-sdk-components/pull/374)
*   `DefaultPage` component has been added.
    * Github: [PR-351](https://github.com/pegasystems/angular-sdk-components/pull/351)
*   `Location` component has been added.
    * Github: [PR-325](https://github.com/pegasystems/angular-sdk-components/pull/325)
*   `ObjectReference` component has been added.
    * Github: [PR-329](https://github.com/pegasystems/angular-sdk-components/pull/329)
*   `SelectableCards` component has been added.
    * Github: [PR-322](https://github.com/pegasystems/angular-sdk-components/pull/322)
*   `SelfServiceCaseView` component has been added.
    * Github: [PR-355](https://github.com/pegasystems/angular-sdk-components/pull/355)
---

### **Bug fixes**

*   **Playwright tests have been fixed**
      * Github: [PR-330](https://github.com/pegasystems/angular-sdk-components/pull/330), [PR-347](https://github.com/pegasystems/angular-sdk-components/pull/347)
*   **Semantic link component did not display links as expected**
      * Github: [PR-329](https://github.com/pegasystems/angular-sdk-components/pull/329)
*   **Improved the handling of phone number value changes**
      * Github: [PR-360](https://github.com/pegasystems/angular-sdk-components/pull/360)
*   **Localization fixes have been made**
      * Github: [PR-356](https://github.com/pegasystems/angular-sdk-components/pull/356)

---

### Refactoring

* **FieldBase** component has been added for the field components to inherit
    * Github: [PR-322](https://github.com/pegasystems/angular-sdk-components/pull/332)

---

### **Dependencies & Infrastructure**

*   Upgraded the `Angular` version to 19 and the `Angular Material` version to 19.
    * Github: [PR-319](https://github.com/pegasystems/angular-sdk-components/pull/319)
*   The `ESLint` library has been updated to version 9.
    * Github: [PR-339](https://github.com/pegasystems/angular-sdk-components/pull/339)

*   The **@pega/pcore-pconnect-typedefs** package has been updated to v4.1.0
    * Github: [PR-336](https://github.com/pegasystems/angular-sdk-components/pull/336)

*   The `npm` vulerabilities have been reduced.
    * Github: [PR-363](https://github.com/pegasystems/angular-sdk-components/pull/363)
*   The **@angular/google-maps** package has been added to support the Location component.
    * Github: [PR-328](https://github.com/pegasystems/angular-sdk-components/pull/328)
*   The **mat-tel-input** package has been added to support the Phone component for Angular 19.
    * Github: [PR-326](https://github.com/pegasystems/angular-sdk-components/pull/326)
*   The **ngx-mat-intl-tel-input** package has been removed.
    * Github: [PR-319](https://github.com/pegasystems/angular-sdk-components/pull/319)
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
