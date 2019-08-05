import React, { ReactChildren } from 'react';

export function childToArray (children: ReactChildren): any[] {
  const childArray = React.Children.map(children, (child) => child);
  return childArray;
}

export function isReactElement (child: React.ReactNode): child is React.ReactElement {

  if ((<React.ReactElement> child).props) {
    return true;
  } else {
    return false;
  }
}
