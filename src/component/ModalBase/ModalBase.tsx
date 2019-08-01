import React from 'react';
import classnames from 'classnames';
import "./index.less";

export type ModalBaseProps = {
  visible: boolean;
  className?: string;
  transitionName?: 'fade';
  transparent?: boolean;
};
type State = {};

const modalPrefix = 'modal-base';

class ModalBase extends React.Component<ModalBaseProps, State> {

  static defaultProps = {
    transitionName: 'fade',
    transparent: false,
  };

  render () {
    const { 
      visible, 
      className, 
      transparent,
      transitionName,
      ...rest
    } = this.props;

    const classNames = classnames(
      className, 
      `${transitionName}-${visible === true ? 'in' : 'out'}`,
      `${modalPrefix}`,
      {
        [`${modalPrefix}-transparent`]: transparent
      }
    );
    return (
      <div 
        {...rest} 
        className={classNames}
      >
        ModalBase
      </div>
    );
  }
}

export default ModalBase;