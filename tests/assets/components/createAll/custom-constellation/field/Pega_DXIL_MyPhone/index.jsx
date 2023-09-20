import { useState, useEffect, useRef } from 'react';
import {
  PhoneInput as CosmosPhone,
  getPhoneNumberParts,
  PhoneDisplay,
  FieldValueList,
  Text,
  EmailDisplay, URLDisplay
} from '@pega/cosmos-react-core';
import PropTypes from 'prop-types';

// includes in bundle
import handleEvent from "./event-utils";
import { suggestionsHandler } from './suggestions-handler';

import StyledPegaDxilMyPhoneWrapper from './styles';

export const formatExists = (formatterVal) => {
    const formatterValues = [
      "TextInput",
      "WorkStatus",
      "RichText",
      "Email",
      "Phone",
      "URL",
      "Operator"
    ];
    let isformatter = false;
    if (formatterValues.includes(formatterVal)) {
      isformatter = true;
    }
    return isformatter;
  };


export const textFormatter = (formatter,value) => {
  let displayComponent = null;
  switch(formatter){
    case "TextInput" : {
      displayComponent = value;
      break;
    }
    case "Email" : {
      displayComponent = (<EmailDisplay value={value} displayText={value} variant="link" />);
      break;
    }
    case "Phone" : {
      displayComponent = (<PhoneDisplay value={value} variant="link" />);
      break;
    }
    case "URL" : {
      displayComponent = (<URLDisplay target="_blank" value={value} displayText={value} variant="link" />);
      break;
    }
    // no default
  }
  return displayComponent;
};



// Duplicated runtime code from Constellation Design System Component

