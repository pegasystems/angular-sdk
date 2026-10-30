# [25.1.15](https://github.com/pegasystems/angular-sdk/tree/release/25.1.15) - Released: 30/10/2026

## Breaking changes

*   Upgraded the `Angular` version to 22, the `Angular Material` version to 22, and the `TypeScript` version to 6.
    * Github: [PR-880](https://github.com/pegasystems/angular-sdk/pull/880)
    * Github: [PR-647](https://github.com/pegasystems/angular-sdk-components/pull/647)
*   The application build has been migrated from the `@angular-builders/custom-webpack` builder to the `@angular/build:application` builder. The `extra-webpack.config.js` file has been removed.
    * Github: [PR-880](https://github.com/pegasystems/angular-sdk/pull/880)
*   Upgraded `@pega/auth` to version 0.3.x.
    * Github: [PR-650](https://github.com/pegasystems/angular-sdk-components/pull/650)

## Non Breaking changes

### **Bug fixes**
*   **Fixed server-side validation messages being cleared from form fields when the field value or validation was updated.**
      * Github: [PR-648](https://github.com/pegasystems/angular-sdk-components/pull/648)
---

### **Dependencies & Infrastructure**

*   The **@angular-builders/custom-webpack** and **copy-webpack-plugin** packages have been removed.
    * Github: [PR-880](https://github.com/pegasystems/angular-sdk/pull/880)
*   The following table lists the packages whose versions have been updated:

| Package | Updated version |
| :--- | :--- |
| **@angular/animations** | 22.2.3 |
| **@angular/build** | 22.2.4 |
| **@angular/cdk** | 22.2.4 |
| **@angular/cli** | 22.2.3 |
| **@angular/common** | 22.2.3 |
| **@angular/compiler** | 22.2.3 |
| **@angular/compiler-cli** | 22.2.3 |
| **@angular/core** | 22.2.3 |
| **@angular/forms** | 22.2.3 |
| **@angular/language-service** | 22.2.3 |
| **@angular/material** | 22.2.4 |
| **@angular/platform-browser** | 22.2.3 |
| **@angular/platform-browser-dynamic** | 22.2.3 |
| **@angular/router** | 22.2.3 |
| **@angular-devkit/build-angular** | 22.2.4 |
| **@angular-devkit/core** | 22.2.3 |
| **@angular-eslint/eslint-plugin** | 22.6.0 |
| **@angular-eslint/eslint-plugin-template** | 22.6.0 |
| **@angular-eslint/template-parser** | 22.6.0 |
| **@pega/angular-sdk-components** | 25.1.15 |
| **@pega/angular-sdk-overrides** | 25.1.15 |
| **@pega/auth** | 0.3.3 |
| **@pega/dx-component-builder-sdk** | 25.1.18 |
| **typescript** | 6.0.3 |
| **typescript-eslint** | 8.72.0 |

# [25.1.14](https://github.com/pegasystems/angular-sdk/tree/release/25.1.14) - Released: 15/10/2026

## Breaking changes

*   SDK components have been migrated to zoneless change detection. Components now use `ChangeDetectorRef` instead of `NgZone`, and `zone.js` has been removed from the dependencies and polyfills. Applications must use `provideZonelessChangeDetection()`.
    * Github: [PR-565](https://github.com/pegasystems/angular-sdk-components/pull/565)
*   The unused `MaterialDetails` and `MaterialDetailsFields` components have been removed from the public API.
    * Github: [PR-588](https://github.com/pegasystems/angular-sdk-components/pull/588)

## Non Breaking changes

### **Features**
*   **Dropdown placeholder now uses the authored placeholder via the native Material select, with an option to clear the selection.**
    * Github: [PR-615](https://github.com/pegasystems/angular-sdk-components/pull/615)

### **Bug fixes**
*   **Fixed currency codes not displaying for Decimal and Currency fields in Details templates.**
      * Github: [PR-506](https://github.com/pegasystems/angular-sdk-components/pull/506)
*   **Fixed an issue where FieldGroup visibility did not work correctly.**
      * Github: [PR-516](https://github.com/pegasystems/angular-sdk-components/pull/516)
*   **Fixed the issue where the Details Two Column template was not working.**
      * Github: [PR-527](https://github.com/pegasystems/angular-sdk-components/pull/527)
*   **Fixed the required validation for the DataReference Multiselect combobox, including on checkbox change.**
      * Github: [PR-526](https://github.com/pegasystems/angular-sdk-components/pull/526)
      * Github: [PR-544](https://github.com/pegasystems/angular-sdk-components/pull/544)
*   **Fixed an issue where headings were not rendered in repeating views.**
      * Github: [PR-532](https://github.com/pegasystems/angular-sdk-components/pull/532)
*   **Fixed the AutoComplete component to assign the value only after the data is fetched.**
      * Github: [PR-554](https://github.com/pegasystems/angular-sdk-components/pull/554)
*   **Fixed label display in Details templates.**
      * Github: [PR-566](https://github.com/pegasystems/angular-sdk-components/pull/566)
*   **Refactored Details templates to correctly render regions and child components.**
      * Github: [PR-583](https://github.com/pegasystems/angular-sdk-components/pull/583)
*   **Fixed DateTime component theme colors to support different themes.**
      * Github: [PR-619](https://github.com/pegasystems/angular-sdk-components/pull/619)
*   **Fixed the DateTime component defaulting to the current date and time for invalid input and added validation messages for invalid values.**
      * Github: [PR-620](https://github.com/pegasystems/angular-sdk-components/pull/620)
*   **Replaced `uuidv4` with `crypto.randomUUID` for generating unique IDs in filter utilities.**
      * Github: [PR-621](https://github.com/pegasystems/angular-sdk-components/pull/621)
*   **Fixed Dropdown labels not displaying the selected value after a lookup data page call.**
      * Github: [PR-622](https://github.com/pegasystems/angular-sdk-components/pull/622)
*   **Fixed the undefined label error in the SimpleTableManual component.**
      * Github: [PR-624](https://github.com/pegasystems/angular-sdk-components/pull/624)
---

### **Dependencies & Infrastructure**

*   The **zone.js** package has been removed.
    * Github: [PR-565](https://github.com/pegasystems/angular-sdk-components/pull/565)
*   The following table lists the packages whose versions have been updated:

| Package | Updated version |
| :--- | :--- |
| **@pega/angular-sdk-components** | 25.1.14 |
| **@pega/angular-sdk-overrides** | 25.1.14 |

# [25.1.13](https://github.com/pegasystems/angular-sdk/tree/release/25.1.13) - Released: 12/06/2026

## Breaking changes

*   None.

## Non Breaking changes

### **Bug fixes**
*   **Fixed the issue where when you configured any action in the EmbeddedData field, and add a record, the configured fields do not appear.**
      * Github: [PR-479](https://github.com/pegasystems/angular-sdk-components/pull/479)
*   **Repeating Dynamic Layout list is reset when screen is refreshed**
      * Github: [PR-473](https://github.com/pegasystems/angular-sdk-components/pull/473)
*   **EmbeddedData field is not displayed when visibility condition is configured based on an existing field value**
      * Github: [PR-473](https://github.com/pegasystems/angular-sdk-components/pull/473)
*   **Unwanted refresh triggers on field value changes**
      * Github: [PR-473](https://github.com/pegasystems/angular-sdk-components/pull/473)
*   **Fixed the checkbox required validation issue**
      * Github: [PR-473](https://github.com/pegasystems/angular-sdk-components/pull/473)
*   **Console errors triggered when uploading attachment**
      * Github: [PR-482](https://github.com/pegasystems/angular-sdk-components/pull/482)
---

### **Dependencies & Infrastructure**

The following table lists the packages whose versions have been updated:

| Package | Updated version |
| :--- | :--- |
| **@pega/angular-sdk-components** | 25.1.13 |
| **@pega/angular-sdk-overrides** | 25.1.13 |
| **@pega/dx-component-builder-sdk** | 25.1.15 |
| **@pega/constellationjs** | 25.1.3 |


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
