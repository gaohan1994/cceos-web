import React from 'react';
import { childToArray } from './ReactUtil';
import AnimateChild, { AnimateChildProps } from './AnimateChild';
import { AnimateFuncition } from './AnimateChild';

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

  constructor (props: AnimateBaseProps) {
    super(props);
    this.state = {
      children: childToArray(getChildFromProps(props))
    };
    this.currentAnimatingKeys = {};
    this.childrenRefs = {};
  }

  public componentDidMount = () => {
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

  public handleDoneAdding = (key: React.Key, type: string) => {
    const { transitionEnter, transitionEnd } = this.props;
    if (type === 'enter' && transitionEnter) {
      transitionEnter(key);      
      if (transitionEnd) {
        transitionEnd(key, true);
      }
    }
  }

  public handleDoneLeaving = (key: React.Key) => {
    const { transitionLeave, transitionEnd } = this.props;
    if (transitionLeave) {
      transitionLeave(key);
      if (transitionEnd) {
        transitionEnd(key, true);
      }
    }
  }

  public perpareEnter = (key: React.Key) => {
    console.log('this.childrenRefs[key]: ', this.childrenRefs[key]);
    if (this.childrenRefs[key]) {
      this.currentAnimatingKeys[key] = true;
      if (this.childrenRefs[key]) {
        const currentChildren: any = this.childrenRefs[key];
        console.log('currentChildren: ', currentChildren);
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
    console.log('perpareAppear'); 
  }

  /**
   * [动画结束]
   *
   * @memberof Animate
   */
  public prepareLeave = (key: React.Key) => {
    console.log('prepareLeave');
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