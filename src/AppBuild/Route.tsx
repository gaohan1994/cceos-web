import React from 'react';
import { BrowserRouter, Router, Switch, Route, RouteProps } from 'react-router-dom';
import { AnimatedSwitch, spring } from 'react-router-transition';
import "./App.css";
import history from '../history';

export type WebNavigator = {

} & RouteProps;

export type CreateWebNavigationParams = {
  routes: WebNavigator[];
  transition?: boolean;
};

function createWebNavigation (params: CreateWebNavigationParams): any {
  const { routes, transition = true } = params;
  return class extends React.Component<any, any> {
    render () {

      const { SwitchComponent, SwitchProps } = createSwitchNavigation(transition);

      return (
        <BrowserRouter>
          <Router history={history} >
            <SwitchComponent {...SwitchProps} >
              {
                routes.map((item: WebNavigator, index: number) => {
                  const { ...rest } = item;
                  return (
                    <Route key={index} {...rest} />
                  );
                })
              }
            </SwitchComponent>
          </Router>
        </BrowserRouter>
      );
    }
  };
}

function mapStyles(styles: any) {
  return {
    opacity: styles.opacity,
    transform: `scale(${styles.scale})`,
  };
}

function bounce (val: number) {
  return spring(val, {
    stiffness: 330,
    damping: 22,
  });
}

const switchTransition = {
  atEnter: {
    opacity: 0,
    scale: 1.2,
  },
  atLeave: {
    opacity: bounce(0),
    scale: bounce(0.8),
  },
  atActive: {
    opacity: bounce(1),
    scale: bounce(1),
  },
};

function createSwitchNavigation (transition: boolean): { SwitchComponent: any, SwitchProps: any } {
  
  if (transition === true) {
    /**
     * [启用跳转动画]
     */
    return { 
      SwitchComponent: AnimatedSwitch, 
      SwitchProps: {
        atEnter: switchTransition.atEnter,
        atLeave: switchTransition.atLeave,
        atActive: switchTransition.atActive,
        mapStyles: mapStyles,
        className: "route-wrapper",
      } 
    };
  } else {
    /**
     * [不启用跳转动画]
     */
    return { SwitchComponent: Switch, SwitchProps: {} };
  }
}

export { createWebNavigation };