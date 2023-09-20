import { FieldValueList } from '@pega/cosmos-react-core';
import PropTypes from 'prop-types';

import { format } from './date.js';

export default function FormattedText(props) {
  const { formatType, label, value, testId, hideLabel, variant, additionalProps } = props;

  let text = value;

  text = format(text, formatType, additionalProps);

  const fields = [
    {
      id: label.toLowerCase(),
      name: hideLabel ? '' : label,
      value: text
    }
  ];
  return <FieldValueList variant={variant} fields={fields} data-testid={testId} />;
}

FormattedText.defaultProps = {
  formatType: 'none',
  variant: 'stacked',
  value: undefined,
  label: '',
  testId: null,
  hideLabel: false,
  additionalProps: {}
};

FormattedText.propTypes = {
  formatType: PropTypes.string,
  variant: PropTypes.oneOf(['inline', 'stacked']),
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]),
  label: PropTypes.string,
  testId: PropTypes.string,
  additionalProps: PropTypes.objectOf(PropTypes.any),
  hideLabel: PropTypes.bool
};
