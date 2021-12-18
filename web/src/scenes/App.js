import React, { Component } from 'react';
import Loader from '../components/loader/index';
import Calculator from './calculator/index';
import socket from '../helpers/socket';



export default class App extends Component 
{
  constructor(props) 
  {
    super(props);

    this.state = 
    {
      data: {},
      isLoaded: false
    }

    this.changeProps = this.changeProps.bind(this);
  }

  // Initialization(s) that requires DOM nodes should go here
  componentDidMount() 
  {
    // Let the server know we're in
    socket.on('connect', function() 
    {
      socket.send('[connection] ');
    });

    // Just in case we're dropping for some reason
    socket.on('disconnect', function() 
    {
      socket.socket.reconnect();
    });
    
  };

  changeProps = (data) => {
    this.setState(data);
  }

  render() 
  {
    return (
      <>
        {!this.state.isLoaded ? <Loader /> : null}
        <Calculator data={this.state.data} changeProps={this.changeProps} />
      </>
    )
  }
}
