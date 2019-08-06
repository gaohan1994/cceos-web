import React from 'react';
import { childToArray } from './ReactUtil';
import AnimateChild, { AnimateChildProps } from './AnimateChild';
import { AnimateFuncition } from './AnimateChild';
import { merge } from 'lodash';

export type AnimateBaseProps = {
  children: React.ReactNode;
  showToken: string;
  transitionEnd?: AnimateFuncition;
} & AnimateChildProps;
type AnimateBaseState = {
  children: React.ReactNode[];
};

const BaseKey = 'animate-base-' + Date.now();

function getChildFromProps (props: any) {
  const { children } = props;

  if (React.isValidElement(children)) {
    if (!children.key) {
      return React.cloneElement(children, {
        key: BaseKey
      });
    }
  }

  return children;
}

class Animate extends React.Component<AnimateBaseProps, AnimateBaseState> {

  static defaultProps = {
    transitionName: 'animation-base',
    animationType: 'fade',
    transitionEnterToken: true,
    transitionAppearToken: true,
    transitionLeaveToken: true,
  };

  private currentAnimatingKeys: {
    [key: string]: React.ReactNode;
  };
  private childrenRefs: {
    [key: string]: React.ReactNode;
  };
  private keysToEnter: any[];
  private keysToLeave: any[];

  constructor (props: AnimateBaseProps) {
    super(props);
    this.state = {
      children: childToArray(getChildFromProps(props))
    };
    this.currentAnimatingKeys = {};
    this.childrenRefs = {};
    this.keysToEnter = [];
    this.keysToLeave = [];
  }

  public componentDidMount = () => {
    // console.log('componentDidMount: ', this.props);
    const { showToken } = this.props;
    const { children } = this.state;
    let currentChildren: React.ReactNode[] = [];
    if (showToken) {
      currentChildren = children.filter((child) => {
        if (child && React.isValidElement(child)) {
          return !!child.props[showToken];
        } else {
          return false;
        }
      });
    }

    currentChildren.forEach((child) => {
      if (child && React.isValidElement(child) && child.key) {
        this.perpareEnter(child.key);
      }
    });
  }

  public componentWillReceiveProps = (nextProps: AnimateBaseProps) => {
    // console.log('componentWillReceiveProps: ');
    // console.log('showToken: ', nextProps.showToken);
    const { showToken } = this.props;
    const { } = nextProps;

    const { children } = this.state;
    const nextChildren = childToArray(getChildFromProps(nextProps));
    // console.log('children: ', children);
    // console.log('nextChildren: ', nextChildren);
    // console.log('currentAnimatingKeys: ', this.currentAnimatingKeys);
    nextChildren.forEach((child) => {
      const key = child && child.key;

      if (child && this.currentAnimatingKeys[key]) {
        return;
      }

      if (showToken) {
        this.keysToEnter.push(key);
      }
    });

    children.forEach((child: any) => {
      const key = child && child.key;

      if (child && this.currentAnimatingKeys[key]) {
        return;
      }

      if (showToken) {
        this.keysToLeave.push(key);
      }
    });

    // console.log('this.keys', this.keysToEnter);
    // console.log('this.keys', this.keysToLeave);
  }

  public componentDidUpdate = () => {
    const keysToEnterMerge = merge([], this.keysToEnter);
    this.keysToEnter = [];
    // console.log('keysToEnterMerge:', keysToEnterMerge);
    keysToEnterMerge.forEach(this.perpareEnter);

    const keysToLeaveMerge = merge([], this.keysToLeave);
    this.keysToLeave = [];
    // console.log('keysToLeaveMerge: ', keysToLeaveMerge);
    keysToLeaveMerge.forEach(this.prepareLeave);
  }
  
  public handleDoneAdding = (key: React.Key, type: string) => {
    const { transitionEnter, transitionEnd } = this.props;
    delete this.currentAnimatingKeys[key];
    if (type === 'enter' && transitionEnter) {
      transitionEnter(key);      
      if (transitionEnd) {
        transitionEnd(key, true);
      }
    }
  }

  public handleDoneLeaving = (key: React.Key) => {
    const { transitionLeave, transitionEnd } = this.props;
    delete this.currentAnimatingKeys[key];
    if (transitionLeave) {
      transitionLeave(key);
      if (transitionEnd) {
        transitionEnd(key, true);
      }
    }
  }

  public perpareEnter = (key: React.Key) => {
    if (this.childrenRefs[key]) {
      this.currentAnimatingKeys[key] = true;
      if (this.childrenRefs[key]) {
        const currentChildren: any = this.childrenRefs[key];
        currentChildren.componentWillEnter(() => this.handleDoneAdding(key, 'enter'));
      }
    }
  }

  /**
   * [进入动画]
   *
   * @memberof Animate
   */
  public perpareAppear = (key: React.Key) => {
    // console.log('perpareAppear'); 
  }

  /**
   * [动画结束]
   *
   * @memberof Animate
   */
  public prepareLeave = (key: React.Key) => {
    // console.log('prepareLeave');
    if (this.childrenRefs[key]) {
      this.currentAnimatingKeys[key] = true;
      if (this.childrenRefs[key]) {
        const currentChildren: any = this.childrenRefs[key];
        currentChildren.componentWillLeave(() => this.handleDoneLeaving(key));
      }
    }
  }

  render () {
    const { children } = this.state;
    const { 
      transitionName,
      animationType,
      transitionAppear,
      transitionEnter,
      transitionLeave,
      ...rest
    } = this.props;
    // console.log('this.state', this.state);
    let renderChildren: any = null;

    if (children) {
      renderChildren = children.map((child) => {
        if (React.isValidElement(child)) {
          if (child.key !== null) {
            return (
              <AnimateChild
                key={child.key}
                transitionName={transitionName}
                animationType={animationType}
                ref={(AnimateChildNode: any) => this.childrenRefs[`${child.key}`] = AnimateChildNode}
                transitionAppear={transitionAppear}
                transitionEnter={transitionEnter}
                transitionLeave={transitionLeave}
                {...rest}
              >
                {child}
              </AnimateChild>
            );
          } else {
            throw new Error('please set the Animate Component key');
          }
        }

        return child;
      });
    }
    return renderChildren[0] || null;
  }
}

export default Animate;