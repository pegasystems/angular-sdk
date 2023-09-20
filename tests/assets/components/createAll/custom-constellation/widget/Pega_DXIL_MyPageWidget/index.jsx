import PropTypes from 'prop-types';
import { AppAnnouncement as PegaAppAnnouncement } from '@pega/cosmos-react-work';

import StyledPegaDxilMyPageWidgetWrapper from './styles';


// Duplicated runtime code from Constellation Design System Component

// props passed in combination of props from property panel (config.json) and run time props from Constellation
// any default values in config.pros should be set in defaultProps at bottom of this file
export default function PegaDxilMyPageWidget(props) {

  const { header, description, datasource, whatsnewlink, image } = props;
  let details = [];
  if (datasource && datasource.source) {
    details = datasource.source.map((item) => {
      return item.name;
    });
  }
  return (
    <StyledPegaDxilMyPageWidgetWrapper>
    <PegaAppAnnouncement
      heading={header}
      description={description}
      details={details}
      whatsNewLink={whatsnewlink}
      image={image.replace(/ /g, '+')}
    />
    </StyledPegaDxilMyPageWidgetWrapper>
  );

}

PegaDxilMyPageWidget.defaultProps = {
  header: '',
  description: '',
  image: '',
  datasource: [],
  whatsnewlink: ''
};

PegaDxilMyPageWidget.propTypes = {
  header: PropTypes.string,
  description: PropTypes.string,
  datasource: PropTypes.instanceOf(Object),
  whatsnewlink: PropTypes.string,
  image: PropTypes.string
};
