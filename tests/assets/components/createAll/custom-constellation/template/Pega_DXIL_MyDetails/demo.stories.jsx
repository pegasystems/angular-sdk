import { Text, FieldValueList, Button, DateTimeDisplay, useTheme } from '@pega/cosmos-react-core';
import PegaDxilMyDetails from './index';
import { pyReviewRaw, pyReviewResolved, regionChildrenResolved } from './mock.stories';
import StatusWorkRenderer from './StatusWork.jsx';

export default {
  title: 'PegaDxilMyDetails',
  component: PegaDxilMyDetails
};

const renderField = resolvedProps => {
  const {
    displayAsStatus = false,
    displayMode,
    value = '',
    label = '',
    key,
    // eslint-disable-next-line react-hooks/rules-of-hooks
    theme = useTheme()
  } = resolvedProps;

  const variant = displayMode === 'LABELS_LEFT' ? 'inline' : 'stacked';

  let val =
    value !== '' ? (
      <Text variant='h1' as='span' key={key}>
        {value}
      </Text>
    ) : (
      ''
    );

  if (label === 'Create date/time')
    val = (
      <DateTimeDisplay
        value={value}
        variant='datetime'
        format='long'
        clockFormat={null}
        key={key}
      />
    );

  if (displayAsStatus === true) val = <StatusWorkRenderer value={value} key={key} />;

  if (label === 'Create Operator')
    val = (
      <Button
        key={key}
        variant='link'
        style={
          label !== null
            ? { width: 'max-content', height: theme.components.input.height }
            : undefined
        }
      >
        {value.userName}
      </Button>
    );

  if (variant === 'inline') {
    val = value || (
      <span aria-hidden='true' key={key}>
        &ndash;&ndash;
      </span>
    );
  } else {
    val = (
      <Text variant='h1' as='span' key={key}>
        {val}
      </Text>
    );
  }
  return <FieldValueList variant={variant} fields={[{ name: label, value: val }]} key={key} />;
};

export const basePegaDxilMyDetails = () => {
  const props = {
    template: 'MyCo_MyComponents_NewDetailsTemplate',
    showHighlightedData: true,
    label: 'Test Details',
    showLabel: true,
    getPConnect: () => {
      return {
        getChildren: () => {
          return pyReviewRaw.children;
        },
        getRawMetadata: () => {
          return pyReviewRaw;
        },
        getInheritedProps: () => {
          return pyReviewRaw.config.inheritedProps;
        },
        createComponent: config => {
          // eslint-disable-next-line default-case
          switch (config.config.value) {
            case '@P .pyStatusWork':
              return renderField(pyReviewResolved.highlightedData[0].config);
            case '@P .pyID':
              return renderField(pyReviewResolved.highlightedData[1].config);
            case '@P .pxCreateDateTime':
              return renderField(pyReviewResolved.highlightedData[2].config);
            case '@USER .pxCreateOperator':
              return renderField(pyReviewResolved.highlightedData[3].config);
            case '@P .pySLADeadline':
              return renderField(regionChildrenResolved[0]);
            case '@P .pySLAGoal':
              return renderField(regionChildrenResolved[1]);
            case '@P .pySLAStartTime':
              return renderField(regionChildrenResolved[2]);
          }
        },
        setInheritedProp: () => {
          /* nothing */
        },
        resolveConfigProps: () => {
          /* nothing */
        }
      };
    }
  };

  const regionAChildren = pyReviewRaw.children[0].children.map(child => {
    return props.getPConnect().createComponent(child);
  });

  return (
    <>
      <PegaDxilMyDetails {...props}>{regionAChildren}</PegaDxilMyDetails>
    </>
  );
};
