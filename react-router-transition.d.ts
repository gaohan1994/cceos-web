import React from 'react';

export type AnimatedSwitchProps = {
  atEnter?: any;
  atLeave?: any;  
  atActive?: any; 
  mapStyles?: any;
  runOnMount?: boolean;
  wrapperComponent?: any;
  className?: any;
};

export class AnimatedSwitch extends React.Component <AnimatedSwitchProps, any> { }

export function spring (params1?: any, params2?: any): any; 