import { useState, useEffect, useRef } from 'react';
import { Select, Option, FieldValueList, Text } from '@pega/cosmos-react-core';
import PropTypes from 'prop-types';

// includes in bundle
import handleEvent from "./event-utils";
import { suggestionsHandler } from './suggestions-handler';

import StyledPegaDxilMyPicklistWrapper from './styles';
import {EmailDisplay, PhoneDisplay, URLDisplay } from "@pega/cosmos-react-core";

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


export const setDefaultValue = (dropdownOptions, pConnect, propName) => {
  // calculate the default option and set it to dropdown
  const option = (dropdownOptions && dropdownOptions[0]) || {};
  const defaultValue = option.key ? option.props.value : '';
  pConnect.setValue(propName, defaultValue, defaultValue);
};

const pushPlaceholderOption = (placeholder, listSourceItems, items, pConnect) => {
  // If we have a placeholder, push that option in the list of items
  if (placeholder) {
    items.push(
      <Option key={placeholder} value=''>
        {pConnect.getLocalizedValue(placeholder)}
      </Option>
    );
  } else if (!listSourceItems) {
    // If we don't have a placeholder and our list source is empty, push a blank row option in the list of items
    items.push(<Option key='' value='' />);
  }
};


// Duplicated runtime code from Constellation Design System Component

// props passed in combination of props from property panel (config.json) and run time props from Constellation
// any default values in config.pros should be set in defaultProps at bottom of this file
const PegaDxilMyPicklist = props => {
  const {
    getPConnect,
    value,
    label,
    hideLabel,
    placeholder,
    datasource,
    listType,
    validatemessage,
    testId,
    helperText,
    additionalProps,
    displayMode,
    onRecordChange,
    variant,
    fieldMetadata,
    isTableFormatter,
    hasSuggestions
  } = props;
  const { formatter } = props;
  const pConnect = getPConnect();
  const actions = pConnect.getActionsApi();
  const propName = pConnect.getStateProps().value;
  const className = pConnect.getCaseInfo().getClassName();
  const refName = propName?.slice(propName.lastIndexOf('.') + 1);

  let { readOnly, required, disabled } = props;
  [readOnly, required, disabled] = [readOnly, required, disabled].map(
    (prop) => prop === true || (typeof prop === 'string' && prop === 'true')
  );

  const [status, setStatus] = useState(hasSuggestions ? 'pending' : undefined);

  const useIsMount = () => {
    const isMountRef = useRef(true);
    useEffect(() => {
      isMountRef.current = false;
    }, []);
    return isMountRef.current;
  };

  const isMount = useIsMount();

  const metaData = Array.isArray(fieldMetadata)
    ? fieldMetadata.filter((field) => field?.classID === className)[0]
    : fieldMetadata;
  let displayName = metaData?.datasource?.propertyForDisplayText;
  displayName = displayName?.slice(displayName.lastIndexOf('.') + 1);
  const localeContext = metaData?.datasource?.tableType === 'DataPage' ? 'datapage' : 'associated';
  const localeClass = localeContext === 'datapage' ? '@baseclass' : className;
  const localeName = localeContext === 'datapage' ? metaData?.datasource?.name : refName;
  const localePath = localeContext === 'datapage' ? displayName : '';

  const configProps = pConnect.getConfigProps();
  const items = [];
  const isDatapage = listType === 'datapage';
  let listSourceItems = isDatapage ? configProps.listOutput : datasource;

  if (isDatapage && typeof datasource === 'object' && !Array.isArray(listSourceItems)) {
    listSourceItems = datasource.source ? datasource.source : [];
  }

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

  pushPlaceholderOption(placeholder, listSourceItems, items, pConnect);

  // Loop through all of our list source items that make up the values of the dropdown

  let selectedLabel = '';
  (listSourceItems || []).forEach((item) => {
    selectedLabel =
      value !== undefined &&
      value !== null &&
      item.key !== undefined &&
      item.key !== null &&
      value.toString() === item.key.toString()
        ? item.text || item.value
        : selectedLabel;
    items.push(
      <Option key={item.key} value={item.key}>
        {isDatapage
          ? pConnect.getLocalizedValue(
              item.text,
              localePath,
              pConnect.getLocaleRuleNameFromKeys(localeClass, localeContext, localeName)
            )
          : pConnect.getLocalizedValue(
              item.value,
              localePath,
              pConnect.getLocaleRuleNameFromKeys(localeClass, localeContext, localeName)
            )}
      </Option>
    );
  });

  const isDisplayModeEnabled =
    displayMode === 'LABELS_LEFT' || displayMode === 'STACKED_LARGE_VAL' || displayMode === 'DISPLAY_ONLY';
  let firstOptionKey = '';
  let firstOptionValue = '';
  if (!placeholder && listSourceItems?.length > 0) {
    // First option isn't going to change as long as placeholder is present. Incase placeholder is not there
    // check for new option
    firstOptionKey = listSourceItems[0].key;
    firstOptionValue = listSourceItems[0].text || listSourceItems[0].value;
  }
  useEffect(() => {
    // placeholder - placeholder option configured to be shown with dropdown, empty string if not configured
    // value - value of the dropdown if set to something prior (either by pre-activity or default value etc.), empty string if nothing is set
    // selectedLabel - is value(the one above) if it is one of the option in the dropdown datasource, empty string if not
    // below code does this -
    // set dropdown value to first option if placeholder is NOT present and ((value is empty) or (value is not empty and selectedLabel is empty))
    // set dropdown value to empty if placeholder is present and value is not empty and selectedLabel is empty
    // Broken down first option(key, value) to be as dependency instead of entire items array which creates new reference on every render
    // First option is kept as dependency as setDefaultValue sets only first value from options
    if (!isDisplayModeEnabled && ((!placeholder && !value) || (!isMount && value && !selectedLabel))) {
      setDefaultValue(items, pConnect, propName);
    }
  }, [firstOptionKey, firstOptionValue, placeholder, selectedLabel, value, propName]);

  if (displayMode === 'LABELS_LEFT' || displayMode === 'DISPLAY_ONLY') {
    let displayComp = selectedLabel;
    if (isTableFormatter && formatExists(formatter)) {
      displayComp = textFormatter(formatter, selectedLabel);
    }
    if (selectedLabel === '') {
      displayComp = value || <span aria-hidden='true'>&ndash;&ndash;</span>;
    }

    return displayMode === 'DISPLAY_ONLY' ? (
      <StyledPegaDxilMyPicklistWrapper>
      displayComp
      </StyledPegaDxilMyPicklistWrapper>
    ) : (
      <StyledPegaDxilMyPicklistWrapper>
      <FieldValueList
        variant={hideLabel ? 'stacked' : variant}
        data-testid={testId}
        fields={[
          {
            id: '1',
            name: hideLabel ? '' : label,
            value: displayComp
          }
        ]}
      />
      </StyledPegaDxilMyPicklistWrapper>
    );
  }

  if (displayMode === 'STACKED_LARGE_VAL') {
    selectedLabel = selectedLabel === '' ? value : selectedLabel;
    const isValDefined = typeof selectedLabel !== 'undefined' && selectedLabel !== '';
    const val = isValDefined ? (
      <Text variant='h1' as='span'>
        {selectedLabel}
      </Text>
    ) : (
      ''
    );
    return (
      <StyledPegaDxilMyPicklistWrapper>
      <FieldValueList
        variant='stacked'
        data-testid={testId}
        fields={[{ id: '2', name: hideLabel ? '' : label, value: val }]}
      />
      </StyledPegaDxilMyPicklistWrapper>
    );
  }

  const onResolveSuggestionHandler = (accepted) => {
    suggestionsHandler(accepted, pConnect, setStatus);
  };

  return (
    <StyledPegaDxilMyPicklistWrapper>
    <Select
      {...additionalProps}
      label={label}
      labelHidden={hideLabel}
      info={validatemessage || helperText}
      status={status}
      data-testid={testId}
      key={getPConnect().getRawMetadata().config.value}
      value={value}
      disabled={disabled}
      required={required}
      readOnly={readOnly}
      onChange={(event) => {
        handleEvent(actions, 'changeNblur', propName, event.target.value);
        if (hasSuggestions) {
          pConnect.ignoreSuggestion();
          setStatus(undefined);
        }
        if (onRecordChange) {
          onRecordChange(event);
        }
      }}
      onBlur={(event) => {
        pConnect.getValidationApi().validate(event.target.value);
      }}
      onResolveSuggestion={onResolveSuggestionHandler}
    >
      {items}
    </Select>
    </StyledPegaDxilMyPicklistWrapper>
  );
}

