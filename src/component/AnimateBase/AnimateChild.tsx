import * as React from 'react';
import cssAnimation from 'css-animation';
import AnimateUtil from './AnimateUtil';
import * as ReactDOM from 'react-dom';

export interface AnimateFuncition {
  (): any;
}

export interface AnimateFuncition {
  (params: any): any;
}

export interface AnimateFuncition {
  (params1: any, params2: any): any;
}

export type AnimateChildProps = { 
  transitionName?: string;
  animationType?: 'fade';
  transitionEnter?: AnimateFuncition;
  transitionEnterToken?: boolean;
  transitionAppear?: AnimateFuncition;
  transitionAppearToken?: boolean;
  transitionLeave?: AnimateFuncition;
  transitionLeaveToken?: boolean;
};

export default class AnimateChild extends React.Component<AnimateChildProps> {

  private stopper: any;

  public componentWillUnmount = () => {
    this.stop();
  }

  public componentWillEnter = (callback: any): void => {
    if (AnimateUtil.isEnterSupported(this.props)) {
      this.transition('enter', callback);
    } else {
      callback();
    }
  }

  public componentWillLeave = (callback: any): void => {
    // console.log('componentWillLeave: ');

    if (AnimateUtil.isLeaveSupported) {
      this.transition('leave', callback);
    } else {
      callback();
    }
  }

  public transition = (animationWay: string, callback: () => void): void => {
    // console.log('animate child props', this.props);
    /**
     * [1.找到做动画的dom]
     * [2.停止之前的动画]
     * [3.定义好结束callback和动画名字]
     * [4.执行动画]
     */
    const { transitionName, animationType } = this.props;
    const node = ReactDOM.findDOMNode(this);
    this.stop();

    const end = () => {
      this.stopper = null;
      callback();
    };

    const name = transitionName + '-' + animationType + '-' + animationWay;
    this.stopper = cssAnimation(node, {
      name,
      active: name + '-active',
    }, end);
  }

  public stop = () => {
    const thatStopper = this.stopper;
    if (thatStopper) {
      this.stopper = null;
      thatStopper.stop();
    }
  }

  public render() {
    return this.props.children;
  }
}