// props passed in combination of props from property panel (config.json) and run time props from Constellation
// any default values in config.pros should be set in defaultProps at bottom of this file
const PegaDxilMyPhone = props => {
  const {
    getPConnect,
    value,
    showCountryCode,
    placeholder,
    validatemessage,
    label,
    hideLabel,
    helperText,
    datasource,
    testId,
    displayMode,
    additionalProps,
    variant,
    isTableFormatter,
    hasSuggestions
  } = props;
  const { formatter } = props;
  const pConn = getPConnect();
  const actions = pConn.getActionsApi();
  const propName = pConn.getStateProps().value;
  const hasValueChange = useRef(false);

 let callingCodesList = [];
  if (datasource?.source?.length > 0) {
    datasource.source.forEach((element) => {
      callingCodesList.push(element.value);
    });
  } else {
    callingCodesList = ['+1']; // if no datasource is present we default to show only US country code
  }

  // BUG-547602: Temporary type coercion for 8.5 until DXAPIs are enhanced to pass original pxViewMetadata JSON, respecting boolean primitives
  let { readOnly, required, disabled } = props;
  [readOnly, required, disabled] = [readOnly, required, disabled].map(
    (prop) => prop === true || (typeof prop === 'string' && prop === 'true')
  );

  const [inputValue, setInputValue] = useState(value);
  useEffect(() => setInputValue(value), [value]);

  const [status, setStatus] = useState(hasSuggestions ? 'pending' : undefined);
  useEffect(() => {
    if (validatemessage !== '') {
      setStatus('error');
    }
    if (hasSuggestions) {
      setStatus('pending');
    } else if (!hasSuggestions && status !== 'success') {
      setStatus(validatemessage !== '' ? 'error' : undefined);
    }
  }, [validatemessage, hasSuggestions]);

  // funtion to exclude country code from phone number
  function getPhoneNumberAlone(phoneNumber) {
    const phoneNumberParts = getPhoneNumberParts(phoneNumber, callingCodesList);
    return phoneNumberParts && phoneNumberParts[1];
  }

  function handleChangeBlur(enteredValue, eventType) {
    if (!getPhoneNumberAlone(enteredValue)) {
      enteredValue = '';
    }
    handleEvent(actions, eventType, propName, enteredValue);
  }

  let displayComp = null;
  if (displayMode) {
    displayComp = <PhoneDisplay value={value} variant='link' />;
  }

  if (displayMode === 'LABELS_LEFT' || displayMode === 'DISPLAY_ONLY') {
    if (isTableFormatter && formatExists(formatter)) {
      displayComp = textFormatter(formatter, value);
    }
    return displayMode === 'DISPLAY_ONLY' ? (
      <StyledPegaDxilMyPhoneWrapper>
      displayComp
      </StyledPegaDxilMyPhoneWrapper>
    ) : (
      <StyledPegaDxilMyPhoneWrapper>
      <FieldValueList
        variant={hideLabel ? 'stacked' : variant}
        data-testid={testId}
        fields={[{ id: '1', name: hideLabel ? '' : label, value: displayComp }]}
      />
      </StyledPegaDxilMyPhoneWrapper>
    );
  }

  if (displayMode === 'STACKED_LARGE_VAL') {
    return (
      <StyledPegaDxilMyPhoneWrapper>
      <FieldValueList
        variant='stacked'
        data-testid={testId}
        fields={[
          {
            id: '2',
            name: hideLabel ? '' : label,
            value: (
              <Text variant='h1' as='span'>
                {displayComp}
              </Text>
            )
          }
        ]}
      />
      </StyledPegaDxilMyPhoneWrapper>
    );
  }

  const onResolveSuggestionHandler = (accepted) => {
    suggestionsHandler(accepted, pConn, setStatus);
  };

  return (
    <StyledPegaDxilMyPhoneWrapper>
    <CosmosPhone
      {...additionalProps}
      label={label}
      info={validatemessage || helperText}
      value={inputValue}
      labelHidden={hideLabel}
      status={status}
      showCountryCode={showCountryCode}
      callingCodesList={callingCodesList}
      placeholder={placeholder}
      disabled={disabled}
      readOnly={readOnly}
      required={required}
      data-testid={testId}
      onChange={(enteredValue) => {
        if (hasSuggestions) {
          setStatus(undefined);
        }
        setInputValue(enteredValue);
        if (value !== enteredValue) {
          handleEvent(actions, 'change', propName, enteredValue);
        }
        hasValueChange.current = true;
      }}
      onBlur={(enteredValue) => {
        if (!value || hasValueChange.current) {
          handleChangeBlur(enteredValue, 'blur');
          if (hasSuggestions) {
            pConn.ignoreSuggestion();
          }
          hasValueChange.current = false;
        }
      }}
      onResolveSuggestion={onResolveSuggestionHandler}
    />
    </StyledPegaDxilMyPhoneWrapper>
  );
}

PegaDxilMyPhone.defaultProps = {
  value: '',
  placeholder: '',
  validatemessage: '',
  helperText: '',
  datasource: undefined,
  hideLabel: false,
  disabled: false,
  readOnly: false,
  required: false,
  showCountryCode: true,
  testId: null,
  displayMode: null,
  additionalProps: {},
  variant: 'inline',
  formatter: '',
  isTableFormatter: false,
  hasSuggestions: false
};

PegaDxilMyPhone.propTypes = {
  value: PropTypes.string,
  placeholder: PropTypes.string,
  datasource: PropTypes.objectOf(PropTypes.any),
  label: PropTypes.string.isRequired,
  hideLabel: PropTypes.bool,
  getPConnect: PropTypes.func.isRequired,
  validatemessage: PropTypes.string,
  helperText: PropTypes.string,
  showCountryCode: PropTypes.bool,
  disabled: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  readOnly: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  required: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  testId: PropTypes.string,
  displayMode: PropTypes.string,
  additionalProps: PropTypes.objectOf(PropTypes.any),
  variant: PropTypes.string,
  formatter: PropTypes.string,
  isTableFormatter: PropTypes.bool,
  hasSuggestions: PropTypes.bool
};

export default PegaDxilMyPhone;
