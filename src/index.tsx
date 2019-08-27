import * as React from 'react';
import * as ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import { App } from './AppBuild';
import "./global.less";

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
registerServiceWorker();