PegaDxilMyPicklist.defaultProps = {
  value: '',
  placeholder: '',
  validatemessage: '',
  hideLabel: false,
  disabled: false,
  readOnly: false,
  required: false,
  testId: null,
  helperText: '',
  datasource: [],
  listType: '',
  additionalProps: {},
  fieldMetadata: {},
  displayMode: null,
  onRecordChange: null,
  variant: 'inline',
  formatter: '',
  isTableFormatter: false,
  hasSuggestions: false
};

PegaDxilMyPicklist.propTypes = {
  getPConnect: PropTypes.func.isRequired,
  value: PropTypes.string,
  placeholder: PropTypes.string,
  label: PropTypes.string.isRequired,
  hideLabel: PropTypes.bool,
  datasource: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.any),
    PropTypes.shape({
      source: PropTypes.arrayOf(PropTypes.any)
    })
  ]),
  listType: PropTypes.string,
  validatemessage: PropTypes.string,
  disabled: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  readOnly: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  required: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  testId: PropTypes.string,
  helperText: PropTypes.string,
  additionalProps: PropTypes.objectOf(PropTypes.any),
  fieldMetadata: PropTypes.objectOf(PropTypes.any),
  displayMode: PropTypes.string,
  onRecordChange: PropTypes.func,
  variant: PropTypes.string,
  formatter: PropTypes.string,
  isTableFormatter: PropTypes.bool,
  hasSuggestions: PropTypes.bool
};

export default PegaDxilMyPicklist;
