import React, { Component } from 'react';

import Loader from '../components/loader/index';
import Calculator from './calculator/index';

// import socket from '../helpers/socket';

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoaded: false,
      data: {a: '100', b: '200'} /* Change this to {} */
    }
  }

  // Initialization(s) that requires DOM nodes should go here
  // componentDidMount() {
  //     // Let the server know we are in
  //     socket.on('connect', function() {
  //         socket.send('[hello] ');
  //     });


  //     // Listen the server for messages
  //     socket.on('message', (msg) => {
  //     this.setState({isLoaded: !this.state.isLoaded}); // Just makes sure the site is loaded.
  //         // Chat clear 
  //         if( msg.startsWith("[response]") ) {
  //             msg = msg.replace("[response] ", "");
  //             console.log('socket-io response: ' + msg);
  //         }
  //     });
  // };

  render() {
    return (
      <>
        {this.state.isLoaded ? <Loader /> : null}
        <Calculator data={this.state.data} />
      </>
    )
  }
}
