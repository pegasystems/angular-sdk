import {
  Checkbox as CosmosCheckbox,
  CheckboxGroup,
  FieldValueList,
  Text
} from "@pega/cosmos-react-core";
import PropTypes from "prop-types";

// includes in bundle
import handleEvent from "./event-utils";

import StyledPegaDxilMyBooleanWrapper from './styles';

// Duplicated runtime code from Constellation Design System Component

// props passed in combination of props from property panel (config.json) and run time props from Constellation
// any default values in config.pros should be set in defaultProps at bottom of this file
const PegaDxilMyBoolean = props => {
  const {
    getPConnect,
    value,
    label,
    helperText,
    caption,
    validatemessage,
    hideLabel,
    testId,
    additionalProps,
    displayMode,
    variant,
    trueLabel,
    falseLabel
  } = props;
  const pConn = getPConnect();
  const actions = pConn.getActionsApi();
  const propName = pConn.getStateProps().value;

  let { readOnly, required, disabled } = props;
  [readOnly, required, disabled] = [readOnly, required, disabled].map(
    (prop) => prop === true || (typeof prop === 'string' && prop === 'true')
  );

  let status = "";
  if (validatemessage !== "") {
    status = "error";
  }

  const aCosmosCheckbox = (
    <CosmosCheckbox
      {...additionalProps}
      className="standard"
      checked={value}
      label={caption}
      disabled={disabled}
      readOnly={readOnly}
      required={required}
      onClick={actions.onClick}
      onChange={(event) => {
        handleEvent(actions, "changeNblur", propName, event.target.checked);
      }}
      onBlur={(event) => {
        pConn.getValidationApi().validate(event.target.checked);
      }}
      data-testid={testId}
    />
  );

  const parentTestId = testId ? `${testId}-parent` : testId;

  let displayComponent;
  if (displayMode) {
    displayComponent = <PegaDxilMyBoolean  value={value} trueLabel={trueLabel} falseLabel={falseLabel} />;
  }

  if (displayMode === 'DISPLAY_ONLY') {
    return ( <StyledPegaDxilMyBooleanWrapper> displayComponent </StyledPegaDxilMyBooleanWrapper>);
  }

  if (displayMode === "LABELS_LEFT") {
    return (
      <StyledPegaDxilMyBooleanWrapper>
      <FieldValueList
        variant={hideLabel ? 'stacked' : variant}
        data-testid={testId}
        fields={[{ id: '1', name: hideLabel ? '' : caption, value: displayComponent }]}
      />
     </StyledPegaDxilMyBooleanWrapper>
    );
  }

  if (displayMode === "STACKED_LARGE_VAL") {
    return (
      <StyledPegaDxilMyBooleanWrapper>
      <FieldValueList
        variant='stacked'
        data-testid={testId}
        fields={[
          {
            id: '2',
            name: hideLabel ? '' : caption,
            value: (
              <Text variant='h1' as='span'>
                {displayComponent}
              </Text>
            )
          }
        ]}
      />
      </StyledPegaDxilMyBooleanWrapper>
    );
  }


  return (
    <StyledPegaDxilMyBooleanWrapper>
    <CheckboxGroup
      label={label}
      labelHidden={hideLabel}
      data-testid={parentTestId}
      info={validatemessage || helperText}
      status={status}
    >
      {aCosmosCheckbox}
    </CheckboxGroup>
    </StyledPegaDxilMyBooleanWrapper>
  );


};


PegaDxilMyBoolean.defaultProps = {
  validatemessage: '',
  value: false,
  label: '',
  hideLabel: false,
  helperText: '',
  disabled: false,
  readOnly: false,
  required: false,
  testId: null,
  additionalProps: {},
  displayMode: null,
  variant: 'inline',
  displayValue: 'Yes/No',
  trueLabel: '',
  falseLabel: ''
};

PegaDxilMyBoolean.propTypes = {
  getPConnect: PropTypes.func.isRequired,
  validatemessage: PropTypes.string,
  label: PropTypes.string,
  hideLabel: PropTypes.bool,
  helperText: PropTypes.string,
  value: PropTypes.bool,
  caption: PropTypes.string.isRequired,
  disabled: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  readOnly: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  required: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  testId: PropTypes.string,
  additionalProps: PropTypes.objectOf(PropTypes.any),
  displayMode: PropTypes.string,
  variant: PropTypes.string,
  displayValue: PropTypes.string,
  trueLabel: PropTypes.string,
  falseLabel: PropTypes.string
};

export default PegaDxilMyBoolean;
