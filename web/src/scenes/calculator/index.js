import React, { Component } from 'react';
import Countup from 'react-countup';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';

import socket from '../../helpers/socket';
import styles from './index.module.css';
import Navbar from '../../components/navbar/index';


let ROI;            
let totalSupply;            // BLOCK supply
let totalStaking;           // Total in staking in the network
let currentPrice;           // Current BLOCK / USD price
let priceSelected;          // Current selected price by the client
let yearlyBlock;            // (years * 365) BLOCK rewards
let yearlyRewards;          // yearlyBlock * price
var changedPrice = false;   // Has client changed price yet
let currentBlock;           // Amount of BLOCK client set on input


export default class index extends Component 
{
    constructor(props) 
    {
        super(props);

        // Some states to keep our clients happy
        this.state = 
        {
            block: 5000,
            monthIsOpen: false,
            priceIsOpen: false,

            data:{},
            calcs: [],
            usdPrices: [],

            price: '0.0',
            stakeFor: '3 years',
            dprefix: '', mprefix: '', yprefix: '', y3prefix: '',
            currentSupply:'0.0', currentStaking:'0.0', marketCap:'0.0', curprice: 'CURRENT',

            apr: '0.0', estimate: '3 years staking rewards estimate:',
            daily: '0.0', monthly: '0.0', years3: '0.0',
            blockDaily: '0.0', blockMonthly: '0.0', blockYearly: '0.0', blockMore: '0.0', perOfStaking: '0%',
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
                    
                    if(!changedPrice) 
                        this.setState( {
                            price: this.priceStringFormat(currentPrice).toFixed(2)
                        });
                }

                // We have the supply
                if(obj.hasOwnProperty('supply'))
                {
                    totalSupply = parseFloat(obj.supply);
                }

                // We have total staking amount of the network, we now have everything we need
                if( obj.hasOwnProperty('staking') )
                {
                    // Staking ROI = ( [525600] / [total BLOCK staked on the network] ) * 100
                    totalStaking = parseFloat(obj.staking);
                    ROI = (525600 / totalStaking) * 100;
                    
                    // % of staking compared to supply
                    var percent = ( (totalStaking / totalSupply) * 100 ).toFixed(0);
                    
                    // How much % of supply is staking 
                    this.setState({perOfStaking: percent + '% of total supply'});
                    
                    // We can now get rid of the "Hold on.." message, if the server just booted
                    if (totalStaking >= 1.0) this.props.changeProps({isLoaded: true});

                    this.setState({apr: ROI});
                    
                    // Set some global vars we'll need later
                    yearlyBlock = ( this.state.block * (525600 / totalStaking) );
                    yearlyRewards = this.state.block * (525600 / totalStaking) * currentPrice;
                    
                    //this.setState({yearly: yearlyRewards});
                    
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
                    else if(fixedStaking > 1000.0)
                    {
                        // This is unlikely but its there.
                        fixedStaking = (fixedStaking / 1000).toFixed(2);
                        this.setState({currentStaking: fixedStaking + ' billion'});
                    }
                    else
                    {
                        // There's more than a million in staking, which is normal 
                        this.setState({currentStaking: fixedStaking + ' million'});
                    }

                    let fixedMarketCap = ( (currentPrice * totalSupply) / 1000000 ).toFixed(2);

                    // Market cap can definitely vary, so make the same checks
                    if(fixedMarketCap < 1.0)
                    {
                        fixedMarketCap = ( (currentPrice * totalSupply) / 1000 ).toFixed(2);
                        this.setState({marketCap: fixedMarketCap + ' K'});
                    }
                    else if(fixedMarketCap > 1000.0)
                    {
                        fixedMarketCap = (fixedMarketCap / 1000).toFixed(2);
                        this.setState({marketCap: fixedMarketCap + ' billion'});
                    }
                    else
                    {
                        this.setState({marketCap: fixedMarketCap + ' million'});
                    }
                    
                    // If client hasn't chosen their preferences, set it to default
                    if(!changedPrice) priceSelected = currentPrice;

                    // Finally call this to update other elements
                    this.handleChange(this.state.block);
                }
            }
        });
    }

    // The dropdown menu
    usdPrices = () => 
    {
        let all = [];
        let prices = [];
        let prefixes = []
        let mults = [0.8, 1.0, 1.5, 2.0, 3.0, 11.0];
        let emojis = ['💪', '🙂', '😋', '😝', '🤑', '🚀'];
        let percentages = ['-20% ', 'CURRENT ', '+50% ', '+100% ', '+200% ', '+1000% '];

        // Create dropdown prefixes (if needed)
        for (var i = 0; i < mults.length; i++) 
        {
            var str = String( this.priceStringFormat((currentPrice * mults[i])) );
            var num = ( this.priceStringFormat(currentPrice, 1) * mults[i] );
            var prefix = str.charAt(str.length -1);

            if(num >= 1000.0) num = num / 1000;

            // We actually don't want a prefix if we under 1k 
            if(num < 1000.0) prefixes.push('');
            else prefixes.push(prefix);

            prices.push( num.toFixed(2) );
        }

        let temp = currentPrice; 

        // Generate html dropdown and hook some stuff, hopefully not too messy
        for(let i = 0; i < prices.length; i++) 
        {
            all.push(
                <span className={styles.item} onClick =
                {
                    e => this.setState({priceIsOpen: false}) + 
                         this.handlePrice( ( temp * mults[i] ), percentages[i] )
                } key={i}>

                    <p>${prices[i]}{prefixes[i]}</p>
                    <small>{prices[i] === this.state.price ? percentages[i] : percentages[i]}
                    <span className={styles.emoji}>{emojis[i]}</span></small>
                </span>
            )
        }
        return(all);
    }

    // Client has changed the price, let's deal with it 
    handlePrice(value, curPercentage)
    {
        // Update the text next to selected price
        this.setState({curprice: curPercentage});

        changedPrice = true;
        priceSelected = value;
        this.setState({price: this.priceStringFormat(value).toFixed(2)});

        // Update the changes
        this.handleChange(this.state.block);
    }

    // Time interval dropdown
    onMonths = () => 
    {
        let all = [];
        let time = ['1 month', '3 months', '6 months', '1 year', '3 years', '5 years', '10 years'];

        // Push and hook
        for(let i = 0; i < time.length; i++) 
        {
            all.push(
                <span className={styles.item} onClick={e => this.setState({monthIsOpen: false}) + this.updateWorth(time[i])} key={i}>
                    <p>{time[i]}</p>
                    <small>{this.state.stakeFor === time[i] ? 'CURRENT' : null}</small>
                </span>
            )
        }
        return(all);
    }

    // Format $ price using prefixes - dropdown
    priceStringFormat(price, num=0)
    {
        var return_val;

        // Price is thousands
        if(price >= 1000.0 && price < 1000000.0)
            if(!num) return_val = String( (price / 1000).toFixed(1) + 'K' );
            else return_val = (price / 1000);

        // Well, you never know xD doesn't hurt to check 
        else if(price >= 1000000.0)
            if(!num) return_val = String( (price / 1000000).toFixed(1) + 'M' );
            else return_val = (price / 1000000);

        // Price is under 1k
        else return_val = price;

        return return_val;
    }

    // Format $ price using prefixes - estimates
    stringFormat(value, state)
    {
        var prefix = '';

        // Above 10k but below million
        if(value > 10000 && value < 1000000)
        {
            prefix = 'K';
            value = String( (value / 1000).toFixed(2) );
        }

        // Above million
        else if(value >= 1000000)
        {
            prefix = 'M';
            value = String( (value / 1000000).toFixed(2) );
        }
        
        // Update client 
        switch(state)
        {
            case 'day': 
                this.setState({dprefix: prefix})
                break;
            case 'month': 
                this.setState({mprefix: prefix})
                break;
            case 'year': 
                this.setState({yprefix: prefix})
                break;
            case 'year3': 
                this.setState({y3prefix: prefix})
                break;

            default: break;
        }

        return value;
    }

    // Calculates stuff, updates values
    // Called on -> client clicks time interval 
    // || client lands on page 
    // || client gets new data 
    // || client updates input
    updateWorth(val) 
    {
        this.setState({stakeFor: val});
        
        let division;
        let temp_div;
        let monthsDivision;
        let months = false;

        // If client selected months
        if( val.includes("month") )
        {
            months = true;
            division = 1.0;
            monthsDivision = parseFloat( val.charAt(0) );
            temp_div = parseFloat( val.charAt(0) ) * 31;
        }
        else
        {
            monthsDivision = 12;
            if( val.startsWith("10 ye") ) division = 10;
            else division = parseFloat( val.charAt(0) );
        }

        /*  Calculate compounding

            Compound interest is: A = P(1 + r/n) (nt)
            = INPUT * (1 + ROI% / 365) ^ TIME - INPUT
            = ( 1 + (ROI/100) / 365 ) ** (days) - INPUT
        */

        let potency; 
        let compoundingBlock; 

        // Set potency accordingly
        if(months) 
            potency = (temp_div);
        else 
            potency = (division * 365);

        compoundingBlock = currentBlock * ( 1 + (ROI/100) / 365 ) ** potency;
        compoundingBlock = compoundingBlock - currentBlock;

        // yearlyBlock -> income in (years * amount of years)
        yearlyBlock = compoundingBlock;
        yearlyRewards = yearlyBlock * priceSelected;

        this.setState({ block: currentBlock });

        // Divide by amount of years set
        let tempBlock = parseFloat( yearlyBlock / division );
        let tempRewards = parseFloat( yearlyRewards / division );

        // If client selected months, we divide by amount of months
        // Otherwise divide by 12 
        let monthly = (tempRewards / monthsDivision);

        // There's around 30 days in month so this will do.
        this.setState({ daily: this.stringFormat( (monthly / 30), 'day' ) });

        let monthlyBlock = (tempBlock / monthsDivision);
        this.setState({ blockDaily: (monthlyBlock / 30).toFixed(2) });

        // We are always above 1 month so just leave this as it is
        this.setState({ monthly: this.stringFormat( monthly, 'month' ) });
        this.setState({ blockMonthly: (monthlyBlock).toFixed(2) });
        
        // Client clicked x months, update frontend
        if(val.includes("month"))
        {
            let time_amount = Number(val.charAt(0));

            // In 1 and 3 years will be the same
            this.setState({ years3: this.stringFormat( (monthly * time_amount), 'year3' ) });
            
            // Update this to whatever client just set
            if(time_amount > 1)
                this.setState({ estimate: time_amount + ' months staking rewards estimate:' });
            else 
                this.setState({ estimate: time_amount + ' month staking rewards estimate:' });
            
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
            
            // Update this to whatever client just set
            if(time_amount > 1)
                this.setState({ estimate: time_amount + ' years staking rewards estimate:' });
            else
                this.setState({ estimate: time_amount + ' year staking rewards estimate:' });

            this.setState({ blockYearly: (tempBlock).toFixed(2) });
            
            // If client clicked 3 years or above, update accordingly
            if(time_amount > 2)
            {
                this.setState({ blockMore: (tempBlock * time_amount).toFixed(2) });
                this.setState({ years3: this.stringFormat( (tempRewards * time_amount), 'year3' ) });
            }
            else 
            {
                this.setState({ blockMore: (tempBlock).toFixed(2) });
                this.setState({ years3: this.stringFormat( tempRewards, 'year3' ) });
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
        
        // Limit the input lenght
        if(totalInBlock.length > 10) return;
        currentBlock = totalInBlock;

        // Finalize the updates
        this.updateWorth(this.state.stakeFor);
    }

    // Render the page
    render() 
    {
        return (
            <>
                <Navbar />
                <div className={styles.container}>
                    <div className={styles.top}>
                        <h2 className={styles.title}>Blocknet Staking Calculator</h2>
                        <p className={styles.sub_tool}>With the tool below you can calculate your staking reward in $BLOCK.</p>
                    </div>

                    <div className={styles.inputs}>
                        <div className={styles.block}>
                            <p className={styles.pre}>BLOCK to stake:</p>
                            <div className={styles.input}>
                                <input value={this.state.block} onChange ={(e) => {this.handleChange(e)}} type="number" />
                                <p className={styles.blocktxt}>block</p> 
                            </div>
                        </div>

                        <span className={styles.tidle}>~</span>

                        <div className={styles.block}> 
                            <p className={styles.pre}>Stake for:</p>
                            <button className={`${styles.input} ${styles.stake_input}`} onClick={e => this.setState({monthIsOpen: !this.state.monthIsOpen})}>
                                {this.state.stakeFor}
                                <div className={styles.drop_input}>
                                    <svg width="10" height="5"  fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M0 0L5 5L10 0H0Z" fill="#AEAEAE"/>
                                    </svg>
                                </div>
                            </button>
                            <div className={styles.dr2} >
                                <div className={styles.dropdown} data-open={this.state.monthIsOpen ? true : false}>
                                    {this.onMonths()}
                                </div>
                            </div>
                        </div>

                        <span className={styles.tidle}>~</span>
                        
                        <div className={styles.block}>
                            <p className={styles.pre}>Price in $USD:</p>
                            <button className={styles.input_pr} onClick={e => this.setState({priceIsOpen: !this.state.priceIsOpen})}>
                                ${this.state.price}
                                <p>{this.state.curprice}</p>
                                <div className={styles.drop_input}>
                                    <svg width="10" height="5"  fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M0 0L5 5L10 0H0Z" fill="#AEAEAE"/>
                                    </svg>
                                </div>
                            </button>
                            <div className={styles.dropdown} data-open={this.state.priceIsOpen ? true : false}>
                                {this.usdPrices()}
                            </div>
                        </div>
                    </div>

                    <div className={`${styles.outputs}`}>
                        <div className={styles.block}>
                            <p>Daily earnings estimate:</p>
                            <h4>$<Countup end={this.state.daily} duration={0.3} decimals={2} />{this.state.dprefix}</h4>
                            <small>{this.state.blockDaily} BLOCK</small>
                        </div>

                        <div className={styles.block}>
                            <p>Monthly earnings estimate:</p>
                            <h4>$<Countup end={this.state.monthly} duration={0.3} decimals={2} />{this.state.mprefix}</h4>
                            <small>{this.state.blockMonthly} BLOCK</small>
                        </div>

                        <div className={styles.block}>
                            <p>{this.state.estimate}</p>
                            <h4>$<Countup end={this.state.years3} duration={0.3} decimals={2} />{this.state.y3prefix}</h4>
                            <small>{this.state.blockMore} BLOCK</small>
                        </div>

                        <div className={`${styles.block}`}>
                            <p>Current APR: <FontAwesomeIcon className={styles.icon} icon={faInfoCircle} /><br/>
                            <span className={styles.invis}>txt</span>
                                <span className={styles.apr}>525600 / ([total BLOCK staking on the network] * 100)
                                    <span className={styles.infoArrow}></span>
                                </span>
                            </p>
                            <h4><Countup end={this.state.apr} duration={0.3} decimals={2} />%</h4>
                            <span className={styles.invis}>txt</span>
                        </div>
                    </div>

                    <div className={styles.bottom}>

                        <h2 className={styles.title_reward}>Staking Rewards</h2>

                        <div className={styles.infocontainer}>
                            <div className={`${styles.info} ${styles.first}`}>
                                <span className={styles.title}>Current total supply of BLOCK</span>
                                <span className={styles.sub}>{this.state.currentSupply} million</span>
                                <span className={styles.invis}>txt</span>
                            </div>

                            <div className={styles.info}>
                                <span className={styles.title}>Current BLOCK in staking</span>
                                <span className={styles.sub}>{this.state.currentStaking}</span>
                                <span className={styles.supplyp}>{this.state.perOfStaking}</span>
                            </div>

                            <div className={styles.info}>
                                <span className={styles.title}>Market cap</span>
                                <span className={styles.sub}>${this.state.marketCap}</span>
                                <span className={styles.invis}>txt</span>
                            </div>

                            <div className={styles.info}>
                                <span className={styles.title}>Block time</span>
                                <span className={styles.sub}>60 seconds</span>
                                <span className={styles.invis}>txt</span>
                            </div>
                        </div>
                        
                        <div className={styles.text}>
                            <div className={styles.area}>
                                <span className={`${styles.txt} ${styles.txt2}`}>
                                    <h2 className={`${styles.title} ${styles.t_two}`}>Probability of Earning a Reward</h2>
                                    The selection of the staker that confirms each block is probability-based. This means
                                    that everyone's chance of being selected to confirm the next block is equal to the amount
                                    of BLOCK staking divided by the total amount of BLOCK being staked on the network.
                                    <br></br><br></br>
                                    For a complete guide to staking BLOCK visit <br className={styles.txt_linebreak} />
                                    <a className={styles.document_link} href="https://docs.blocknet.co/wallet/staking/">
                                        https://docs.blocknet.co/wallet/staking/
                                    </a>
                                </span>
                            </div>

                            <div className={styles.area}>
                                <span className={styles.txt}>
                                    <h2 className={`${styles.title} ${styles.t_one}`}>ROI</h2>
                                    The following equation can be derived to estimate the yearly return (in BLOCK) or the initial amount
                                    started with. This does not account for compounding, which would increase this value.
                                    <br></br><br></br>
                                    Staking ROI is calculated as follows: <span className={styles.txt_nums}>525600 / ([total BLOCK staking on the network] * 100)
                                    <br></br><br></br>
                                    <i>*525600 = 1 BLOCK reward per minute * 1440 minutes per day * 365 days per year</i></span>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}
