import React, { Component } from 'react';

import Loader from '../components/loader/index';
import Calculator from './calculator/index';

import socket from '../helpers/socket';

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoaded: false,
      data: {}
    }
  }

  // Initialization(s) that requires DOM nodes should go here
  componentDidMount() 
  {
    // Let the server know we are in
    socket.on('connect', function() 
    {
      socket.send('[connection] ');
    });
    
    // Listen the server for messages
    socket.on('message', (msg) => 
    {
      // Just makes sure the site is loaded.
      this.setState({isLoaded: !this.state.isLoaded});

      // Save the message => we'll handle it in calculator/index.js
      this.setState({data:msg})

      console.log('python res: ' + msg);
    });
  };

  render() {
    return (
      <>
        {/*this.state.isLoaded ? <Loader /> : null*/}
        <Calculator data={this.state.data}/>
      </>
    )
  }
}
