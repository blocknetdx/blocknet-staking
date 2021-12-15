import React, { Component } from 'react';
import Countup from 'react-countup';

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
            stakeFor: '3years',
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
                            <Countup end={parseInt(this.state.stakeFor)} duration={0.2} />&nbsp;{this.state.stakeFor.replace(/\d*/g,'')}
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
                            $<Countup end="5.00" duration={0.2} decimals={2} />
                            <p>current</p>
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
