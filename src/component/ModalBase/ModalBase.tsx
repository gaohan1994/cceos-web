import React from 'react';
import classnames from 'classnames';
import "./index.less";
import Animate from '../AnimateBase/Animate';
import LazyRender from './LazyRender';
import { AnimateBaseProps } from '../AnimateBase/Animate';

export type ModalBaseProps = {
  visible: boolean;
  title?: string | number | JSX.Element;
  className?: string;
  classNamePrefix?: string;
  maskStyle?: any;
  maskProps?: any;
  maskClose?: boolean;
  transitionName?: 'fade';
  transparent?: boolean;
  onClose?: (params?: any) => any;
} & Partial<AnimateBaseProps>;
type State = {};

const modalPrefix = 'modal-base';

class ModalBase extends React.Component<ModalBaseProps, State> {
  static defaultProps = {
    transitionName: 'fade',
    transparent: false,
    classNamePrefix: modalPrefix,
    maskClose: true,
  };

  // private headerRef: any;

  public onTransitionEnter = () => {
    console.log('public onTransitionEnter');
  }
  public onTransitionAppear = () => {
    console.log('public onTransitionAppear');
  }
  public onTransitionLeave = () => {
    console.log('public onTransitionLeave');

    if (this.props.transitionLeave) {
      this.props.transitionLeave();
    }
  }

  public onClose = (e: any) => {
    if (this.props.onClose) {
      this.props.onClose(e);
    }
  }

  public onMaskClick = (e: any) => {
    if (e.target === e.currentTarget) {
      this.onClose(e);
    }
  }
  
  render () {
    const { 
      visible, 
      className, 
      classNamePrefix,
      transparent,
      maskClose,
      // transitionName,
      // children,
      // ...rest
    } = this.props;
    console.log('visible: ', visible);
    const classNames = classnames(
      className, 
      `${classNamePrefix}`,
      {
        [`${classNamePrefix}-transparent`]: transparent
      }
    );
    return (
      <div 
        // {...rest} 
        className={classNames}
      >
        {this.renderMaskElement()}
        <div 
          className={`${classNamePrefix}-wrap`} 
          onClick={maskClose === true ? this.onMaskClick : undefined}
        >
          {this.renderAnimateElement()}
        </div>
      </div>
    );
  }

  private renderMaskElement = () => {
    const { classNamePrefix, maskStyle = {}, maskProps = {}, visible } = this.props;
    const MaskElement = (
      <LazyRender 
        style={maskStyle || {}}
        className={`${classNamePrefix}-mask`}
        hiddenClassName={`${classNamePrefix}-mask-hidden`}
        visible={visible}
        {...maskProps}
      />
    );
    return (
      <Animate key="modal-mask" showToken="visible" >{MaskElement}</Animate>
    );
  }

  private renderAnimateElement = () => {
    const { visible, children, title, classNamePrefix } = this.props;

    const header = 
      (typeof title === 'string' || typeof title === 'number') 
      ? (
        <div 
          className={`${classNamePrefix}-header`}
          // ref={(headerRef: any) => { this.headerRef = headerRef; }}
        >
          <div className={`${classNamePrefix}-title`}>{title}</div>
        </div>
      )
      : title;

    // const footer = 
    //   (typeof title === 'string' || typeof title === 'number') 
    //   ? (<div>{title}</div>)
    //   : title;

    const AnimateElement = (
      <LazyRender
        visible={visible}
        className={`${classNamePrefix}-content`}
      >
        {header}
        {children}
        {/* {footer} */}
      </LazyRender>
    );

    return (
      <Animate
        key="modal"
        showToken="visible"
        transitionEnter={this.onTransitionEnter}
        transitionAppear={this.onTransitionAppear}
        transitionLeave={this.onTransitionLeave}
      >
        {AnimateElement}
      </Animate>
    );
  }
}

export default ModalBase;