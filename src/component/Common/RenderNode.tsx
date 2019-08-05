import React from 'react';

export function renderNode (
  Component: typeof React.Component,
  content?: string | number | Function | JSX.Element,
  props?: any,
): React.ReactNode {
  
  if (content === null || content === undefined) {
    return content;
  }

  if (React.isValidElement(content)) {
    return content;
  }

  if (typeof content === 'function') {
    return content();
  }

  return <Component {...props || {}} >{content}</Component>;
}