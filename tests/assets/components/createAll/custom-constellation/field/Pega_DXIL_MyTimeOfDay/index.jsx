import { useEffect, useState } from 'react';
import { TimeInput, FieldValueList, DateTimeDisplay, Text } from '@pega/cosmos-react-core';
import PropTypes from 'prop-types';

// includes in bundle
import {
  parseClockFormat,
  timeCorrectedToSeconds,
  datetimeFireChangeBlurEvents
} from "./time-of-day";
import { suggestionsHandler } from './suggestions-handler';

import StyledPegaDxilMyTimeOfDayWrapper from './styles';


// Duplicated runtime code from Constellation Design System Component

// props passed in combination of props from property panel (config.json) and run time props from Constellation
// any default values in config.pros should be set in defaultProps at bottom of this file
const PegaDxilMyTimeOfDay = props => {
  const {
    getPConnect,
    value,
    validatemessage,
    label,
    hideLabel,
    helperText,
    withSeconds,
    pickerInterval,
    testId,
    additionalProps,
    displayMode,
    variant,
    hasSuggestions
  } = props;
  let { formatter } = props;
  const pConn = getPConnect();
  const actions = pConn.getActionsApi();
  const propName = pConn.getStateProps().value;


  // BUG-547602: Temporary type coercion for 8.5 until DXAPIs are enhanced to pass original pxViewMetadata JSON, respecting boolean primitives
  let { readOnly, required, disabled } = props;
  [readOnly, required, disabled] = [readOnly, required, disabled].map(
    (prop) => prop === true || (typeof prop === 'string' && prop === 'true')
  );

  let { clockFormat } = props;
  clockFormat = parseClockFormat(clockFormat);

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

  const onResolveSuggestionHandler = (accepted) => {
    suggestionsHandler(accepted, pConn, setStatus);
  };

  function handleBlur(onBlurValue) {
    const { valueAsISOString: time, state: errorState } = onBlurValue;
    const trimmedTime = time ? timeCorrectedToSeconds(time, withSeconds) : time;
    datetimeFireChangeBlurEvents(errorState, value, trimmedTime, actions, propName, pConn);
    const isValueChanged = !(value === undefined && trimmedTime === '') && value !== trimmedTime;
    if (hasSuggestions && isValueChanged) {
      pConn.ignoreSuggestion();
    }
  }

  function handleChange(onChangeValue) {
    const { valueAsISOString: time } = onChangeValue;
    const trimmedTime = time ? timeCorrectedToSeconds(time, withSeconds) : time;
    if (hasSuggestions && value !== trimmedTime) {
      setStatus(undefined);
    }
    pConn.clearErrorMessages({
      property: propName
    });
  }

  if (displayMode === 'LABELS_LEFT' || displayMode === 'STACKED_LARGE_VAL' || displayMode === 'DISPLAY_ONLY') {
    let variantValue = 'time';
    let formatValue = withSeconds ? 'long' : 'short';
    if (pConn && pConn.getConfigProps()) {
      const runtimeformatter = pConn.getConfigProps()?.formatter;
      if (formatter !== runtimeformatter) {
        formatter = runtimeformatter;
      }
    }
    if (formatter === 'Time-Only') {
      variantValue = 'time';
      formatValue = 'long';
    }
    const displayComp = (
      <DateTimeDisplay
        variant={variantValue}
        format={formatValue}
        value={value}
        clockFormat={clockFormat || undefined}
      />
    );
    switch (displayMode) {
      case 'DISPLAY_ONLY': {
        return ( <StyledPegaDxilMyTimeOfDayWrapper> displayComp </StyledPegaDxilMyTimeOfDayWrapper>);
      }
      case 'LABELS_LEFT': {
        return (
          <StyledPegaDxilMyTimeOfDayWrapper>
          <FieldValueList
            variant={hideLabel ? 'stacked' : variant}
            data-testid={testId}
            fields={[{ id: '1', name: hideLabel ? '' : label, value: displayComp }]}
          />
          </StyledPegaDxilMyTimeOfDayWrapper>
        );
      }
      case 'STACKED_LARGE_VAL': {
        return (
          <StyledPegaDxilMyTimeOfDayWrapper>
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
          </StyledPegaDxilMyTimeOfDayWrapper>
        );
      }
      // no default
    }
  }

  return (
    <StyledPegaDxilMyTimeOfDayWrapper>
    <TimeInput
      {...additionalProps}
      label={label}
      labelHidden={hideLabel}
      info={validatemessage || helperText}
      status={status}
      value={value || undefined}
      withSeconds={withSeconds}
      disabled={disabled}
      readOnly={readOnly}
      required={required}
      pickerInterval={pickerInterval}
      clockFormat={clockFormat || undefined}
      data-testid={testId}
      onFocus={actions.onFocus}
      onChange={handleChange}
      onBlur={handleBlur}
      onResolveSuggestion={onResolveSuggestionHandler}
    />
    </StyledPegaDxilMyTimeOfDayWrapper>
  );
}

PegaDxilMyTimeOfDay.defaultProps = {
  value: undefined,
  withSeconds: false,
  validatemessage: "",
  helperText: "",
  hideLabel: false,
  disabled: false,
  readOnly: false,
  required: false,
  pickerInterval: "30",
  clockFormat: 0,
  testId: null,
  additionalProps: {},
  displayMode: null,
  variant: "inline",
  formatter:"defaultTime"
};

PegaDxilMyTimeOfDay.propTypes = {
  value: PropTypes.string,
  label: PropTypes.string.isRequired,
  hideLabel: PropTypes.bool,
  withSeconds: PropTypes.bool,
  getPConnect: PropTypes.func.isRequired,
  validatemessage: PropTypes.string,
  helperText: PropTypes.string,
  disabled: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  readOnly: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  required: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  pickerInterval: PropTypes.string,
  clockFormat: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  testId: PropTypes.string,
  additionalProps: PropTypes.objectOf(PropTypes.any),
  displayMode: PropTypes.string,
  variant: PropTypes.string,
  formatter : PropTypes.string
};

export default PegaDxilMyTimeOfDay;
