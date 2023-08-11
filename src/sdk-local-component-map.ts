// Statically load all "local" components that aren't yet in the npm package
import { DateComponent } from "./app/_components/override-sdk/field/date/date.component";
import { TextInputComponent } from "./app/_components/override-sdk/field/text-input/text-input.component";
/*import end - DO NOT REMOVE*/

// localSdkComponentMap is the JSON object where we'll store the components that are
// found locally. If not found here, we'll look in the Pega-provided component map

const localSdkComponentMap = {
  'Date': DateComponent,
  'TextInput': TextInputComponent
  /*map end - DO NOT REMOVE*/
};

export default localSdkComponentMap;
