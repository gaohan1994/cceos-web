import * as React from 'react';
import { createWebNavigation, WebNavigator } from './Route';
import { Home, Packet, Recharge, BindUser, User, History, Result } from '../container';
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
    path: `/packet/:openId/:bonusToken`,
    component: Packet,
    exact: true,
  },
  {
    path: `/recharge/:openId`,
    component: Recharge,
    exact: true,
  },
  {
    path: `/binduser/:openId/:params`,
    component: BindUser,
    exact: true,
  },
  {
    path: `/user/:openId`,
    component: User,
    exact: true,
  },
  {
    path: `/history/:openId`,
    component: History,
    exact: true,
  },
  {
    path: `/result/:params`,
    component: Result,
    exact: true,
  },
];
const MyWebNavigation = createWebNavigation({ routes });

export interface Props { }

class App extends React.Component<Props> {

  constructor (props: Props) {
    super(props);
    this.init();
  }

  public init = () => {
    // 
  }

  public render() {
    return (
      <Provider store={AppStore} >
        <MyWebNavigation />
      </Provider>
    );
  }
}

export default App;