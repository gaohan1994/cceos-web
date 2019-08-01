import React from 'react';
import "./index.less";
// import classnames from 'classnames';
import ModalBase from '../ModalBase/ModalBase';

export type PacketModalProps = {
  visible: boolean;
};
type State = {};

class PacketModal extends React.Component<PacketModalProps, State> {

  public render () {
    const { ...rest } = this.props;
    return (
      <ModalBase
        {...rest}
      />
    );
  }
}

export default PacketModal;