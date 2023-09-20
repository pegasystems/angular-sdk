import { Fragment } from 'react';
import { Grid, Flex, FieldGroup } from '@pega/cosmos-react-core';
import PropTypes from 'prop-types';

import StyledPegaDxilMyDetailsWrapper from './styles';

// includes in bundle
import { getAllFields } from './utils';

// Duplicated runtime code from Constellation Design System Component

// props passed in combination of props from property panel (config.json) and run time props from Constellation
// any default values in config.pros should be set in defaultProps at bottom of this file
export default function PegaDxilMyDetails(props) {

  const { getPConnect, children, label, showLabel, showHighlightedData  } = props;
  const propsToUse = { label, showLabel, ...getPConnect().getInheritedProps() };

  const numRegions = getAllFields(getPConnect)?.length;
  const gridRepeat = "repeat(".concat(numRegions).concat(", 1fr)");
  const gridContainer = { "colGap": 1};
  gridContainer.cols = gridRepeat;
  gridContainer.alignItems = 'start';

  const gridHighlightContainer = { "gap": 2};
  gridHighlightContainer.cols = gridRepeat;
  gridHighlightContainer.alignItems = 'start';
  gridHighlightContainer.pad = [0, 0, 2, 0];

  // Set up highlighted data to pass in return if is set to show, need raw metadata to pass to createComponent
  let highlightedDataArr = [];
  if (showHighlightedData) {
    const { highlightedData = [] } = getPConnect().getRawMetadata().config;
    highlightedDataArr = highlightedData.map((field) => {
      field.config.displayMode = 'STACKED_LARGE_VAL';

      // Mark as status display when using pyStatusWork
      if (field.config.value === '@P .pyStatusWork') {
        field.type = 'TextInput';
        field.config.displayAsStatus = true;
      }

      return getPConnect().createComponent(field);
    });
  }

  return (
    <StyledPegaDxilMyDetailsWrapper>
    <FieldGroup name={propsToUse.showLabel ? propsToUse.label : ''}>
      {showHighlightedData && highlightedDataArr.length > 0 && (
        <Grid container={gridHighlightContainer}
          data-testid={`highlighted-column-count-${numRegions}`}>
          {highlightedDataArr.map((child, i) => (
            <Fragment key={`hf-${i + 1}`}>{child}</Fragment>
          ))}
        </Grid>
      )}
      <Grid container={gridContainer} data-testid={`column-count-${numRegions}`} >
       {children.map((child, i) => (
        <Flex container={{ direction: 'column'}} key={`r-${i + 1}`}>
        {child}
        </Flex>
       ))}
      </Grid>
    </FieldGroup>
    </StyledPegaDxilMyDetailsWrapper>
  );

}

PegaDxilMyDetails.defaultProps = {
  label: undefined,
  showLabel: true,
  showHighlightedData: false
};


PegaDxilMyDetails.propTypes = {
  showLabel: PropTypes.bool,
  label: PropTypes.string,
  getPConnect: PropTypes.func.isRequired,
  showHighlightedData: PropTypes.bool
};
