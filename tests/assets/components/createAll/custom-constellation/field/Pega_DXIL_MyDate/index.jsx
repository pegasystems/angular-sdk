/* eslint-disable no-undef */
import { useEffect, useState } from 'react';
import { DateInput, FieldValueList, DateTimeDisplay, Text,  } from '@pega/cosmos-react-core';
import PropTypes from 'prop-types';
import FormattedText from "./FormattedText.jsx";

import StyledPegaDxilMyDateWrapper from './styles';

// includes in bundle
import {
  datetimedisplayformatter,
  formatExists,
  getFullYear,
  getMaxDate,
  getMinDate,
  datetimeFireChangeBlurEvents,
  getDateFormat
} from "./date.js";
import { suggestionsHandler } from './suggestions-handler';

// Duplicated runtime code from Constellation Design System Component

// props passed in combination of props from property panel (config.json) and run time props from Constellation
// any default values in config.pros should be set in defaultProps at bottom of this file
const PegaDxilMyDate = props => {
  const {
    getPConnect,
    value,
    validatemessage,
    label,
    hideLabel,
    helperText,
    nextYearRange,
    previousYearRange,
    showWeekNumber,
    testId,
    showAsFormattedText,
    additionalProps,
    displayMode,
    variant,
    hasSuggestions
   } = props;

  let {formatter} = props;
  const pConn = getPConnect();
  const actions = pConn.getActionsApi();
  const propName = pConn?.getStateProps()?.value;

 let { readOnly, required, disabled } = props;
  [readOnly, required, disabled] = [readOnly, required, disabled].map(
    (prop) => prop === true || (typeof prop === "string" && prop === "true")
  );

  const [status, setStatus] = useState(hasSuggestions ? 'pending' : '');

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

  // calculate min and max range of calendar
  const currentYear = getFullYear();
  const yearFromValue = getFullYear(value);
  const maxDate = getMaxDate(
    parseInt(nextYearRange, 10),
    currentYear,
    yearFromValue
  );
  const minDate = getMinDate(
    parseInt(previousYearRange, 10),
    currentYear,
    yearFromValue
  );

  const onResolveSuggestionHandler = (accepted) => {
    suggestionsHandler(accepted, pConn, setStatus);
  };



  function handleBlur(onBlurValue) {
    const { valueAsISOString: date, state: errorState } = onBlurValue;
    const trimmedDate = date ? date.substring(0, date.indexOf('T')) : date;
    datetimeFireChangeBlurEvents(errorState, value, trimmedDate, actions, propName, pConn);
    const isValueChanged = !(value === undefined && trimmedDate === '') && value !== trimmedDate;
    if (hasSuggestions && isValueChanged) {
      pConn.ignoreSuggestion();
    }
  }

  function handleChange(onChangeValue) {
    const { valueAsISOString: date } = onChangeValue;
    const trimmedDate = date ? date.substring(0, date.indexOf('T')) : date;
    if (hasSuggestions && value !== trimmedDate) {
      setStatus(undefined);
    }
    pConn.clearErrorMessages({
      property: propName
    })
  }

  if (displayMode === 'LABELS_LEFT' || displayMode === 'STACKED_LARGE_VAL' || displayMode === 'DISPLAY_ONLY') {
    let variantValue = "date";
     let formatValue = "long";
     if(pConn && pConn.getConfigProps()){
      const runtimeformatter = pConn.getConfigProps()?.formatter;
      if(formatter !== runtimeformatter){
        formatter = runtimeformatter;
      }
    }
     if(formatter !== "" && formatExists(formatter)){
      const {variantVal,formatVal} = datetimedisplayformatter(formatter);
       variantValue = variantVal;
       formatValue = formatVal;
    }
    const displayComp = (
      <DateTimeDisplay
      variant={variantValue}
      format={formatValue}
        value={value}
      />
    );
    switch(displayMode){
      case 'DISPLAY_ONLY': {
        return ( <StyledPegaDxilMyDateWrapper> displayComp </StyledPegaDxilMyDateWrapper>);
      }
      case "LABELS_LEFT" : {
        return (
          <StyledPegaDxilMyDateWrapper>
          <FieldValueList
            variant={hideLabel ? "stacked" : variant}
            data-testid={testId}
            fields={[{ id: '1', name: hideLabel ? "" :label, value: displayComp }]}
          />
          </StyledPegaDxilMyDateWrapper>

        );
      }
      case "STACKED_LARGE_VAL" : {
        return (
          <StyledPegaDxilMyDateWrapper>
          <FieldValueList
            variant='stacked'
            data-testid={testId}
            fields={[{ id: '2', name: hideLabel ? "" :label, value: <Text variant='h1' as='span'>{displayComp}</Text> }]}
          />
          </StyledPegaDxilMyDateWrapper>

        );
      }
      // no default
    }
  }


  let dateComponent;

  if (readOnly && showAsFormattedText) {
    const environmentInfo = PCore.getEnvironmentInfo();
    const locale = environmentInfo && environmentInfo.getLocale();
    const textAdditionalProps = {
      format: getDateFormat(locale),
      fieldType: 'Date'
    };
    dateComponent = (
      <StyledPegaDxilMyDateWrapper>
      <FormattedText
        formatType='date'
        value={value}
        label={label}
        hideLabel={hideLabel}
        testId={testId}
        additionalProps={textAdditionalProps}
        customFormat={getDateFormat(locale)}
      />
      </StyledPegaDxilMyDateWrapper>
    );
  } else {
    dateComponent = (
      <StyledPegaDxilMyDateWrapper>
      <DateInput
        {...additionalProps}
        label={label}
        labelHidden={hideLabel}
        info={validatemessage || helperText}
        status={status}
        value={value || undefined}
        disabled={disabled}
        readOnly={readOnly}
        required={required}
        showWeekNumber={showWeekNumber}
        min={minDate}
        max={maxDate}
        data-testid={testId}
        onFocus={actions.onFocus}
        onChange={handleChange}
        onBlur={handleBlur}
        onResolveSuggestion={onResolveSuggestionHandler}
      />
      </StyledPegaDxilMyDateWrapper>
    );
  }
  return dateComponent;
}



PegaDxilMyDate.defaultProps = {
  value: undefined,
  validatemessage: "",
  helperText: "",
  hideLabel: false,
  disabled: false,
  readOnly: false,
  required: false,
  showWeekNumber: false,
  nextYearRange: "",
  previousYearRange: "",
  testId: null,
  showAsFormattedText: false,
  additionalProps: {},
  displayMode: null,
  variant: "inline",
  formatter: "defaultDate",
  hasSuggestions: false
};

PegaDxilMyDate.propTypes = {
  value: PropTypes.string,
  label: PropTypes.string.isRequired,
  hideLabel: PropTypes.bool,
  getPConnect: PropTypes.func.isRequired,
  validatemessage: PropTypes.string,
  helperText: PropTypes.string,
  disabled: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  readOnly: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  required: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  showWeekNumber: PropTypes.bool,
  nextYearRange: PropTypes.string,
  previousYearRange: PropTypes.string,
  testId: PropTypes.string,
  showAsFormattedText: PropTypes.bool,
  additionalProps: PropTypes.objectOf(PropTypes.any),
  displayMode: PropTypes.string,
  variant: PropTypes.string,
  formatter: PropTypes.string,
  hasSuggestions: PropTypes.bool
};

export default PegaDxilMyDate;
