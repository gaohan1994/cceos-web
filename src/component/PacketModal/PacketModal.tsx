import React from 'react';
import "./index.less";
import ModalWrap from '../ModalBase/ModalWrap';
// import classnames from 'classnames';

export type PacketModalProps = {
  visible: boolean;
};
type State = {};

class PacketModal extends React.Component<PacketModalProps, State> {

  public render () {
    const { children, ...rest } = this.props;
    return (
      <ModalWrap
        {...rest}
      >
        {children}
      </ModalWrap>
    );
  }
}

export default PacketModal;