import { useState, useEffect, useRef } from 'react';
import { NumberInput, NumberDisplay, Slider, FieldValueList, CurrencyDisplay, Text } from '@pega/cosmos-react-core';
import PropTypes from 'prop-types';

// includes in bundle
import handleEvent from "./event-utils";
import { suggestionsHandler } from './suggestions-handler';

import StyledPegaDxilMyIntegerWrapper from './styles';


// Duplicated runtime code from Constellation Design System Component

// props passed in combination of props from property panel (config.json) and run time props from Constellation
// any default values in config.pros should be set in defaultProps at bottom of this file
const PegaDxilMyInteger = props => {
  const {
    getPConnect,
    value,
    defaultValue,
    placeholder,
    validatemessage,
    label,
    hideLabel,
    helperText,
    testId,
    displayMode,
    displayAs,
    showInput,
    min,
    max,
    step,
    showTicks,
    additionalProps,
    variant,
    formatter,
    negative,
    notation,
    isTableFormatter,
    hasSuggestions
  } = props;
  let { showGroupSeparators } = props;
  let { currencyDisplay } = props;
  const pConn = getPConnect();
  const actions = pConn.getActionsApi();
  const propName = pConn.getStateProps().value;
  const [integerValue, setIntegerValue] = useState(value?.toString());
  const sliderDefaultValue = !defaultValue && defaultValue !== 0 ? max : defaultValue;
  const hasValueChange = useRef(false);


  let { readOnly, required, disabled } = props;
  [readOnly, required, disabled] = [readOnly, required, disabled].map(
    (prop) => prop === true || (typeof prop === 'string' && prop === 'true')
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

  useEffect(() => {
    setIntegerValue(value?.toString());
  }, [value]);

  useEffect(() => {
    if (displayAs === 'slider' && value === '') {
      handleEvent(actions, 'change', propName, sliderDefaultValue);
    }
  }, []);

  const { decimalPrecision, currencyDecimalPrecision, currencyISOCode } = props;
  let noOfDecimals = parseInt(decimalPrecision, 10);
  if (Number.isNaN(noOfDecimals)) noOfDecimals = undefined;
  let noOfFractionDigits = currencyDecimalPrecision === 'auto' ? undefined : parseInt(currencyDecimalPrecision, 10);
  let unit;
  let unitPlacement;

  if (['LABELS_LEFT', 'STACKED_LARGE_VAL', 'DISPLAY_ONLY'].includes(displayMode)) {
    switch (formatter) {
      case 'Decimal': {
        break;
      }
      case 'Percentage': {
        showGroupSeparators = false;
        unit = '%';
        unitPlacement = 'after';
        break;
      }
      case 'Decimal-Auto': {
        noOfDecimals = Number.isInteger(integerValue) ? 0 : 2;
        break;
      }
      default: {
        noOfDecimals = 0;
        break;
      }
    }

    if (isTableFormatter && displayMode === 'LABELS_LEFT') {
      showGroupSeparators = true;
      noOfFractionDigits = undefined;
      if (formatter === 'Currency-Code') {
        currencyDisplay = 'code';
      }
    }


    const displayComp =
      formatter === 'Currency' || formatter === 'Currency-Code' ? (
        <CurrencyDisplay
          value={integerValue}
          currencyISOCode={currencyISOCode}
          formattingOptions={{
            groupSeparators: showGroupSeparators,
            fractionDigits: noOfFractionDigits,
            currency: currencyDisplay,
            negative,
            notation: negative === 'parentheses' ? 'standard' : notation
          }}
        />
      ) : (
        <NumberDisplay
          value={integerValue}
          formattingOptions={{
            fractionDigits: noOfDecimals,
            groupSeparators: showGroupSeparators,
            notation
          }}
          unit={unit}
          unitPlacement={unitPlacement}
        />
      );


    switch (displayMode) {
      case 'DISPLAY_ONLY': {
        return (<StyledPegaDxilMyIntegerWrapper> displayComp </StyledPegaDxilMyIntegerWrapper>);
      }
      case 'LABELS_LEFT': {
        return (
          <StyledPegaDxilMyIntegerWrapper>
          <FieldValueList
            variant={hideLabel ? 'stacked' : variant}
            data-testid={testId}
            fields={[{ id: '1', name: hideLabel ? '' : label, value: displayComp }]}
          />
          </StyledPegaDxilMyIntegerWrapper>
        );
      }
      case 'STACKED_LARGE_VAL': {
        return (
          <StyledPegaDxilMyIntegerWrapper>
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
          </StyledPegaDxilMyIntegerWrapper>
        );
      }
      // no default
    }
  }

  function onChangeHandler(enteredValue) {
    if (hasSuggestions) {
      setStatus(undefined);
    }
    setIntegerValue(enteredValue);
    // const parsedValue = integerValue !== '' ? Number(integerValue) : '';
    if (value !== (enteredValue !== '' ? Number(enteredValue) : '')) {
      handleEvent(actions, 'change', propName, enteredValue !== '' ? Number(enteredValue) : '');
      hasValueChange.current = true;
    }
    // In case of stepper variation there is no blur event as component is never focussed unless forced. Need to update redux on change.
    if (displayAs === 'stepper') {
      handleEvent(actions, 'changeNblur', propName, enteredValue !== '' ? Number(enteredValue) : '');
    }
  }

  const onResolveSuggestionHandler = (accepted) => {
    suggestionsHandler(accepted, pConn, setStatus);
  };

  return displayAs === 'slider' ? (
    <StyledPegaDxilMyIntegerWrapper>
    <Slider
      {...additionalProps}
      label={label}
      labelHidden={hideLabel}
      info={validatemessage || helperText}
      value={!integerValue ? sliderDefaultValue : Number(integerValue)}
      status={status}
      placeholder={placeholder}
      disabled={disabled}
      readOnly={readOnly}
      required={required}
      data-testid={testId}
      showProgress
      preview={!showInput}
      showInput={showInput}
      min={min}
      max={max}
      step={step}
      ticks={showTicks && { [min]: `${min}`, [max]: `${max}` }}
      onChange={(selectedValue) => {
        onChangeHandler(selectedValue.toString());
        handleEvent(actions, 'changeNblur', propName, selectedValue);
      }}
    />
    </StyledPegaDxilMyIntegerWrapper>
  ) : (
    <StyledPegaDxilMyIntegerWrapper>
    <NumberInput
      {...additionalProps}
      label={label}
      labelHidden={hideLabel}
      info={validatemessage || helperText}
      value={integerValue}
      status={status}
      placeholder={displayAs === 'input' ? placeholder : ''}
      disabled={disabled}
      readOnly={readOnly}
      required={required}
      data-testid={testId}
      numberOfDecimals={0}
      showGroupSeparators={showGroupSeparators}
      variant={displayAs === 'stepper' ? displayAs : ''}
      onChange={(enteredValue) => {
        onChangeHandler(enteredValue);
      }}
      onBlur={() => {
        if (!readOnly && (hasValueChange.current || !value)) {
          handleEvent(actions, 'blur', propName, integerValue !== '' ? Number(integerValue) : '');
          if (hasSuggestions) {
            pConn.ignoreSuggestion();
          }
          hasValueChange.current = false;
        }
      }}
      onResolveSuggestion={onResolveSuggestionHandler}
    />
    </StyledPegaDxilMyIntegerWrapper>
  );
}

PegaDxilMyInteger.defaultProps = {
  value: '',
  defaultValue: null,
  placeholder: '',
  validatemessage: '',
  helperText: '',
  hideLabel: false,
  disabled: false,
  readOnly: false,
  required: false,
  testId: null,
  showGroupSeparators: false,
  displayMode: null,
  displayAs: 'input',
  showInput: true,
  min: 0,
  max: 100,
  step: 1,
  showTicks: true,
  additionalProps: {},
  variant: 'inline',
  decimalPrecision: null,
  currencyISOCode: 'USD',
  isoCodeSelection: 'constant',
  formatter: 'defaultInteger',
  negative: 'minus-sign',
  notation: 'standard',
  currencyDisplay: 'symbol',
  currencyDecimalPrecision: 'auto',
  isTableFormatter: false,
  hasSuggestions: false
};

PegaDxilMyInteger.propTypes = {
  value: PropTypes.string,
  defaultValue: PropTypes.number,
  placeholder: PropTypes.string,
  label: PropTypes.string.isRequired,
  hideLabel: PropTypes.bool,
  getPConnect: PropTypes.func.isRequired,
  validatemessage: PropTypes.string,
  helperText: PropTypes.string,
  disabled: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  readOnly: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  required: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  testId: PropTypes.string,
  showGroupSeparators: PropTypes.bool,
  displayMode: PropTypes.string,
  displayAs: PropTypes.string,
  showInput: PropTypes.bool,
  min: PropTypes.number,
  max: PropTypes.number,
  step: PropTypes.number,
  showTicks: PropTypes.bool,
  additionalProps: PropTypes.objectOf(PropTypes.any),
  variant: PropTypes.string,
  decimalPrecision: PropTypes.number,
  currencyISOCode: PropTypes.string,
  isoCodeSelection: PropTypes.string,
  formatter: PropTypes.string,
  negative: PropTypes.string,
  notation: PropTypes.string,
  currencyDisplay: PropTypes.string,
  currencyDecimalPrecision: PropTypes.string,
  isTableFormatter: PropTypes.bool,
  hasSuggestions: PropTypes.bool
};

export default PegaDxilMyInteger;
