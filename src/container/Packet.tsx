import React, { Component } from 'react';
import history from '../history';
type Props = {};

export default class Packet extends Component<Props> {
  render() {
    return (
      <div onClick={() => { history.push('/'); }}>
        to Home
      </div>
    );
  }
}
