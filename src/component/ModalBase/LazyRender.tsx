import * as React from 'react';

type Props = { 
  className?: string;
  hiddenClassName?: string;
  visible?: boolean;
};

export default class LazyRender extends React.Component<Props> {

  public shouldComponentUpdate = () => {
    const { hiddenClassName, visible } = this.props;
    return !!hiddenClassName || !!visible;
  }

  public render() {
    const { className, hiddenClassName, visible, ...rest } = this.props;
    let renderClassName = className;
    if (!!hiddenClassName && !visible) {
      /**
       * [存在hiddenClassName而且visible是false]
       */
      renderClassName += ` ${hiddenClassName}`;
    }

    return (
      <div className={renderClassName} {...rest} />
    );
  }
}
