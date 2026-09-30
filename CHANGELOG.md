# [26.1.10](https://github.com/pegasystems/angular-sdk/tree/release/26.1.10)

### **Features**
*   **Replaced the TinyMCE dependency with Tiptap for rich text editing capabilities.**
    * Github: [PR-545](https://github.com/pegasystems/angular-sdk-components/pull/545)
*   Support Embedded attachment in simple table manual.
    * Github: [PR-547](https://github.com/pegasystems/angular-sdk-components/pull/547)
*   **Added support for instructions in the DefaultForm template.**
    * Github: [PR-548](https://github.com/pegasystems/angular-sdk-components/pull/548)
*   **Added support for conditional Add, Edit, and Delete actions, including record-level conditions, in editable EmbeddedData table.**
    * Github: [PR-553](https://github.com/pegasystems/angular-sdk-components/pull/553)
*   **Added support for contextual warning messages in field components.**
    * Github: [PR-559](https://github.com/pegasystems/angular-sdk-components/pull/559)
*   **Added Support for DataReference field value rendering in the Details template.**
    * Github: [PR-562](https://github.com/pegasystems/angular-sdk-components/pull/562)
*   **DataReference as Autocomplete supports Secondary Text.**
    * Github: [PR-569](https://github.com/pegasystems/angular-sdk-components/pull/569)
*   **Added left and right alignment support for vertical multi-step assignment navigation.**
    * Github: [PR-576](https://github.com/pegasystems/angular-sdk-components/pull/576)
*   **Added support for Data Object actions in the case view, and Submit/Cancel controls in the Data Object modal.**
    * Github: [PR-577](https://github.com/pegasystems/angular-sdk-components/pull/577)
*   **DataReference as Autocomplete supports grouping.**
    * Github: [PR-578](https://github.com/pegasystems/angular-sdk-components/pull/578)
*   **Added support for primary fields in EmbeddedData and query params for refreshFor action.**
    * Github: [PR-584](https://github.com/pegasystems/angular-sdk-components/pull/584)
*   **Added support for creating new records for the Autocomplete DataReference and CaseReference components.**
    * Github: [PR-585](https://github.com/pegasystems/angular-sdk-components/pull/585)
*   **Added support for the authored placeholder in the Dropdown component, falling back to 'Select...' when not configured.**
    * Github: [PR-594](https://github.com/pegasystems/angular-sdk-components/pull/594)
*   **Fixed an issue where column header labels in the SimpleTableManual and ListView table were not localized.**
    * Github: [PR-603](https://github.com/pegasystems/angular-sdk-components/pull/603)

### **Bug fixes**
*   **Fixed DataReference not making an api call on state change.**
      * Github: [PR-486](https://github.com/pegasystems/angular-sdk-components/pull/486)
*   **Fixed the issue where views are not rendering in Details Template.**
      * Github: [PR-533](https://github.com/pegasystems/angular-sdk-components/pull/533)
*   **Fixed an issue where FieldGroup visibility was not worked correctly.**
      * Github: [PR-538](https://github.com/pegasystems/angular-sdk-components/pull/538)
*   **Fixed an issue where dynamic headings were not displayed in EmbeddedData repeating views.**
      * Github: [PR-540](https://github.com/pegasystems/angular-sdk-components/pull/540)
*   **Fixed the issue where filtering did not work on empty tables and corrected the filter pop-up styling.**
      * Github: [PR-543](https://github.com/pegasystems/angular-sdk-components/pull/543)
*   **Fixed DateTime component theme colors.**
      * Github: [PR-561](https://github.com/pegasystems/angular-sdk-components/pull/561)
*   **Fixed label display in Details templates.**
      * Github: [PR-568](https://github.com/pegasystems/angular-sdk-components/pull/568)
*   **Fixed the issue where the DataReference value was displayed as a SemanticLink in the CaseSummary view.**
      * Github: [PR-572](https://github.com/pegasystems/angular-sdk-components/pull/572)
      * Github: [PR-591](https://github.com/pegasystems/angular-sdk-components/pull/591)
*   **Displays the configured custom label for the Add button.**
      * Github: [PR-574](https://github.com/pegasystems/angular-sdk-components/pull/574)
*   **Fixed collapsible and expandable behavior in FieldGroup.**
      * Github: [PR-579](https://github.com/pegasystems/angular-sdk-components/pull/579)
*   **Fixed the issue where changing a property value on the screen was not reflected in the list below.**
      * Github: [PR-581](https://github.com/pegasystems/angular-sdk-components/pull/581)
*   **Fixed search form label issue, fallback to inherited label when config label is missing.**
      * Github: [PR-582](https://github.com/pegasystems/angular-sdk-components/pull/582)
*   **Refactored Details templates to correctly render regions and child components.**
      * Github: [PR-586](https://github.com/pegasystems/angular-sdk-components/pull/586)
*   **Fixed the missing required-field asterisk indicator for the Multiselect combobox.**
      * Github: [PR-595](https://github.com/pegasystems/angular-sdk-components/pull/595)
*   **Fixed the DateTime component showing '[object Object]' for invalid input and defaulting to the current date and time on blur.**
      * Github: [PR-600](https://github.com/pegasystems/angular-sdk-components/pull/600)
*   **Fixed the issue where required validation was not triggered in the Rich Text Editor.**
      * Github: [PR-601](https://github.com/pegasystems/angular-sdk-components/pull/601)

### **Dependencies & Infrastructure**

The following table lists the packages whose versions have been updated:

| Package | Updated version |
| :--- | :--- |
| **@pega/angular-sdk-components** | 26.1.10 |
| **@pega/angular-sdk-overrides** | 26.1.10 |
| **@pega/dx-component-builder-sdk** | 26.1.11 |
| **@pega/constellationjs** | 26.1.0 |
| **@pega/auth** | 1.0.0 |
| **@pega/cosmos-react-condition-builder** | 9.23.4 |
| **@pega/cosmos-react-core** | 9.23.4 |
| **@pega/cosmos-react-work** | 9.23.4 |
| **@angular-builders/custom-webpack** | 21.1.0 |
| **@angular-devkit/build-angular** | 21.2.3 |
| **@angular-devkit/core** | 21.2.3 |
| **@angular/cli** | 21.2.3 |
| **@chromatic-com/storybook** | 5.3.1 |
| **@eslint-react/eslint-plugin** | 5.23.0 |
| **@eslint/js** | 10.0.1 |
| **@playwright/test** | 1.63.0 |
| **@storybook/addon-a11y** | 10.6.0 |
| **@storybook/addon-docs** | 10.6.0 |
| **@storybook/addon-links** | 10.6.0 |
| **@storybook/angular** | 10.6.0 |
| **@storybook/react** | 10.6.0 |
| **@storybook/react-webpack5** | 10.6.0 |
| **@types/jasmine** | 6.0.0 |
| **@types/node** | 24.0.0 |
| **@types/styled-components** | 5.1.36 |
| **compressing** | 2.1.3 |
| **copy-webpack-plugin** | 14.0.0 |
| **eslint** | 10.11.0 |
| **eslint-plugin-jest** | 29.16.6 |
| **eslint-plugin-sonarjs** | 4.2.2 |
| **fs-extra** | 11.4.1 |
| **jasmine-core** | 7.0.2 |
| **jest** | 30.5.2 |
| **jest-environment-jsdom** | 30.5.2 |
| **karma** | 6.4.4 |
| **karma-jasmine-html-reporter** | 2.3.0 |
| **postcss** | 8.5.28 |
| **prettier** | 3.9.9 |
| **replace-in-file** | 9.0.0 |
| **rxjs** | 7.8.2 |
| **storybook** | 10.6.0 |
| **style-loader** | 4.0.0 |
| **styled-components** | 6.3.12 |
| **ts-loader** | 9.6.2 |
| **typescript-eslint** | 8.71.0 |
| **webpack** | 5.111.1 |

The following packages have been removed:

*   **@angular/language-service**, **@pega/configs**, **@storybook/addon-essentials**, **@storybook/addon-interactions**, **core-js**, **eslint-plugin-import**, **eslint-plugin-react**, **eslint-plugin-react-hooks**, **stylelint**, **tinymce**, **zone.js**


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
