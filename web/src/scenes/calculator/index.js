import React, { Component } from 'react';
import Countup from 'react-countup';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle, faSortNumericUpAlt } from '@fortawesome/free-solid-svg-icons';

import socket from '../../helpers/socket';
import styles from './index.module.css';

let ROI;            
let totalSupply;            // BLOCK supply
let totalStaking;           // Total in staking in the network
let currentPrice;           // Current BLOCK / USD price
let priceSelected;          // Current selected price by the client
let yearlyBlock;            // Yearly BLOCK rewards
let yearlyRewards;          // Yearly USD rewards
var changedPrice = false;   // Has client changed price yet



const Arrow = (props) => 
(
    // Dropdown arrow stuff
    <svg width="14" height="12" viewBox="0 0 10 11" className={styles.arrow} style={{right: props.right || '', top: props.top || ''}}>
      <path d="M0.999998 7.23205C-0.333335 6.46225 -0.333333 4.53775 1 3.76795L6.25 0.736859C7.58333 -0.032941 9.25 0.929311 9.25 2.46891V8.53109C9.25 10.0707 7.58333 11.0329 6.25 10.2631L0.999998 7.23205Z" fill="#0F0F0F"/>
    </svg>
);



export default class index extends Component 
{
    constructor(props) 
    {
        super(props);

        // Some states to update client info
        this.state = {
            block: 5000,
            monthIsOpen: false,
            priceIsOpen: false,
            data:{},
            calcs: [],
            usdPrices: [],
            price: '0.0',
            stakeFor: '3 years',
            blockDaily: '0.0', blockMonthly: '0.0', blockYearly: '0.0', blockMore: '0.0',
            currentSupply:'0.0', currentStaking:'0.0', marketCap:'0.0',
            apr: '0.0', estimate: '3 years staking rewards estimate:',
            daily: '0.0', monthly: '0.0', yearly: '0.0', years3: '0.0'
        };

        this.usdPrices = this.usdPrices.bind(this);
        this.onMonths = this.onMonths.bind(this);
    }

    // Initialization(s) that requires DOM nodes should go here
    componentDidMount() 
    {
        // Listen the server for messages
        socket.on('message', (msg) => 
        {
            this.setState({data:msg})

            // Message from socketio 
            let json_response = this.state.data; 

            // Check if we got some data and not an empty object
            if( String( typeof(json_response) ) === 'string' )
            {
                // Parse the json string 
                const obj = JSON.parse(json_response);

                // We have price 
                if(obj.hasOwnProperty('price'))
                {
                    currentPrice = parseFloat(obj.price);

                    // Update frontend
                    if(!changedPrice) this.setState({price: currentPrice});
                }

                // We have the supply, no further action needed yet
                if(obj.hasOwnProperty('supply'))
                {
                    totalSupply = parseFloat(obj.supply);
                }

                // We have total staking amount of blocknet, we now have everything we need
                if(obj.hasOwnProperty('staking'))
                {
                    // Staking ROI = ( [525600] / [total BLOCK staked on the network] ) * 100
                    totalStaking = parseFloat(obj.staking);
                    ROI = (525600 / totalStaking) * 100;

                    if (totalStaking >= 1.0) this.props.changeProps({isLoaded: true});
                    this.setState({apr: ROI});

                    yearlyBlock = ( this.state.block * (525600 / totalStaking) );
                    yearlyRewards = this.state.block * (525600 / totalStaking) * currentPrice;
                    
                    // Update frontend
                    this.setState({yearly: yearlyRewards});
                    
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

                    // Finally call this to update other elements
                    this.updateWorth(this.state.stakeFor);
                }
            }
        });
    }

