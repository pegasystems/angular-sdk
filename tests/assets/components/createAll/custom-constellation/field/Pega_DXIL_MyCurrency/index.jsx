import { useState, useEffect } from 'react';
import {
  CurrencyInput as CosmosCurrency,
  CurrencyDisplay,
  NumberDisplay,
  FieldValueList,
  Text,
  useAfterInitialEffect
} from '@pega/cosmos-react-core';
import PropTypes from 'prop-types';

// includes in bundle
import handleEvent from './event-utils';
import { suggestionsHandler } from './suggestions-handler';

import StyledPegaDxilMyCurrencyWrapper from './styles';

const formatValue = (value) => {
  if (!value && value !== 0) return '';
  const [integer, decimal = ''] = value.toString().split('.');
  return `${integer}.${decimal.padEnd(3, '0')}`;
};


// Duplicated runtime code from Constellation Design System Component

// props passed in combination of props from property panel (config.json) and run time props from Constellation
// any default values in config.pros should be set in defaultProps at bottom of this file
const PegaDxilMyCurrency = props => {
  const {
    getPConnect,
    value,
    placeholder,
    validatemessage,
    label,
    hideLabel,
    helperText,
    testId,
    allowDecimals,
    currencyISOCode,
    alwaysShowISOCode,
    displayMode,
    additionalProps,
    variant,
    formatter,
    negative,
    notation,
    isTableFormatter,
    hasSuggestions
  } = props;
  let { currencyDisplay } = props;
  const pConn = getPConnect();
  const actions = pConn.getActionsApi();
  const propName = pConn.getStateProps().value;
  const [currencyValue, setCurrencyValue] = useState(() => formatValue(value));

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

  useAfterInitialEffect(() => {
    setCurrencyValue(formatValue(value));
  }, [value]);

  const { decimalPrecision, currencyDecimalPrecision } = props;
  let noOfDecimals = parseInt(decimalPrecision, 10);
  if (Number.isNaN(noOfDecimals)) noOfDecimals = undefined;
  let noOfFractionDigits = currencyDecimalPrecision === 'auto' ? undefined : parseInt(currencyDecimalPrecision, 10);

  if (displayMode === 'LABELS_LEFT' || displayMode === 'STACKED_LARGE_VAL' || displayMode === 'DISPLAY_ONLY') {
    let displayComp;
    let { showGroupSeparators } = props;
    if (displayMode === 'LABELS_LEFT' && isTableFormatter) {
      noOfFractionDigits = undefined;
      showGroupSeparators = true;
      if (formatter === 'Currency-Code') {
        currencyDisplay = 'code';
      }
    }

    const displayValue = !value && value !== 0 ? undefined : Number(currencyValue);


    displayComp = (
      <CurrencyDisplay
        value={displayValue}
        currencyISOCode={currencyISOCode}
        formattingOptions={{
          groupSeparators: true,
          fractionDigits: noOfFractionDigits,
          currency: currencyDisplay,
          negative,
          notation: negative === 'parentheses' ? 'standard' : notation
        }}
      />
    );




    if (['Integer', 'Decimal', 'Percentage', 'Decimal-Auto'].includes(formatter)) {
      let unit;

      switch (formatter) {
        case 'Integer': {
          noOfDecimals = 0;
          break;
        }
        case 'Decimal': {
          break;
        }
        case 'Decimal-Auto': {
          noOfDecimals = Number.isInteger(currencyValue) ? 0 : 2;
          break;
        }
        case 'Percentage': {
          showGroupSeparators = false;
          unit = 'percent';
          break;
        }
        // no default
      }

      displayComp = (
        <NumberDisplay
          value={displayValue}
          formattingOptions={{
            fractionDigits: noOfDecimals,
            groupSeparators: showGroupSeparators,
            notation
          }}
          unit={unit}
        />
      );
    }


    switch (displayMode) {
      case 'DISPLAY_ONLY': {
        return (<StyledPegaDxilMyCurrencyWrapper> displayComp </StyledPegaDxilMyCurrencyWrapper>) ;
      }
      case 'LABELS_LEFT': {
        return (
          <StyledPegaDxilMyCurrencyWrapper>
          <FieldValueList
            variant={hideLabel ? 'stacked' : variant}
            data-testid={testId}
            fields={[{ id: '1', name: hideLabel ? '' : label, value: displayComp }]}
          />
          </StyledPegaDxilMyCurrencyWrapper>
        );
      }
      case 'STACKED_LARGE_VAL': {
        return (
          <StyledPegaDxilMyCurrencyWrapper>
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
          </StyledPegaDxilMyCurrencyWrapper>
        );
      }
      // no default
    }
  }

  const onResolveSuggestionHandler = (accepted) => {
    suggestionsHandler(accepted, pConn, setStatus);
  };

  return (
    <StyledPegaDxilMyCurrencyWrapper>
    <CosmosCurrency
      {...additionalProps}
      label={label}
      labelHidden={hideLabel}
      info={validatemessage || helperText}
      value={currencyValue}
      status={status}
      showDecimal={allowDecimals}
      currencyISOCode={currencyISOCode}
      alwaysShowISOCode={alwaysShowISOCode}
      placeholder={placeholder}
      disabled={disabled}
      readOnly={readOnly}
      required={required}
      data-testid={testId}
      onChange={(enteredValue) => {
        if (hasSuggestions) {
          setStatus(undefined);
        }
        setCurrencyValue(enteredValue);
        pConn.clearErrorMessages({
          property: propName
        });
      }}
      onBlur={(enteredValue) => {
        const parsedValue = enteredValue !== '' ? Number(enteredValue) : enteredValue;
        if (!readOnly && (!value || value !== parsedValue)) {
          handleEvent(actions, 'changeNblur', propName, parsedValue);
          if (hasSuggestions) {
            pConn.ignoreSuggestion();
          }
        }
      }}
      onResolveSuggestion={onResolveSuggestionHandler}
    />
    </StyledPegaDxilMyCurrencyWrapper>
  );
}

