import React, { Component } from 'react';

import Loader from '../components/loader/index';
import Calculator from './calculator/index';

//import socket from '../helpers/socket';

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
    // Just makes sure the site is loaded.
    //this.setState({isLoaded: !this.state.isLoaded});
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
