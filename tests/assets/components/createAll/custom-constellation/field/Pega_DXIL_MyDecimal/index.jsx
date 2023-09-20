import { useState, useEffect, useRef } from 'react';
import { NumberInput, NumberDisplay, CurrencyDisplay, FieldValueList, Text } from '@pega/cosmos-react-core';
import PropTypes from 'prop-types';

// includes in bundle
import StyledPegaDxilMyDecimalWrapper from './styles';
import handleEvent from "./event-utils";
import { suggestionsHandler } from './suggestions-handler';


// Duplicated runtime code from Constellation Design System Component

// props passed in combination of props from property panel (config.json) and run time props from Constellation
// any default values in config.pros should be set in defaultProps at bottom of this file
const PegaDxilMyDecimal = props => {
  const {
    getPConnect,
    value,
    placeholder,
    validatemessage,
    label,
    hideLabel,
    helperText,
    testId,
    displayMode,
    additionalProps,
    variant,
    formatter,
    negative,
    notation,
    currencyISOCode,
    isTableFormatter,
    hasSuggestions
  } = props;
  let { showGroupSeparators } = props;
  let { currencyDisplay } = props;
  const pConn = getPConnect();
  const actions = pConn.getActionsApi();
  const propName = pConn.getStateProps().value;
  const [decimalValue, setDecimalValue] = useState(value?.toString());
  const hasValueChange = useRef(false);

  let { readOnly, required, disabled } = props;
  [readOnly, required, disabled] = [readOnly, required, disabled].map(
    (prop) => prop === true || (typeof prop === 'string' && prop === 'true')
  );

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

  const { decimalPrecision, currencyDecimalPrecision } = props;
  let numberOfDecimals = parseInt(decimalPrecision, 10);
  if (Number.isNaN(numberOfDecimals)) {
    numberOfDecimals = decimalPrecision === '' ? undefined : 2;
  }
  let noOfFractionDigits = currencyDecimalPrecision === 'auto' ? undefined : parseInt(currencyDecimalPrecision, 10);

  useEffect(() => {
    setDecimalValue(value?.toString());
  }, [value]);

  let unit;

  if (['DISPLAY_ONLY', 'LABELS_LEFT', 'STACKED_LARGE_VAL'].includes(displayMode)) {
    if (displayMode !== 'STACKED_LARGE_VAL' && isTableFormatter) {
      showGroupSeparators = true;
      noOfFractionDigits = undefined;
      if (formatter === 'Currency-Code') {
        currencyDisplay = 'code';
      }
    }

    switch (formatter) {
      case 'Integer': {
        numberOfDecimals = 0;
        break;
      }
      case 'Percentage': {
        showGroupSeparators = false;
        unit = 'percent';
        break;
      }
      case 'Decimal-Auto': {
        numberOfDecimals = Number.isInteger(decimalValue) ? 0 : 2;
        break;
      }
      default: {
        break;
      }
    }



    const displayComp =
      formatter === 'Currency' || formatter === 'Currency-Code' ? (
        <CurrencyDisplay
          value={decimalValue}
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
          value={decimalValue}
          formattingOptions={{
            fractionDigits: numberOfDecimals,
            groupSeparators: showGroupSeparators,
            notation
          }}
          unit={unit}
        />
      );


    switch (displayMode) {
      case 'DISPLAY_ONLY': {
        return (<StyledPegaDxilMyDecimalWrapper> displayComp </StyledPegaDxilMyDecimalWrapper>);
      }
      case 'LABELS_LEFT': {
        return (
          <StyledPegaDxilMyDecimalWrapper>
          <FieldValueList
            variant={hideLabel ? 'stacked' : variant}
            data-testid={testId}
            fields={[{ id: '1', name: hideLabel ? '' : label, value: displayComp }]}
          />
          </StyledPegaDxilMyDecimalWrapper>
        );
      }
      case 'STACKED_LARGE_VAL': {
        return (
          <StyledPegaDxilMyDecimalWrapper>
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
          </StyledPegaDxilMyDecimalWrapper>
        );
      }
      // no default
    }
  }

  const onResolveSuggestionHandler = (accepted) => {
    suggestionsHandler(accepted, pConn, setStatus);
  };

  return (
    <StyledPegaDxilMyDecimalWrapper>
    <NumberInput
      {...additionalProps}
      label={label}
      labelHidden={hideLabel}
      info={validatemessage || helperText}
      value={decimalValue}
      status={status}
      placeholder={placeholder}
      disabled={disabled}
      readOnly={readOnly}
      required={required}
      numberOfDecimals={numberOfDecimals}
      showGroupSeparators={showGroupSeparators}
      data-testid={testId}
      onChange={(enteredValue) => {
        if (hasSuggestions) {
          setStatus(undefined);
        }
        setDecimalValue(enteredValue);
        if (value !== (enteredValue !== '' ? Number(enteredValue) : '')) {
          handleEvent(actions, 'change', propName, enteredValue !== '' ? Number(enteredValue) : '');
          hasValueChange.current = true;
        }
      }}
      onBlur={() => {
        if (!value || hasValueChange.current) {
          handleEvent(actions, 'blur', propName, decimalValue !== '' ? Number(decimalValue) : '');
          if (hasSuggestions) {
            pConn.ignoreSuggestion();
          }
          hasValueChange.current = false;
        }
      }}
      onResolveSuggestion={onResolveSuggestionHandler}
    />
    </StyledPegaDxilMyDecimalWrapper>
  );
}


PegaDxilMyDecimal.defaultProps = {
  value: '',
  placeholder: '',
  validatemessage: '',
  helperText: '',
  hideLabel: false,
  disabled: false,
  readOnly: false,
  required: false,
  testId: null,
  decimalPrecision: '',
  showGroupSeparators: false,
  displayMode: null,
  additionalProps: {},
  variant: 'inline',
  currencyISOCode: 'USD',
  formatter: 'defaultDecimal',
  isoCodeSelection: 'constant',
  negative: 'minus-sign',
  notation: 'standard',
  currencyDisplay: 'symbol',
  currencyDecimalPrecision: 'auto',
  isTableFormatter: false,
  hasSuggestions: false
};

PegaDxilMyDecimal.propTypes = {
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
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
  decimalPrecision: PropTypes.string,
  showGroupSeparators: PropTypes.bool,
  displayMode: PropTypes.string,
  additionalProps: PropTypes.objectOf(PropTypes.any),
  variant: PropTypes.string,
  currencyISOCode: PropTypes.string,
  formatter: PropTypes.string,
  isoCodeSelection: PropTypes.string,
  negative: PropTypes.string,
  notation: PropTypes.string,
  currencyDisplay: PropTypes.string,
  currencyDecimalPrecision: PropTypes.string,
  isTableFormatter: PropTypes.bool,
  hasSuggestions: PropTypes.bool
};

export default PegaDxilMyDecimal;
