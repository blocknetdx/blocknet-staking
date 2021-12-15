import React, { Component } from 'react';

import Loader from '../components/loader/index';
import Calculator from './calculator/index';

import socket from '../helpers/socket';

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoaded: false,
    }
  }

  componentDidMount() {
    // socket.on('server_status', () => {this.setState({isLoaded: !this.state.isLoaded})});
  }

  render() {
    return (
      <>
        {this.state.isLoaded ? <Loader /> : null}
        <Calculator />
      </>
    )
  }
}
