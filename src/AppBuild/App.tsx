import * as React from 'react';
import { createWebNavigation, WebNavigator } from './Route';
import { Home, Packet } from '../container';

const routes: WebNavigator[] = [
  {
    path: '/',
    component: Home,
    exact: true,
  },
  {
    path: '/packet',
    component: Packet
  }
];
const MyWebNavigation = createWebNavigation({ routes });

export interface Props { }

class App extends React.Component<Props> {
  public render() {
    return (
      <MyWebNavigation />
    );
  }
}

export default App;