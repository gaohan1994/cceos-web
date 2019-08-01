import * as React from 'react';
import './App.css';
import { } from '../component';
import history from '../history';

class App extends React.Component {
  public render() {
    return (
      <div className="App">
        
        <div onClick={() => { history.push('/packet'); }}>
          to packet
        </div>

        <div onClick={() => { history.push('/recharge'); }}>
          to recharge
        </div>
      </div>
    );
  }
}

export default App;
