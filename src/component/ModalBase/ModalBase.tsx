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
  transitionName?: 'fade';
  transparent?: boolean;
} & Partial<AnimateBaseProps>;
type State = {};

const modalPrefix = 'modal-base';

class ModalBase extends React.Component<ModalBaseProps, State> {
  static defaultProps = {
    transitionName: 'fade',
    transparent: false,
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
  
  render () {
    const { 
      // visible, 
      className, 
      transparent,
      // transitionName,
      // children,
      // ...rest
    } = this.props;

    const classNames = classnames(
      className, 
      `${modalPrefix}`,
      {
        [`${modalPrefix}-transparent`]: transparent
      }
    );
    return (
      <div 
        // {...rest} 
        className={classNames}
      >
        {this.renderMaskElement()}
        {this.renderAnimateElement()}
      </div>
    );
  }

  private renderMaskElement = () => {
    const { maskStyle = {}, maskProps = {}, visible } = this.props;
    const MaskElement = (
      <LazyRender 
        style={maskStyle || {}}
        className={`${modalPrefix}-mask`}
        hiddenClassName={`${modalPrefix}-mask-hidden`}
        visible={visible}
        {...maskProps}
      />
    );
    return (
      <Animate key="modal-mask" showToken="visible" >{MaskElement}</Animate>
    );
  }

  private renderAnimateElement = () => {
    const { children, title, classNamePrefix } = this.props;

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
      <LazyRender>
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