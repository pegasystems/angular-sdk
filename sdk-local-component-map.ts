// Statically load all "local" components that aren't yet in the npm package

import { WssNavBarComponent } from 'src/app/_components/override-sdk/template/wss-nav-bar/wss-nav-bar.component';
import { BannerComponent } from 'src/app/_components/override-sdk/designSystemExtension/banner/banner.component';
import { WssQuickCreateComponent } from 'src/app/_components/override-sdk/designSystemExtension/wss-quick-create/wss-quick-create.component';
import { QuickCreateComponent } from 'src/app/_components/override-sdk/widget/quick-create/quick-create.component';
import { TodoComponent } from './src/app/_components/override-sdk/widget/todo/todo.component';
import { DropdownComponent } from './src/app/_components/override-sdk/field/dropdown/dropdown.component';
import { TextAreaComponent } from './src/app/_components/override-sdk/field/text-area/text-area.component';
import { DateComponent } from './src/app/_components/override-sdk/field/date/date.component';
import { TimeComponent } from './src/app/_components/override-sdk/field/time/time.component';
import { MultiStepComponent } from './src/app/_components/override-sdk/infra/multi-step/multi-step.component';
import { ActionButtonsComponent } from './src/app/_components/override-sdk/infra/action-buttons/action-buttons.component';
import { ListViewComponent } from './src/app/_components/override-sdk/template/list-view/list-view.component';
import { DataReferenceComponent } from './src/app/_components/override-sdk/template/data-reference/data-reference.component';
import { ConfirmationComponent } from './src/app/_components/override-sdk/template/confirmation/confirmation.component';
import { TextInputComponent } from './src/app/_components/override-sdk/field/text-input/text-input.component';
import { IntegerComponent } from './src/app/_components/override-sdk/field/integer/integer.component';
/* import end - DO NOT REMOVE */

// localSdkComponentMap is the JSON object where we'll store the components that are
// found locally. If not found here, we'll look in the Pega-provided component map

const localSdkComponentMap = {
  WssNavBar: WssNavBarComponent,
  Banner: BannerComponent,
  WssQuickCreate: WssQuickCreateComponent,
  QuickCreate: QuickCreateComponent,
  Todo: TodoComponent,
  Dropdown: DropdownComponent,
  TextArea: TextAreaComponent,
  Date: DateComponent,
  Time: TimeComponent,
  MultiStep: MultiStepComponent,
  ActionButtons: ActionButtonsComponent,
  ListView: ListViewComponent,
  DataReference: DataReferenceComponent,
  Confirmation: ConfirmationComponent,
  Pega_Extensions_CaseLauncher: QuickCreateComponent,
  TextInput: TextInputComponent,
  Integer: IntegerComponent
  /* map end - DO NOT REMOVE */
};

export default localSdkComponentMap;
