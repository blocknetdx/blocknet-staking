import React, { Component } from 'react';
import Countup from 'react-countup';

import socket from '../../helpers/socket';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle, faSortNumericUpAlt } from '@fortawesome/free-solid-svg-icons';

import styles from './index.module.css';

let ROI;
let yearly_rewards;

const Arrow = (props) => (
    <svg width="14" height="12" viewBox="0 0 10 11" className={styles.arrow} style={{right: props.right || '', top: props.top || ''}}>
      <path d="M0.999998 7.23205C-0.333335 6.46225 -0.333333 4.53775 1 3.76795L6.25 0.736859C7.58333 -0.032941 9.25 0.929311 9.25 2.46891V8.53109C9.25 10.0707 7.58333 11.0329 6.25 10.2631L0.999998 7.23205Z" fill="#0F0F0F"/>
    </svg>
);



export default class index extends Component {
    constructor(props) {
        super(props);

        this.state = {
            block: 5000,
            stakeFor: '3 years',
            price: '5.00',
            calcs: [],
            usdPrices: [],

            data:{},

            userOutputs: {
                daily: '444', monthly: '321', yearly: '123', years3: '5'
            }
        };


        this.usdPrices = this.usdPrices.bind(this);
        this.onMonths = this.onMonths.bind(this);
    }

    // Initialization(s) that requires DOM nodes should go here
    componentDidMount() 
    {
        // Let the server know we're in
        socket.on('connect', function() 
        {
            socket.send('[connection] ');
        });

        // Listen the server for messages
        socket.on('message', (msg) => 
        {
            console.log('python response: ' + msg);

            this.setState({data:msg})

            // Message from socketio 
            let json_response = this.state.data; 

            console.log('datatype:' + String( typeof(json_response) ) ); 

            if( String( typeof(json_response) ) === 'object' )
            {
                console.log('data:' + JSON.stringify(json_response) );
            }

            // Check if we got some data and not an empty object
            if( String( typeof(json_response) ) === 'string' )
            {
                // Parse the json string 
                const obj = JSON.parse(json_response);

                // We have price 
                if(obj.hasOwnProperty('price'))
                {
                    var res_price = parseFloat(obj.price);
                    console.log('price: ' + res_price);

                    // Update frontend
                    this.setState({price: res_price});
                }

                // We have the supply
                if(obj.hasOwnProperty('supply'))
                {
                    var res_supply = parseFloat(obj.supply);
                    console.log('supply: ' + res_supply);

                    // Update frontend
                    //this.setState({price: res_price});
                }

                // We have total staking amount of blocknet
                if(obj.hasOwnProperty('staking'))
                {
                    // Staking ROI = ( [525600] / [total BLOCK staked on the network] ) * 100

                    var res_staking = parseFloat(obj.staking);

                    ROI = (525600 / res_staking) * 100;
                    yearly_rewards = this.state.block * (525600 / res_staking);
                    
                    // Update frontend, which doesn't work. WeirdChamp
                    this.setState({yearly: yearly_rewards});

                    console.log('staking: ' + res_staking);
                    console.log('yearly_rewards: ' + yearly_rewards);
                }
            }
        });
    }

    usdPrices = () => {
        let all = [];
        let prices = ['4.00', '5.00', '7.50', '10.00', '20.00', '100.00'];
        let emojis = ['💪', '🙂', '😋', '😝', '🤑', '🚀'];

        for(let i = 0; i < prices.length; i++) {
            let percentage = Math.round((prices[i] - this.state.price) / this.state.price * 100);
            all.push(
                <span className={styles.item} onClick={e => this.setState({price: prices[i]})} key={i}>
                    <p>${prices[i]}</p>
                    <small>{prices[i] === this.state.price ? 'current ' : percentage.toFixed(0) + '% '}<span className={styles.emoji}>{emojis[i]}</span></small>
                </span>
            )
        }
        return(all);
    }

    onMonths = () => {
        let all = [];
        let time = ['1 month', '3 months', '6 months', '1 year', '3 years', '5 years', '10 years'];

        for(let i = 0; i < time.length; i++) {
            all.push(
                <span className={styles.item} onClick={e => this.setState({stakeFor: time[i]})} key={i}><p>{time[i]}</p><small>{this.state.stakeFor === time[i] ? 'current' : null}</small></span>
            )
        }
        return(all);
    }

