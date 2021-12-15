import React, { Component } from 'react';
import Countup from 'react-countup';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';

/* dis is css */
import styles from './index.module.css';

export default class index extends Component {
    constructor(props) {
        super(props);

        this.state = {
            stakeFor: '3 years',
            price: 5,
        }
    }
    render() {
        return (
            <div className={`container`}>
                <h2 className={styles.title}>Blocknet Staking Calculator</h2>
                <p className={styles.sub}>With the tool below you can calculate your staking reward in $BLOCK.</p>
            
                <div className={styles.inputs}>
                    <div className={styles.block}>
                        <p className={styles.pre}>BLOCK to stake:</p>
                        <button className={styles.input} disabled>
                            <Countup end="1.000" duration={0.2} decimals={3} />
                            <p>current</p>
                        </button>
                    </div>

                    <span className={styles.tidle}>~</span>

                    <div className={styles.block}>
                        <p className={styles.pre}>Stake for:</p>
                        <button className={styles.input}>
                            <Countup end={parseInt(this.state.stakeFor)} duration={0.2} />&nbsp;{this.state.stakeFor.replace(/\D/g,'')}
                            <FontAwesomeIcon className={styles.arrow} icon={faChevronDown} />
                        </button>
                        <div className={styles.dropdown}>
                            <span className={styles.item} onClick={e => this.setState={year: '1'}}><p>1 month</p></span>
                            <span className={styles.item}><p>3 month</p></span>
                            <span className={styles.item}><p>6 month</p></span>
                            <span className={styles.item}><p>1 year</p></span>
                            <span className={styles.item}><p>3 years</p></span>
                            <span className={styles.item}><p>5 years</p></span>
                            <span className={styles.item}><p>10 years</p></span>
                        </div>
                    </div>

                    <span className={styles.tidle}>~</span>
                    
                    <div className={styles.block}>
                        <p className={styles.pre}>Price in $USD:</p>
                        <button className={styles.input}>
                            $<Countup end="5.00" duration={0.2} decimals={2} />
                            <p>current</p>
                            <FontAwesomeIcon className={styles.arrow} icon={faChevronDown} />
                        </button>
                        <div className={styles.dropdown}>
                            <span className={styles.item}>
                                <p>$4.00</p>
                                <small>-20% <span className={styles.emoji}>💪</span></small>
                            </span>
                            <span className={styles.item}>
                                <p>$5.00</p>
                                <small>current <span className={styles.emoji}>🙂</span></small>
                            </span>
                            <span className={styles.item}>
                                <p>$7.50</p>
                                <small>+50% <span className={styles.emoji}>😋</span></small>
                            </span>
                            <span className={styles.item}>
                                <p>$10.00</p>
                                <small>+100% <span className={styles.emoji}>😝</span></small>
                            </span>
                            <span className={styles.item}>
                                <p>$20.00</p>
                                <small>+200% <span className={styles.emoji}>🤑</span></small>
                            </span>
                            <span className={styles.item}>
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

                <div className={styles.block}>
                    <p>Current APR:</p>
                    <h4><Countup end="17.80" duration={0.3} decimals={2} />%</h4>
                </div>

                </div>
            </div>
        )
    }
}
