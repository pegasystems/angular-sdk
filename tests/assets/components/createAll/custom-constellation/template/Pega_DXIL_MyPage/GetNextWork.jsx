/* eslint-disable no-undef */
import { Button, useToaster } from '@pega/cosmos-react-core';

export default function GetNextWork(props) {
  const { getPConnect, variant } = props;

  const toasterCtx = useToaster();

  const localizedVal = PCore.getLocaleUtils().getLocaleValue;

  const getNextWork = () => {

    // alert('Get next work clicked');

    getPConnect()
      .getActionsApi()
      .getNextWork()
      .catch((err) => {
        /* eslint-disable no-console */
        console.log(err);
        /* eslint-enable no-console */
        if (err[0].status === 404) {
          toasterCtx.push({
            content: localizedVal('No task currently available')
          });
        }
      });
  };

  return (
    <Button variant={variant} onClick={getNextWork}>
      {getPConnect().getLocalizedValue('Get next work')}
    </Button>
  );
}
