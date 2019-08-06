import React from 'react';
import "./index.less";
import { Modal } from '../ModalBase';
// import classnames from 'classnames';
import { ModalWrapProps } from '../ModalBase/ModalWrap';

export type PacketModalProps = ModalWrapProps;
type State = {};

class PacketModal extends React.Component<PacketModalProps, State> {

  public render () {
    const { children, ...rest } = this.props;
    return (
      <Modal
        {...rest}
      >
        {children}
      </Modal>
    );
  }
}

export default PacketModal;