    // The dropdown menu
    usdPrices = () => 
    {
        let all = [];
        let prices = 
        [
            (currentPrice * 0.8).toFixed(2), 
            (currentPrice * 1.0).toFixed(2),
            (currentPrice * 1.5).toFixed(2),
            (currentPrice * 2.0).toFixed(2),
            (currentPrice * 3.0).toFixed(2),
            (currentPrice * 11.0).toFixed(2)
        ];

        let emojis = ['💪', '🙂', '😋', '😝', '🤑', '🚀'];
        let percentages = ['-20% ', 'current ', '+50% ', '+100% ', '+200% ', '+1000% '];

        for(let i = 0; i < prices.length; i++) 
        {
            all.push(
                <span className={styles.item} onClick ={e => this.setState({priceIsOpen: false}) + this.handlePrice(prices[i])}  key={i}>
                    <p>${prices[i]}</p>
                    <small>{prices[i] === this.state.price ? percentages[i] : percentages[i]}
                    <span className={styles.emoji}>{emojis[i]}</span></small>
                </span>
            )
        }
        return(all);
    }

    // Client has changed the price, let's deal with it 
    handlePrice(value)
    {
        changedPrice = true;
        priceSelected = value;
        this.setState({price: value});

        // Update the changes
        this.handleChange(this.state.block);
    }

    // Time interval dropdown
    onMonths = () => 
    {
        let all = [];
        let time = ['1 month', '3 months', '6 months', '1 year', '3 years', '5 years', '10 years'];

        for(let i = 0; i < time.length; i++) {
            all.push(
                <span className={styles.item} onClick={e => this.setState({monthIsOpen: false}) + this.updateWorth(time[i])} key={i}>
                    <p>{time[i]}</p>
                    <small>{this.state.stakeFor === time[i] ? 'current' : null}</small>
                </span>
            )
        }
        return(all);
    }

    // Called when client clicks time interval 
    // Called also when client lands on page, updates the page elements
    updateWorth(val) 
    {
        this.setState({stakeFor: val})
        let monthly = (yearlyRewards / 12);

        // There's around 30 days in month so this will do.
        this.setState({ daily: monthly / 30 });

        let monthlyBlock = (yearlyBlock / 12);
        this.setState({ blockDaily: (monthlyBlock / 30).toFixed(2) });

        // We are always above 1 month so just leave this as it is
        this.setState({ monthly: monthly });
        this.setState({ blockMonthly: (monthlyBlock).toFixed(2) });
        
        // Client clicked x months, update frontend
        if(val.includes("month"))
        {
            let time_amount = Number(val.charAt(0));

            // In 1 and 3 years will be the same
            this.setState({ yearly: monthly * time_amount });
            this.setState({ years3: monthly * time_amount });
            
            this.setState({ blockMore: (monthlyBlock * time_amount).toFixed(2) });
            this.setState({ blockYearly: (monthlyBlock * time_amount).toFixed(2) });
        }

        // Client clicked x year(s), update frontend
        else if(val.includes("year"))
        {
            let time_amount = Number(val.charAt(0));
            
            // Client clicked 10 years
            if( Number(val.charAt(1)) === 0 )
                time_amount = Number(val.charAt(0) + val.charAt(1));
            
            if(time_amount > 1) 
                this.setState({ estimate: time_amount + ' years staking rewards estimate:' });

            this.setState({ yearly: yearlyRewards });
            this.setState({ blockYearly: (yearlyBlock).toFixed(2) });
            
            // If client clicked 3 years or above, update accordingly
            if(time_amount > 2)
            {
                this.setState({ years3: yearlyRewards * time_amount });
                this.setState({ blockMore: (yearlyBlock * time_amount).toFixed(2) });
            }
            else 
            {
                this.setState({ years3: yearlyRewards });
                this.setState({ blockMore: (yearlyBlock).toFixed(2) });
            }
        }
    }

    // Called when client changes block input or price input
    // Set some variables before updating client
    handleChange(e) 
    {
        let totalInBlock;

        // This is just to check whether the function call
        // originated from block or price input, the data will be different
        if( e.hasOwnProperty('target') ) 
            totalInBlock = e.target.value;
        else
            totalInBlock = e;

        yearlyBlock = ( totalInBlock * (525600 / totalStaking) );
        yearlyRewards = (totalInBlock * (525600 / totalStaking) ) * priceSelected;
        this.setState({ block: totalInBlock });

        // Finalize the updates
        this.updateWorth(this.state.stakeFor);
    }

