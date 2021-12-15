import React, { Component } from 'react';

import Loader from '../components/loader/index';
import Calculator from './calculator/index';

import socket from '../helpers/socket';

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoaded: false,
      data: []
    }
  }

  componentDidMount() {
    if (!localStorage.getItem('data')) return console.log('User has no localstorage, update');

    this.setState({
      data: localStorage.getItem('item')
    })

    socket.on('update', )
  }

  updateStorage = (data) => {
    localStorage.setItem('data', data);
  }

  onChange = () => {
    
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