    render() {
        return (
            <div className={`container`}>
                <h4>Example props: {this.state.calcs}</h4> {/* Example, remove this later on */}
                <div className={styles.top}>
                    <h2 className={styles.title}>Blocknet Staking Calculator</h2>
                    <p className={styles.sub}>With the tool below you can calculate your staking reward in $BLOCK.</p>
                </div>

                <div className={styles.inputs}>
                    <div className={styles.block}>
                        <p className={styles.pre}>BLOCK to stake:</p>
                        <div className={styles.input}>
                            <input value={this.state.block} onChange={e => this.setState({block: e.target.value})} type="number"/> 
                            <FontAwesomeIcon className={styles.num} icon={faSortNumericUpAlt} />
                        </div>
                    </div>

                    <span className={styles.tidle}>~</span>

                    <div className={styles.block}> 
                        <p className={styles.pre}>Stake for:</p>
                        <button className={styles.input}>
                            {this.state.stakeFor}
                            <Arrow right="6" />
                        </button>
                        <div className={styles.dropdown}>
                            {this.onMonths()}
                        </div>
                    </div>

                    <span className={styles.tidle}>~</span>
                    
                    <div className={styles.block}>
                        <p className={styles.pre}>Price in $USD:</p>
                        <button className={styles.input}>
                            ${this.state.price}
                            <p>current</p>
                            <Arrow right="6" />
                        </button>
                        <div className={styles.dropdown}>
                            {this.usdPrices()}
                        </div>
                    </div>
                </div>

                <div className={`${styles.outputs}`}>
                    <div className={styles.block}>
                        <p>Daily earnings estimate:</p>
                        <h4>$<Countup end={this.state.userOutputs.daily} duration={0.3} decimals={2} /></h4>
                        <small>4.76 block</small>
                    </div>

                    <div className={styles.block}>
                        <p>Monthly earnings estimate:</p>
                        <h4>$<Countup end={this.state.userOutputs.monthly} duration={0.3} decimals={2} /></h4>
                        <small>4.76 block</small>
                    </div>

                    <div className={styles.block}>
                        <p>Yearly earnings estimate:</p>
                        <h4>$<Countup end={this.state.userOutputs.yearly} duration={0.3} decimals={2} /></h4>
                        <small>4.76 block</small>
                    </div>

                    <div className={styles.block}>
                        <p>3 years staking rewards estimate:</p>
                        <h4>$<Countup end={this.state.userOutputs.years3} duration={0.3} decimals={2} /></h4>
                        <small>4.76 block</small>
                    </div>

                    <div className={`${styles.block}`}>
                        <p>Current APR: <FontAwesomeIcon className={styles.icon} icon={faQuestionCircle} />
                            <span className={styles.apr}>525600 / ([total BLOCK staking on the network] * 100)</span>
                        </p>
                        <h4><Countup end="17.80" duration={0.3} decimals={2} />%</h4>
                    </div>
                </div>

                <div className={styles.bottom}>
                    <h2 className={styles.title}>Staking Rewards</h2>

                    <div className={styles.blocks}>
                        <div className={styles.block}>
                            <span className={styles.title}>Current total supply of block</span>
                            <span className={styles.sub}>7.75 million</span>
                        </div>

                        <div className={styles.block}>
                            <span className={styles.title}>Current BLOCK staking</span>
                            <span className={styles.sub}>2.93 million</span>
                        </div>

                        <div className={styles.block}>
                            <span className={styles.title}>Market cap</span>
                            <span className={styles.sub}>$58.83 million</span>
                        </div>

                        <div className={styles.block}>
                            <span className={styles.title}>Block time</span>
                            <span className={styles.sub}>60 seconds</span>
                        </div>
                    </div>

                    <div className={styles.text}>
                        <div className={styles.area}>
                            <span className={`${styles.txt} ${styles.txt2}`}>
                            <h2 className={`${styles.title} ${styles.t_two}`}>Probability of Earning a Reward</h2>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                            </span>
                        </div>

                        <div className={styles.area}>
                            <span className={styles.txt}>
                            <h2 className={`${styles.title} ${styles.t_one}`}>ROI</h2>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                            </span>
                        </div>
                    </div>

                </div>
            </div>
        )
    }
}
