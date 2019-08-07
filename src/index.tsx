import * as React from 'react';
import * as ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import { App } from './AppBuild';
import "./global.less";

function ReactRenderCallback (): void {
  console.log('ReactRenderCallback done');
}

ReactDOM.render(
  <App />,
  document.getElementById('root'),
  ReactRenderCallback
);
registerServiceWorker();
