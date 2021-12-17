import React, { Component } from 'react';
import Countup from 'react-countup';
// import socket from '../../helpers/socket';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle, faSortNumericUpAlt } from '@fortawesome/free-solid-svg-icons';

import styles from './index.module.css';

const Arrow = (props) => (
    <svg width="14" height="12" viewBox="0 0 10 11" className={styles.arrow} style={{right: props.right || '', top: props.top || ''}}>
      <path d="M0.999998 7.23205C-0.333335 6.46225 -0.333333 4.53775 1 3.76795L6.25 0.736859C7.58333 -0.032941 9.25 0.929311 9.25 2.46891V8.53109C9.25 10.0707 7.58333 11.0329 6.25 10.2631L0.999998 7.23205Z" fill="#0F0F0F"/>
    </svg>
);

export default class index extends Component {
    constructor(props) {
        super(props);

        this.state = {
            block: '1.000',
            stakeFor: '3years',
            price: 5,
            prices: 0,
        }
    }

    // Initialization(s) that requires DOM nodes should go here
    // componentDidMount()
    // {
    //     // Let the server know we are in
    //     socket.on('connect', function() {
    //         socket.send('[hello] ');
    //     });


    //     // Listen the server for messages
    //     socket.on('message', (msg) =>
    //     {
    //         // Chat clear 
    //         if( msg.startsWith("[response]") ) 
    //         {
    //             msg = msg.replace("[response] ", "");
    //             console.log('socket-io response: ' + msg);

                
    //         }
    //     });
    // }


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
                            <input value={this.state.block} onChange={e => this.setState({block: e.target.value})} type="number"/> 
                            <FontAwesomeIcon className={styles.num} icon={faSortNumericUpAlt} />
                        </div>
                    </div>

                    <span className={styles.tidle}>~</span>

                    <div className={styles.block}> 
                        <p className={styles.pre}>Stake for:</p>
                        <button className={styles.input}>
                            {parseInt(this.state.stakeFor) + " " + this.state.stakeFor.replace(/\d*/g,'')}
                            <Arrow right="6" />
                        </button>
                        <div className={styles.dropdown}>
                            <span className={styles.item} onClick={e => this.setState({stakeFor: '1month'})}><p>1 month</p></span>
                            <span className={styles.item} onClick={e => this.setState({stakeFor: '3months'})}><p>3 months</p></span>
                            <span className={styles.item} onClick={e => this.setState({stakeFor: '6months'})}><p>6 months</p></span>
                            <span className={styles.item} onClick={e => this.setState({stakeFor: '1year'})}><p>1 year</p></span>
                            <span className={styles.item} onClick={e => this.setState({stakeFor: '3years'})}><p>3 years</p></span>
                            <span className={styles.item} onClick={e => this.setState({stakeFor: '5years'})}><p>5 years</p></span>
                            <span className={styles.item} onClick={e => this.setState({stakeFor: '10years'})}><p>10 years</p></span>
                        </div>
                    </div>

                    <span className={styles.tidle}>~</span>
                    
                    <div className={styles.block}>
                        <p className={styles.pre}>Price in $USD:</p>
                        <button className={styles.input}>
                            ${this.state.price.toFixed(2)}
                            <p>current</p>
                            <Arrow right="6" />
                        </button>
                        <div className={styles.dropdown}>
                            <span className={styles.item} onClick={e => this.setState({price: 4.00})}>
                                <p>$4.00</p>
                                <small>-20% <span className={styles.emoji}>💪</span></small>
                            </span>
                            <span className={styles.item} onClick={e => this.setState({price: 5.00})}>
                                <p>$5.00</p>
                                <small>current <span className={styles.emoji}>🙂</span></small>
                            </span>
                            <span className={styles.item} onClick={e => this.setState({price: 7.50})}>
                                <p>$7.50</p>
                                <small>+50% <span className={styles.emoji}>😋</span></small>
                            </span>
                            <span className={styles.item} onClick={e => this.setState({price: 10.00})}>
                                <p>$10.00</p>
                                <small>+100% <span className={styles.emoji}>😝</span></small>
                            </span>
                            <span className={styles.item} onClick={e => this.setState({price: 20.00})}>
                                <p>$20.00</p>
                                <small>+200% <span className={styles.emoji}>🤑</span></small>
                            </span>
                            <span className={styles.item} onClick={e => this.setState({price: 100.00})}>
                                <p>$100.00</p>
                                <small>+1000% <span className={styles.emoji}>🚀</span></small>
                            </span>
                        </div>
                    </div>
                </div>

                <div className={`${styles.outputs}`}>
                    <div className={styles.block}>
                        <p>Daily earnings estimate:</p>
                        <h4>$<Countup end="23.80" duration={0.3} decimals={2} /></h4>
                        <small>4.76 block</small>
                    </div>

                    <div className={styles.block}>
                        <p>Monthly earnings estimate:</p>
                        <h4>$<Countup end="727.90" duration={0.3} decimals={2} /></h4>
                        <small>4.76 block</small>
                    </div>

                    <div className={styles.block}>
                        <p>Yearly earnings estimate:</p>
                        <h4>$<Countup end="8686.80" duration={0.3} decimals={2} /></h4>
                        <small>4.76 block</small>
                    </div>

                    <div className={styles.block}>
                        <p>3 years staking rewards estimate:</p>
                        <h4>$<Countup end="26060.40" duration={0.3} decimals={2} /></h4>
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
