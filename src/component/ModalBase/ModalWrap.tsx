import * as React from 'react';
import ReactDOM from 'react-dom';
import Modal, { ModalBaseProps } from './ModalBase';

export type ModalWrapProps = { 
  prefixCls?: string;
} & ModalBaseProps;

export default class ModalWrap extends React.Component<ModalWrapProps> {

  static defaultProps = {
    prefixCls: 'modal'
  };

  private container: Element | null;

  public shouldComponentUpdate = (nextProps: ModalWrapProps) => {
    const { visible } = nextProps;
    return !!(this.props.visible || visible);
  }

  public componentWillUnmount = () => {
    this.removeContainerNode();
  }

  public getChildNode = (visible: boolean) => {

    const { visible: propsVisible, transitionLeave, ...rest } = this.props;
    return (
      <Modal
        {...rest}
        visible={visible}
        transitionLeave={this.removeContainerNode}
      />
    );
  }

  public removeContainerNode = () => {
    if (this.container) {
      if (this.container.parentNode) {
        this.container.parentNode.removeChild(this.container);
        this.container = null;
      }
    }
  }

  public getContainerNode = () => {
    if (!this.container) {
      const container = document.createElement('div');
      const containerId = this.props.prefixCls + '-container-' + new Date().getTime();
      container.setAttribute('id', containerId);
      document.body.appendChild(container);
      this.container = container;
    }
    return this.container;
  }

  public render() {
    const { visible } = this.props;

    if (visible === true) {
      return ReactDOM.createPortal(this.getChildNode(visible), this.getContainerNode());
    } else {
      return null;
    }
  }
}
