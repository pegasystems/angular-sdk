/* eslint-disable no-undef */
import { useEffect, useState } from 'react';
import { DateTimeInput, FieldValueList, DateTimeDisplay, Text } from "@pega/cosmos-react-core";
import PropTypes from "prop-types";

// includes in bundle
import DateTimeFormatter from "./date-time";
import {datetimedisplayformatter,formatExists}   from "./date";
import {
  getFullYear,
  getMaxDate,
  getMinDate,
  parseClockFormat,
  correctDateTimeToSeconds,
  datetimeFireChangeBlurEvents
} from "./date-utils";
import { suggestionsHandler } from './suggestions-handler';


import StyledPegaDxilMyDateTimeWrapper from './styles';

// Duplicated runtime code from Constellation Design System Component

// props passed in combination of props from property panel (config.json) and run time props from Constellation
// any default values in config.pros should be set in defaultProps at bottom of this file
const PegaDxilMyDateTime = props => {
  const {
    getPConnect,
    value,
    validatemessage,
    label,
    hideLabel,
    helperText,
    withSeconds,
    nextYearRange,
    previousYearRange,
    showWeekNumber,
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

  const environmentInfo = PCore.getEnvironmentInfo();
  const timezone = environmentInfo && environmentInfo.getTimeZone();

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

  let { clockFormat } = props;
  clockFormat = parseClockFormat(clockFormat);

  // calculate min and max range of calendar
  const currentYear = getFullYear();
  const yearFromValue = getFullYear(value);
  const maxDate = getMaxDate(parseInt(nextYearRange, 10), currentYear, yearFromValue);
  const minDate = getMinDate(parseInt(previousYearRange, 10), currentYear, yearFromValue);

  const onResolveSuggestionHandler = (accepted) => {
    suggestionsHandler(accepted, pConn, setStatus);
  };

  function handleBlur(onBlurValue) {
    const { valueAsISOString: datetimeTZ, state: errorState } = onBlurValue;
    const datetimeGMT = DateTimeFormatter.convertFromTimezone(datetimeTZ, timezone);

    const datetimeGMTCorrectedToSeconds = datetimeGMT
      ? correctDateTimeToSeconds(datetimeGMT, withSeconds)
      : datetimeGMT;

    datetimeFireChangeBlurEvents(errorState, value, datetimeGMTCorrectedToSeconds, actions, propName, pConn);
    const isValueChanged =
      !(value === undefined && datetimeGMTCorrectedToSeconds === '') && value !== datetimeGMTCorrectedToSeconds;
    if (hasSuggestions && isValueChanged) {
      pConn.ignoreSuggestion();
    }
  }

  function handleChange(onChangeValue) {
    const { valueAsISOString: datetimeTZ } = onChangeValue;
    const datetimeGMT = DateTimeFormatter.convertFromTimezone(datetimeTZ, timezone);
    const datetimeGMTCorrectedToSeconds = datetimeGMT
      ? correctDateTimeToSeconds(datetimeGMT, withSeconds)
      : datetimeGMT;
    if (hasSuggestions && value !== datetimeGMTCorrectedToSeconds) {
      setStatus(undefined);
    }
    pConn.clearErrorMessages({
      property: propName
    });
  }

  if (displayMode === 'LABELS_LEFT' || displayMode === 'STACKED_LARGE_VAL' || displayMode === 'DISPLAY_ONLY') {
    let variantValue = 'datetime';
    let formatValue = withSeconds ? 'long' : 'short';
    const runtimeformatter = pConn.getConfigProps()?.formatter;
    if (formatter !== runtimeformatter) {
      formatter = runtimeformatter;
    }
    if (formatExists(formatter)) {
      const { variantVal, formatVal } = datetimedisplayformatter(formatter);
      variantValue = variantVal;
      formatValue = withSeconds && formatter === 'Time-Only' ? 'long' : formatVal;
    }
    const displayComp = (
      <DateTimeDisplay
        variant={variantValue}
        format={formatValue}
        value={
          formatter === 'DateTime-Since' ? value : DateTimeFormatter.convertToTimezone(value, { timezone }) || undefined
        }
        clockFormat={clockFormat || undefined}
      />
    );
    switch (displayMode) {
      case 'DISPLAY_ONLY': {
        return ( <StyledPegaDxilMyDateTimeWrapper> displayComp </StyledPegaDxilMyDateTimeWrapper>);
      }
      case 'LABELS_LEFT': {
        return (
          <StyledPegaDxilMyDateTimeWrapper>
          <FieldValueList
            variant={hideLabel ? 'stacked' : variant}
            data-testid={testId}
            fields={[{ id: '1', name: hideLabel ? '' : label, value: displayComp }]}
          />
          </StyledPegaDxilMyDateTimeWrapper>
        );
      }
      case 'STACKED_LARGE_VAL': {
        return (
          <StyledPegaDxilMyDateTimeWrapper>
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
          </StyledPegaDxilMyDateTimeWrapper>
        );
      }
      // no default
    }
  }


  return (
    <StyledPegaDxilMyDateTimeWrapper>
    <DateTimeInput
      {...additionalProps}
      label={label}
      labelHidden={hideLabel}
      info={validatemessage || helperText}
      status={status}
      value={DateTimeFormatter.convertToTimezone(value, { timezone }) || undefined}
      withSeconds={withSeconds}
      disabled={disabled}
      readOnly={readOnly}
      required={required}
      pickerInterval={pickerInterval}
      clockFormat={clockFormat || undefined}
      showWeekNumber={showWeekNumber}
      min={minDate}
      max={maxDate}
      data-testid={testId}
      onFocus={actions.onFocus}
      onChange={handleChange}
      onBlur={handleBlur}
      onResolveSuggestion={onResolveSuggestionHandler}
    />
    </StyledPegaDxilMyDateTimeWrapper>
  );
}



PegaDxilMyDateTime.defaultProps = {
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
  showWeekNumber: false,
  nextYearRange: "",
  previousYearRange: "",
  testId: null,
  additionalProps: {},
  displayMode: null,
  variant: "inline",
  Format: "defaultDateTime",
  hasSuggestions: false
};

PegaDxilMyDateTime.propTypes = {
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
  showWeekNumber: PropTypes.bool,
  nextYearRange: PropTypes.string,
  previousYearRange: PropTypes.string,
  testId: PropTypes.string,
  additionalProps: PropTypes.objectOf(PropTypes.any),
  displayMode: PropTypes.string,
  variant: PropTypes.string,
  formatter: PropTypes.string,
  Format: PropTypes.string,
  hasSuggestions: PropTypes.bool
};

export default PegaDxilMyDateTime;
