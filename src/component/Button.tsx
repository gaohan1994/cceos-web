
import React from 'react';

type ButtonProps = {
  title: string | number | JSX.Element;
};

const Button = (props: ButtonProps): React.ReactNode => {

  const { 
    title
  } = props;

  return (
    <div>
      {
        typeof title === 'string' || typeof title === 'number' ? (
          <div>{title}</div>
        ) : title
      }
    </div>
  );
};

export default Button;