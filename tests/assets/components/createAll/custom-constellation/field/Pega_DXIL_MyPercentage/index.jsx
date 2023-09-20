import { useState, useEffect, useRef } from 'react';
import {
  NumberInput,
  NumberDisplay,
  CurrencyDisplay,
  FieldValueList,
  Text
} from '@pega/cosmos-react-core';
import PropTypes from 'prop-types';

// includes in bundle
import handleEvent from './event-utils';
import { suggestionsHandler } from './suggestions-handler';

import StyledPegaDxilMyPercentageWrapper from './styles';


// Duplicated runtime code from Constellation Design System Component

// props passed in combination of props from property panel (config.json) and run time props from Constellation
// any default values in config.pros should be set in defaultProps at bottom of this file
const PegaDxilMyPercentage = props => {
  const {
    getPConnect,
    value,
    placeholder,
    validatemessage,
    label,
    hideLabel,
    helperText,
    testId,
    decimalPrecision,
    additionalProps,
    displayMode,
    variant,
    formatter,
    isTableFormatter,
    hasSuggestions
  } = props;
  let { showGroupSeparators } = props;
  const pConn = getPConnect();
  const actions = pConn.getActionsApi();
  const propName = pConn.getStateProps().value;
  const [percentageValue, setPercentageValue] = useState(value?.toString());
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

  let numberOfDecimals = parseInt(decimalPrecision, 10);
  if (Number.isNaN(numberOfDecimals)) {
    numberOfDecimals = decimalPrecision === '' ? undefined : 2;
  }

  useEffect(() => {
    setPercentageValue(value?.toString());
  }, [value]);

  if (displayMode === 'LABELS_LEFT' || displayMode === 'DISPLAY_ONLY') {
    let unit = 'percent';
    let displayComp = null;

    if (isTableFormatter) {
      switch (formatter) {
        case 'Integer': {
          numberOfDecimals = 0;
          showGroupSeparators = true;
          unit = '';
          break;
        }
        case 'Decimal': {
          showGroupSeparators = true;
          unit = '';
          break;
        }
        case 'Decimal-Auto': {
          numberOfDecimals = Number.isInteger(percentageValue) ? 0 : 2;
          showGroupSeparators = true;
          unit = '';
          break;
        }
        default: {
          showGroupSeparators = false;
          break;
        }
      }
    }


    displayComp = (
      <NumberDisplay
        value={percentageValue}
        formattingOptions={{
          fractionDigits: numberOfDecimals,
          groupSeparators: showGroupSeparators
        }}
        unit={unit}
      />
    );
    if (isTableFormatter && (formatter === 'Currency' || formatter === 'Currency-Code')) {
      const { currencyISOCode } = props;
      let showIsoCode = true;
      if (formatter === 'Currency') {
        showIsoCode = false;
      }
      displayComp = (
        <CurrencyDisplay
          value={percentageValue}
          currencyISOCode={currencyISOCode}
          formattingOptions={{
            groupSeparators: showGroupSeparators,
            currency: showIsoCode ? 'code' : 'symbol'
          }}
        />
      );
    }


    return displayMode === 'DISPLAY_ONLY' ? (
      <StyledPegaDxilMyPercentageWrapper>
      displayComp
      </StyledPegaDxilMyPercentageWrapper>
    ) : (
      <StyledPegaDxilMyPercentageWrapper>
      <FieldValueList
        variant={hideLabel ? 'stacked' : variant}
        data-testid={testId}
        fields={[{ id: '1', name: hideLabel ? '' : label, value: displayComp }]}
      />
      </StyledPegaDxilMyPercentageWrapper>
    );
  }


  if (displayMode === 'STACKED_LARGE_VAL') {
    const displayComp = (
      <NumberDisplay
        value={percentageValue}
        formattingOptions={{
          fractionDigits: numberOfDecimals,
          groupSeparators: showGroupSeparators
        }}
        unit='percent'
      />
    );


    return (
      <StyledPegaDxilMyPercentageWrapper>
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
      </StyledPegaDxilMyPercentageWrapper>
    );
  }

  const onResolveSuggestionHandler = (accepted) => {
    suggestionsHandler(accepted, pConn, setStatus);
  };

  return (
    <StyledPegaDxilMyPercentageWrapper>
    <NumberInput
      {...additionalProps}
      label={label}
      labelHidden={hideLabel}
      info={validatemessage || helperText}
      value={percentageValue}
      status={status}
      placeholder={placeholder}
      disabled={disabled}
      readOnly={readOnly}
      required={required}
      numberOfDecimals={numberOfDecimals}
      showGroupSeparators={showGroupSeparators}
      unit='percent'
      data-testid={testId}
      onChange={(enteredValue) => {
        if (hasSuggestions) {
          setStatus(undefined);
        }
        setPercentageValue(enteredValue);
        if (value !== enteredValue) {
          handleEvent(actions, 'change', propName, enteredValue);
          hasValueChange.current = true;
        }
      }}
      onBlur={() => {
        const parsedValue = percentageValue !== '' ? Number(percentageValue) : '';
        if (!value || hasValueChange.current) {
          handleEvent(actions, 'blur', propName, parsedValue);
          if (hasSuggestions) {
            pConn.ignoreSuggestion();
          }
          hasValueChange.current = false;
        }
      }}
      onResolveSuggestion={onResolveSuggestionHandler}
    />
    </StyledPegaDxilMyPercentageWrapper>
  );
}

PegaDxilMyPercentage.defaultProps = {
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
  additionalProps: {},
  displayMode: null,
  variant: 'inline',
  currencyISOCode: 'USD',
  formatter: '',
  isTableFormatter: false,
  hasSuggestions: false
};

PegaDxilMyPercentage.propTypes = {
  value: PropTypes.string,
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
  additionalProps: PropTypes.objectOf(PropTypes.any),
  displayMode: PropTypes.string,
  variant: PropTypes.string,
  formatter: PropTypes.string,
  currencyISOCode: PropTypes.string,
  isTableFormatter: PropTypes.bool,
  hasSuggestions: PropTypes.bool
};

export default PegaDxilMyPercentage;
