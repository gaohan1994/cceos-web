import React from 'react';
import { BrowserRouter, Switch, Route, RouteProps } from 'react-router-dom';

export type WebNavigator = {

} & RouteProps;

export type CreateWebNavigationParams = {
  routes: WebNavigator[];
};

function createWebNavigation (params: CreateWebNavigationParams): any {
  const { routes } = params;
  return class extends React.Component<any, any> {
    render () {
      return (
        <BrowserRouter>
          <Switch>
            {
              routes.map((item: WebNavigator, index: number) => {
                const { ...rest } = item;
                return (
                  <Route key={index} {...rest} />
                );
              })
            }
          </Switch>
        </BrowserRouter>
      );
    }
  };
}

export { createWebNavigation };