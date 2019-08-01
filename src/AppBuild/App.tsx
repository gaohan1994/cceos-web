import * as React from 'react';
import { createWebNavigation, WebNavigator } from './Route';
import { Home, Packet } from '../container';
import { Provider } from 'react-redux';
import { configureStore } from '../store';

export const AppStore = configureStore();

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
      <Provider store={AppStore} >
        <MyWebNavigation />
      </Provider>
    );
  }
}

export default App;