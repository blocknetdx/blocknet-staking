import React, { Component } from 'react'
import OutsideClickHandler from 'react-outside-click-handler';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';

import styles from './index.module.css';
import Logo from '../../resources/blocknet-logo-white.png';


export default class index extends Component 
{
    constructor(props) 
    {
        super(props);
        this.state = {
            navIsOpen: false,
            dropdown1: false,
            dropdown2: false,
        }
    }

    render() {
        return (
            <>
                <div className={styles.header}>
                    <a href="https://blocknet.co/">
                        <img className={styles.logo} src={Logo} alt="logo" />
                    </a>
                    <div className={styles.links}>
                        <a href="https://blocknet.co/blocknet-protocol" className={styles.link}>Protocol</a>
                        <a href="https://blocknet.co/built-on-blocknet" className={styles.link}>Solutions</a>
                        <div className={styles.link} onClick={e => this.setState({dropdown1: !this.state.dropdown1})}>
                            Developers
                            <FontAwesomeIcon className={styles.arrow} icon={faChevronDown} />
                        
                            <OutsideClickHandler onOutsideClick={() => this.setState({dropdown1: ''})}>
                            <div className={styles.dropdown} data-isopen={this.state.dropdown1}>
                                <a href="https://blocknet.co/learn-about-blocknet" className={styles.item}>Learn</a>
                                <a href="https://blocknet.co/build-with-blocknet" className={styles.item}>Build</a>
                                <a href="https://docs.blocknet.co/" className={styles.item}>
                                    Documentation <FontAwesomeIcon className={styles.external} icon={faExternalLinkAlt} />
                                </a>
                                <a href="https://api.blocknet.co/" className={styles.item}>
                                    API Docs <FontAwesomeIcon className={styles.external} icon={faExternalLinkAlt} />
                                </a>
                                <a href="https://github.com/blocknetdx/" className={styles.item}>
                                    Github <FontAwesomeIcon className={styles.external} icon={faExternalLinkAlt} />
                                </a>
                            </div>
                            </OutsideClickHandler>
                        </div>
                        <a href="https://blocknet.co/downloads" className={styles.link}>Downloads</a>
                        <div className={styles.link} onClick={e => this.setState({dropdown2: !this.state.dropdown2})}>
                            Community
                            <FontAwesomeIcon className={styles.arrow} icon={faChevronDown} />
                            <OutsideClickHandler onOutsideClick={() => this.setState({dropdown2: ''})}>
                            <div className={styles.dropdown2} data-isopen={this.state.dropdown2}>
                                <a href="https://discord.com/invite/mZ6pTneMx3" className={styles.item}>
                                    Join Discord <FontAwesomeIcon className={styles.external} icon={faExternalLinkAlt} />
                                </a>
                                <a href="https://t.me/Blocknet" className={styles.item}>
                                    Join Telegram <FontAwesomeIcon className={styles.external} icon={faExternalLinkAlt} />
                                </a>
                                <a href="https://blocknet.co/contribute-to-blocknet" className={styles.item}>Contribute</a>
                                <a href="https://forum.blocknet.co/" className={styles.item}>
                                    Proposal Forum <FontAwesomeIcon className={styles.external} icon={faExternalLinkAlt} />
                                </a>
                            </div>
                            </OutsideClickHandler>
                        </div>
                        <a href="https://medium.com/blocknet" className={styles.link}>Blog</a>
                        <a href="https://blocknet.co/roadmap" className={styles.link}>Roadmap</a>
                        <a href="https://blocknet.co/#exchanges" className={`${styles.link} ${styles.block}`}>Buy BLOCK</a>
                    </div>

                    <div className={styles.toggle} onClick={e => this.setState({ navIsOpen: !this.state.navIsOpen })}>
                        <span className={styles.toggle_upper}></span>
                        <span className={styles.toggle_under}></span>
                    </div>
                </div>

                <div className={styles.mobile} data-isopen={this.state.navIsOpen}>
                    <a href="https://blocknet.co/blocknet-protocol" className={styles.link}>Protocol</a>
                    <a href="https://blocknet.co/built-on-blocknet" className={styles.link}>Solutions</a>
                    <div className={styles.link} onClick={e => this.setState({dropdown1: !this.state.dropdown1})}>
                        Developers 
                        <FontAwesomeIcon className={styles.arrow} icon={faChevronDown} />
                        <div className={styles.dropdown} data-isopen={this.state.dropdown1}>
                            <a href="https://blocknet.co/learn-about-blocknet" className={styles.item}>Learn</a>
                            <a href="https://blocknet.co/build-with-blocknet" className={styles.item}>Build</a>
                            <a href="https://docs.blocknet.co/" className={styles.item}>
                                Documentation <FontAwesomeIcon className={styles.external} icon={faExternalLinkAlt} />
                            </a>
                            <a href="https://api.blocknet.co/" className={styles.item}>
                                API Docs <FontAwesomeIcon className={styles.external} icon={faExternalLinkAlt} />
                            </a>
                            <a href="https://github.com/blocknetdx/" className={styles.item}>
                                Github <FontAwesomeIcon className={styles.external} icon={faExternalLinkAlt} />
                            </a>
                        </div>
                    </div>
                    <a href="https://blocknet.co/downloads" className={styles.link}>Downloads</a>
                    <div className={styles.link} onClick={e => this.setState({dropdown2: !this.state.dropdown2})}>
                        Community 
                        <FontAwesomeIcon className={styles.arrow} icon={faChevronDown} />
                        <div className={styles.dropdown} data-isopen={this.state.dropdown2}>
                        <a href="https://discord.com/invite/mZ6pTneMx3" className={styles.item}>
                            Join Discord <FontAwesomeIcon className={styles.external} icon={faExternalLinkAlt} />
                        </a>
                        <a href="https://t.me/Blocknet" className={styles.item}>
                            Join Telegram <FontAwesomeIcon className={styles.external} icon={faExternalLinkAlt} />
                        </a>
                        <a href="https://blocknet.co/contribute-to-blocknet" className={styles.item}>Contribute</a>
                        <a href="https://forum.blocknet.co/" className={styles.item}>
                            Proposal Forum <FontAwesomeIcon className={styles.external} icon={faExternalLinkAlt} />
                        </a>
                        </div>
                    </div>
                    <a href="https://medium.com/blocknet" className={styles.link}>Blog</a>
                    <a href="https://blocknet.co/roadmap" className={styles.link}>Roadmap</a>
                    <a href="https://blocknet.co/#exchanges" className={`${styles.link} ${styles.block}`}>Buy BLOCK</a>
                </div>
            </>
        )
    }
}