PegaDxilMyCurrency.defaultProps = {
  value: 0,
  placeholder: '',
  validatemessage: '',
  helperText: '',
  hideLabel: false,
  disabled: false,
  readOnly: false,
  required: false,
  decimalPrecision: null,
  allowDecimals: true,
  currencyISOCode: 'USD',
  isoCodeSelection: 'constant',
  testId: null,
  displayMode: null,
  additionalProps: {},
  variant: 'inline',
  showGroupSeparators: false,
  formatter: 'defaultCurrency',
  currencyDisplay: 'symbol',
  negative: 'minus-sign',
  notation: 'standard',
  currencyDecimalPrecision: 'auto',
  isTableFormatter: false,
  alwaysShowISOCode: false,
  hasSuggestions: false
};

PegaDxilMyCurrency.propTypes = {
  value: PropTypes.number,
  placeholder: PropTypes.string,
  label: PropTypes.string.isRequired,
  decimalPrecision: PropTypes.number,
  allowDecimals: PropTypes.bool,
  currencyISOCode: PropTypes.string,
  isoCodeSelection: PropTypes.string,
  hideLabel: PropTypes.bool,
  getPConnect: PropTypes.func.isRequired,
  validatemessage: PropTypes.string,
  helperText: PropTypes.string,
  disabled: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  readOnly: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  required: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  testId: PropTypes.string,
  displayMode: PropTypes.string,
  additionalProps: PropTypes.objectOf(PropTypes.any),
  variant: PropTypes.string,
  showGroupSeparators: PropTypes.bool,
  formatter: PropTypes.string,
  currencyDisplay: PropTypes.string,
  negative: PropTypes.string,
  notation: PropTypes.string,
  currencyDecimalPrecision: PropTypes.string,
  isTableFormatter: PropTypes.bool,
  alwaysShowISOCode: PropTypes.bool,
  hasSuggestions: PropTypes.bool
};

export default PegaDxilMyCurrency;