    // Render the page
    render() 
    {
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
                            <p className={styles.blocktxt}>block</p> 
                            <FontAwesomeIcon className={styles.num} icon={faSortNumericUpAlt} />
                        </div>
                    </div>

                    <span className={styles.tidle}>~</span>

                    <div className={styles.block}> 
                        <p className={styles.pre}>Stake for:</p>
                        <button className={styles.input} onClick={e => this.setState({monthIsOpen: !this.state.monthIsOpen})}>
                            {this.state.stakeFor}
                            <Arrow right="6" />
                        </button>
                        <div className={styles.dropdown} data-open={this.state.monthIsOpen ? true : false}>
                            {this.onMonths()}
                        </div>
                    </div>

                    <span className={styles.tidle}>~</span>
                    
                    <div className={styles.block}>
                        <p className={styles.pre}>Price in $USD:</p>
                        <button className={styles.input} onClick={e => this.setState({priceIsOpen: !this.state.priceIsOpen})}>
                            ${this.state.price}
                            <p>current</p>
                            <Arrow right="6" />
                        </button>
                        <div className={styles.dropdown} data-open={this.state.priceIsOpen ? true : false}>
                            {this.usdPrices()}
                        </div>
                    </div>
                </div>

                <div className={`${styles.outputs}`}>
                    <div className={styles.block}>
                        <p>Daily earnings estimate:</p>
                        <h4>$<Countup end={this.state.daily} duration={0.3} decimals={2} /></h4>
                        <small>{this.state.blockDaily} BLOCK</small>
                    </div>

                    <div className={styles.block}>
                        <p>Monthly earnings estimate:</p>
                        <h4>$<Countup end={this.state.monthly} duration={0.3} decimals={2} /></h4>
                        <small>{this.state.blockMonthly} BLOCK</small>
                    </div>

                    <div className={styles.block}>
                        <p>Yearly earnings estimate:</p>
                        <h4>$<Countup end={this.state.yearly} duration={0.3} decimals={2} /></h4>
                        <small>{this.state.blockYearly} BLOCK</small>
                    </div>

                    <div className={styles.block}>
                        <p>{this.state.estimate}</p>
                        <h4>$<Countup end={this.state.years3} duration={0.3} decimals={2} /></h4>
                        <small>{this.state.blockMore} BLOCK</small>
                    </div>

                    <div className={`${styles.block}`}>
                        <p>Current APR: <FontAwesomeIcon className={styles.icon} icon={faQuestionCircle} />
                            <span className={styles.apr}>525600 / ([total BLOCK staking on the network] * 100)</span>
                        </p>
                        <h4><Countup end={this.state.apr} duration={0.3} decimals={2} />%</h4>
                    </div>
                </div>

                <div className={styles.bottom}>
                    <div className={styles.titlereward}>
                        <h2 className={styles.title}>Staking Rewards</h2>
                    </div>

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
                    <br></br><br></br>
                    <div className={styles.text}>
                        <div className={styles.area}>
                            <span className={`${styles.txt} ${styles.txt2}`}>
                            <h2 className={`${styles.title} ${styles.t_two}`}>Probability of Earning a Reward</h2>
                            The selection of the staker that confirms each block is probability-based. This means
                            that everyone's chance of being selected to confirm the next block is equal to the amount
                            of BLOCK staking divided by the total amount of BLOCK being staked on the network.
                            <br></br><br></br>
                            For a complete guide to staking BLOCK visit the <a id="document_link" href="https://docs.blocknet.co/wallet/staking/">official documentation</a>.
                            </span>
                        </div>

                        <div className={styles.area}>
                            <span className={styles.txt}>
                            <h2 className={`${styles.title} ${styles.t_one}`}>ROI</h2>
                            The following equation can be derived to estimate the yearly return (in BLOCK) on the initial amount
                            started with. This does not accoutn for compounding, which would increase this value.
                            <br></br><br></br>
                            Staking ROI is calculated as follows: 525600 / ([ total BLOCK staking on the network ] * 100)
                            <br></br><br></br>
                            *525600 = 1 BLOCK reward per minute * 1440 minutes per day * 365 days per year
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
