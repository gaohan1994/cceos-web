import * as React from 'react';
import Secure from '../../common/Secure';

export interface Props {

}

export default class Recharge extends React.Component<Props> {

  componentDidMount() {
    Secure.signEncrypt('hello');
  }

  public render() {
    return (
      <div>
        Recharge
      </div>
    );
  }
}
