import Boolean from "./Boolean";


export default {
  ...Boolean
};



export function format(value, type) {
  let formattedValue;

  switch (type?.toLowerCase()) {


    case "boolean":
    case "checkbox": {
      formattedValue = Boolean.TrueFalse(value, { allowEmpty: false });
      break;
    }

    default:
      formattedValue = value;
  }
  return formattedValue;
}
