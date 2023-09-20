/* eslint-disable no-undef */
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Table, Text } from '@pega/cosmos-react-core';

import StyledPegaDxilMyCaseWidgetWrapper from './styles';


// Duplicated runtime code from Constellation Design System Component

// props passed in combination of props from property panel (config.json) and run time props from Constellation
// any default values in config.pros should be set in defaultProps at bottom of this file
export default function PegaDxilMyCaseWidget(props) {
  const { getPConnect, label } = props;
  const pConn = getPConnect();
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const caseID = pConn.getValue(PCore.getConstants().CASE_INFO.CASE_INFO_ID);
  const context = pConn.getContextName();

  const columns = [
    { renderer: 'date', label: pConn.getLocalizedValue('Date') },
    { renderer: 'description', label: pConn.getLocalizedValue('Description') },
    { renderer: 'user', label: pConn.getLocalizedValue('Performed by') }
  ];

  useEffect(() => {
    const payload = { dataViewParameters: [{ CaseInstanceKey: caseID }] };
    PCore.getDataApiUtils()
      .getData('D_pyWorkHistory', payload, context)
      .then((response) => {
        setIsLoading(false);
        if (response.data.data !== null) {
          setHistory(
            response.data.data.map((entry, index) => {
              return {
                date: new Date(entry.pxTimeCreated).toLocaleString(),
                description: <Text style={{ wordBreak: 'break-word' }}>{entry.pyMessageKey}</Text>,
                user: entry.pyPerformer,
                id: index
              };
            })
          );
        } else {
          setHistory([]);
        }
      })
      .catch(() => {
        setHistory([]);
        setIsLoading(false);
      });
  }, [caseID, context]);
  return (
    <StyledPegaDxilMyCaseWidgetWrapper>
    <Table
      title={pConn.getLocalizedValue(label)}
      columns={columns}
      data={history}
      loading={isLoading}
      loadingMessage={pConn.getLocalizedValue('Loading case history')}
    />
    </StyledPegaDxilMyCaseWidgetWrapper>
  );

}

PegaDxilMyCaseWidget.defaultProps = {

};

PegaDxilMyCaseWidget.propTypes = {
  getPConnect: PropTypes.func.isRequired
};
