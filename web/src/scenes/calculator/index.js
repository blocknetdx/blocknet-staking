import React, { Component } from 'react';
import Countup from 'react-countup';

import socket from '../../helpers/socket';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle, faSortNumericUpAlt } from '@fortawesome/free-solid-svg-icons';

import styles from './index.module.css';

let ROI;
let yearly_rewards;
let totalStaking;
let totalSupply;
let currentPrice;
let priceSelected;

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
            price: '0.00',
            calcs: [],
            usdPrices: [],

            data:{},
            
            currentSupply:'0.0',
            currentStaking:'0.0',
            marketCap:'0.0',

            apr: '0.0',
            estimate: '3 years staking rewards estimate:',

            daily: '0.0', monthly: '0.0', yearly: '0.0', years3: '0.0'
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
                    currentPrice = parseFloat(obj.price);
                    console.log('price: ' + currentPrice);

                    // Update frontend
                    this.setState({price: currentPrice});
                }

                // We have the supply
                if(obj.hasOwnProperty('supply'))
                {
                    totalSupply = parseFloat(obj.supply);
                    console.log('supply: ' + totalSupply);

                    // Update frontend
                    //this.setState({price: res_price});
                }

                // We have total staking amount of blocknet, we now have everything we need
                if(obj.hasOwnProperty('staking'))
                {
                    // Staking ROI = ( [525600] / [total BLOCK staked on the network] ) * 100
                    totalStaking = parseFloat(obj.staking);
                    ROI = (525600 / totalStaking) * 100;

                    this.setState({apr: ROI});

                    yearly_rewards = this.state.block * (525600 / totalStaking);
                    
                    // Update frontend
                    this.setState({yearly: yearly_rewards});
                    
                    // Supply is going up all the time so just / 1M
                    let fixedSupply = (totalSupply / 1000000).toFixed(2);
                    this.setState({currentSupply: fixedSupply});
                    
                    let fixedStaking = (totalStaking / 1000000).toFixed(2);
                    
                    // Staking count can vary, so make some checks just to be sure 
                    if(fixedStaking < 1.0)
                    {
                        // There's under a million in staking, so we'll use 'K' to express thousands
                        fixedStaking = (totalStaking / 1000).toFixed(2);
                        this.setState({currentStaking: fixedStaking + ' K'});
                    }
                    else
                    {
                        // There's more than a million, which should be normal 
                        this.setState({currentStaking: fixedStaking + ' million'});
                    }

                    let fixedMarketCap = ( (currentPrice * totalSupply) / 1000000 ).toFixed(2);

                    // Market cap can also vary, so make same checks
                    if(fixedMarketCap < 1.0)
                    {
                        fixedMarketCap = ( (currentPrice * totalSupply) / 1000 ).toFixed(2);
                        this.setState({marketCap: fixedMarketCap + ' K'});
                    }
                    else
                    {
                        this.setState({marketCap: fixedMarketCap + ' million'});
                    }

                    priceSelected = currentPrice;

                    // Finally call this to update other elements
                    this.updateWorth(this.state.stakeFor);
                }
            }
        });
    }

    usdPrices = () => {
        let all = [];
        let prices = [
            (currentPrice * 0.8).toFixed(2), 
            (currentPrice * 1.0).toFixed(2),
            (currentPrice * 1.5).toFixed(2),
            (currentPrice * 2.0).toFixed(2),
            (currentPrice * 3.0).toFixed(2),
            (currentPrice * 11.0).toFixed(2)
        ];
        let percentages = ['-20%', 'current', '+50%', '+100%', '+200%', '+1000%'];
        let emojis = ['💪', '🙂', '😋', '😝', '🤑', '🚀'];

        for(let i = 0; i < prices.length; i++) 
        {
            all.push(
                <span className={styles.item} onClick ={() => {this.handlePrice(prices[i])}}  key={i}>
                    <p>${prices[i]}</p>
                    <small>{prices[i] === this.state.price ? percentages[i] : percentages[i]}
                    <span className={styles.emoji}>{emojis[i]}</span></small>
                </span>
            )
        }
        return(all);
    }

    handlePrice(e)
    {
        this.setState({price: e});
        console.log('cliecked: ' + e);
        priceSelected = e;

        this.handleChange(this.state.block);
    }

    // Called first when client clicks time interval 
    onMonths = () => {
        let all = [];
        let time = ['1 month', '3 months', '6 months', '1 year', '3 years', '5 years', '10 years'];

        for(let i = 0; i < time.length; i++) {
            all.push(
                <span className={styles.item} onClick={() => this.updateWorth(time[i])} key={i}>
                    <p>{time[i]}</p>
                    <small>{this.state.stakeFor === time[i] ? 'current' : null}</small>
                </span>
            )
        }
        return(all);
    }

    // Called second when client clicks time interval 
    // Called also when client lands on page
    updateWorth(val) 
    {
        console.log('calling updateWorth: ' + val);

        this.setState({stakeFor: val})
        let monthly = (yearly_rewards / 12);

        // There's around 30 days in month so this will do.
        this.setState({ daily: monthly / 30 });

        // We are always above 1 month so just leave this as it is
        this.setState({ monthly: monthly });
        
        // Client clicked x months, update frontend
        if(val.includes("month"))
        {
            let time_amount = Number(val.charAt(0));

            // In 1 and 3 years will be the same
            this.setState({ yearly: monthly * time_amount });
            this.setState({ years3: monthly * time_amount });
        }
        // Client clicked x year(s), update frontend
        else if(val.includes("year"))
        {
            let time_amount = Number(val.charAt(0));
            
            // Client clicked 10 years
            if( Number(val.charAt(1)) == 0 )
                time_amount = Number(val.charAt(0) + val.charAt(1));
            
            this.setState({ estimate: time_amount + ' years staking rewards estimate:' });
            this.setState({ yearly: yearly_rewards });
            
            // If client clicked 3 years or above, update accordingly
            if(time_amount > 2)
            {
                this.setState({ years3: yearly_rewards * time_amount });
            }
            else this.setState({ years3: yearly_rewards });
        }

    }

    // Called when client changes block input or price input
    handleChange(e) 
    {
        let val;

        if(e.hasOwnProperty('target'))
            val = e.target.value;
        else
            val = e;

        yearly_rewards = (val * (525600 / totalStaking) ) * priceSelected;
        this.setState({ block: val });
        this.updateWorth(this.state.stakeFor);
    }

    render() {
        return (
            <div className={`container`}>
                <div className={styles.top}>
                    <h2 className={styles.title}>Blocknet Staking Calculator</h2>
                    <p className={styles.sub}>With the tool below you can calculate your staking reward in $BLOCK.</p>
                </div>

                <div className={styles.inputs}>
                    <div className={styles.block}>
                        <p className={styles.pre}>BLOCK to stake:</p>
                        <div className={styles.input}>

                            {/* User is changing block value, point to a cuntion */}
                            <input value={this.state.block} onChange ={(e) => {this.handleChange(e)}} type="number"/> 
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
                        <h4>$<Countup end={this.state.daily} duration={0.3} decimals={2} /></h4>
                        <small>4.76 block</small>
                    </div>

                    <div className={styles.block}>
                        <p>Monthly earnings estimate:</p>
                        <h4>$<Countup end={this.state.monthly} duration={0.3} decimals={2} /></h4>
                        <small>4.76 block</small>
                    </div>

                    <div className={styles.block}>
                        <p>Yearly earnings estimate:</p>
                        <h4>$<Countup end={this.state.yearly} duration={0.3} decimals={2} /></h4>
                        <small>4.76 block</small>
                    </div>

                    <div className={styles.block}>
                        <p>{this.state.estimate}</p>
                        <h4>$<Countup end={this.state.years3} duration={0.3} decimals={2} /></h4>
                        <small>4.76 block</small>
                    </div>

                    <div className={`${styles.block}`}>
                        <p>Current APR: <FontAwesomeIcon className={styles.icon} icon={faQuestionCircle} />
                            <span className={styles.apr}>525600 / ([total BLOCK staking on the network] * 100)</span>
                        </p>
                        <h4><Countup end={this.state.apr} duration={0.3} decimals={2} />%</h4>
                    </div>
                </div>

                <div className={styles.bottom}>
                    <h2 className={styles.title}>Staking Rewards</h2>

                    <div className={styles.blocks}>
                        <div className={styles.block}>
                            <span className={styles.title}>Current total supply of block</span>
                            <span className={styles.sub}>{this.state.currentSupply} million</span>
                        </div>

                        <div className={styles.block}>
                            <span className={styles.title}>Current BLOCK staking</span>
                            <span className={styles.sub}>{this.state.currentStaking}</span>
                        </div>

                        <div className={styles.block}>
                            <span className={styles.title}>Market cap</span>
                            <span className={styles.sub}>${this.state.marketCap}</span>
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
