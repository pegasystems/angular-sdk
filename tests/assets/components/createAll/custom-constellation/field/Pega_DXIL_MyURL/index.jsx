import { useState, useEffect, useRef} from "react";
import { Input, FieldValueList, Text } from "@pega/cosmos-react-core";
import PropTypes from "prop-types";

// includes in bundle
import {formatExists,textFormatter, urlFormatter} from "./text-url.jsx";
import handleEvent from "./event-utils";
import { suggestionsHandler } from './suggestions-handler';

import StyledPegaDxilMyUrlWrapper from './styles';


// Duplicated runtime code from Constellation Design System Component

// props passed in combination of props from property panel (config.json) and run time props from Constellation
// any default values in config.pros should be set in defaultProps at bottom of this file
const PegaDxilMyUrl = props => {
  const {
    getPConnect,
    value,
    hideLabel,
    placeholder,
    validatemessage,
    label,
    helperText,
    testId,
    displayMode,
    additionalProps,
    variant,
    isTableFormatter,
    displayAs,
    widthSel,
    customWidth,
    altText,
    altTextOfImage,
    propaltTextOfImage,
    urlLabel,
    propUrlLabel,
    urlLabelSelection,
    tableDisplayAs,
    hasSuggestions
  } = props;
  const { formatter } = props;
  const pConn = getPConnect();
  const actions = pConn.getActionsApi();
  const propName = pConn.getStateProps().value;
  const hasValueChange = useRef(false);


 // BUG-547602: Temporary type coercion for 8.5 until DXAPIs are enhanced to pass original pxViewMetadata JSON, respecting boolean primitives
  let { readOnly, required, disabled } = props;
  [readOnly, required, disabled] = [readOnly, required, disabled].map(
    (prop) => prop === true || (typeof prop === 'string' && prop === 'true')
  );

  const [inputValue, setInputValue] = useState(value);
  const [status, setStatus] = useState(hasSuggestions ? 'pending' : undefined);
  useEffect(() => setInputValue(value), [value]);

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

  let displayComp = null;
  if (displayMode) {
    displayComp = urlFormatter(value, {
      displayAs,
      tableDisplayAs,
      isTableFormatter,
      altText,
      altTextOfImage,
      propaltTextOfImage,
      urlLabelSelection,
      urlLabel,
      propUrlLabel,
      widthSel,
      customWidth
    });
  }



  if (displayMode === 'LABELS_LEFT' || displayMode === 'DISPLAY_ONLY') {
    if (isTableFormatter && formatter !== 'URL' && formatExists(formatter)) {
      displayComp = textFormatter(formatter, value);
    }
    return displayMode === 'DISPLAY_ONLY' ? (
      displayComp
    ) : (
      <StyledPegaDxilMyUrlWrapper>
      <FieldValueList
        variant={hideLabel ? 'stacked' : variant}
        data-testid={testId}
        fields={[{ id: '1', name: hideLabel ? '' : label, value: displayComp }]}
      />
      </StyledPegaDxilMyUrlWrapper>
    );
  }

  if (displayMode === 'STACKED_LARGE_VAL') {
    return (
      <StyledPegaDxilMyUrlWrapper>
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
      </StyledPegaDxilMyUrlWrapper>
    );
  }

  const onResolveSuggestionHandler = (accepted) => {
    suggestionsHandler(accepted, pConn, setStatus);
  };

  return (
    <StyledPegaDxilMyUrlWrapper>
    <Input
      {...additionalProps}
      type='url'
      label={label}
      labelHidden={hideLabel}
      info={validatemessage || helperText}
      status={status}
      value={inputValue}
      placeholder={placeholder}
      disabled={disabled}
      readOnly={readOnly}
      required={required}
      data-testid={testId}
      onChange={(event) => {
        if (hasSuggestions) {
          setStatus(undefined);
        }
        setInputValue(event.target.value);
        if (value !== event.target.value) {
          handleEvent(actions, 'change', propName, event.target.value);
          hasValueChange.current = true;
        }
      }}
      onBlur={(event) => {
        if (!value || hasValueChange.current) {
          handleEvent(actions, 'blur', propName, event.target.value);
          if (hasSuggestions) {
            pConn.ignoreSuggestion();
          }
          hasValueChange.current = false;
        }
      }}
      onFocus={actions.onFocus}
      onResolveSuggestion={onResolveSuggestionHandler}
    />
    </StyledPegaDxilMyUrlWrapper>
  );
}

PegaDxilMyUrl.defaultProps = {
  value: '',
  placeholder: '',
  validatemessage: '',
  helperText: '',
  hideLabel: false,
  disabled: false,
  readOnly: false,
  required: false,
  testId: null,
  displayMode: null,
  additionalProps: {},
  variant: 'inline',
  formatter: '',
  isTableFormatter: false,
  displayAs: 'defaultURL',
  widthSel: 'defaultWidth',
  customWidth: null,
  altText: 'constant',
  altTextOfImage: '',
  propaltTextOfImage: '',
  urlLabel: '',
  propUrlLabel: '',
  urlLabelSelection: 'constant',
  tableDisplayAs: 'link',
  hasSuggestions: false
};

PegaDxilMyUrl.propTypes = {
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
  displayMode: PropTypes.string,
  additionalProps: PropTypes.objectOf(PropTypes.any),
  variant: PropTypes.string,
  formatter: PropTypes.string,
  isTableFormatter: PropTypes.bool,
  displayAs: PropTypes.string,
  widthSel: PropTypes.string,
  customWidth: PropTypes.number,
  altText: PropTypes.string,
  altTextOfImage: PropTypes.string,
  propaltTextOfImage: PropTypes.string,
  urlLabel: PropTypes.string,
  propUrlLabel: PropTypes.string,
  urlLabelSelection: PropTypes.string,
  tableDisplayAs: PropTypes.string,
  hasSuggestions: PropTypes.bool
};

export default PegaDxilMyUrl;
