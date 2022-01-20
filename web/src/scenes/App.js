import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import React, { Component } from 'react';
import { BrowserRouter as Router, Routes } from 'react-router-dom';

import Loader from '../components/loader/index';
import Footer from '../components/footer/index';
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
                <Router>
                    <Calculator data={this.state.data} changeProps={this.changeProps} />
                    <Footer />
                    <Routes />
                </Router>
            </>
        )
    }
}
