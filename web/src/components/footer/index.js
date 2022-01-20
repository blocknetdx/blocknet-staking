import React, { Component } from 'react'
import styles from './index.module.css';

import Logo from '../../resources/blocknet-logo-white.png';
import IconTelegram from '../../resources/icons/icon-telegram.svg';
import IconDiscord from '../../resources/icons/icon-discord.svg';
import IconTwitter from '../../resources/icons/icon-twitter.svg';
import IconReddit from '../../resources/icons/icon-reddit.svg';
import IconFacebook from '../../resources/icons/icon-facebook.svg';
import IconLinkedin from '../../resources/icons/icon-linkedin.svg';
import IconGithub from '../../resources/icons/icon-github.svg';
import IconYoutube from '../../resources/icons/icon-youtube.svg';
import IconInstagram from '../../resources/icons/icon-instagram.svg';
import BuildWithIcon from '../../resources/icons/icon-chevron-right-24px-white.svg';


export default class index extends Component 
{
    render() 
    {
        return (

            <div className={styles.footer}>

                <div className={styles.primary_pre_back}>
                    <div className={styles.primary_pre}>
                        <div className={styles.build}>
                            <h4>Interested in building the next generation of decentralized applications? Start building today with the Blocknet protocol.</h4>

                            <a href="https://blocknet.co/build-with-blocknet" className={styles.button_ghost}>
                                <div className={styles.inner}>
                                    <div className={styles.txt}>Build with Blocknet</div>
                                    <img className={styles.icon_btn} src={BuildWithIcon} alt="" />
                                </div>
                            </a>
                        </div>
                    </div>
                </div>

                <div className={styles.primary_post_back}>

                    <div className={styles.primary_post}>

                        <div className={styles.email}>

                            <div className={styles.left}>
                                <h3>The Blocknet Newsletter</h3>
                                <p>Subscribe for the latest Blocknet updates and news</p>
                            </div>

                            <form action="https://blocknet.us16.list-manage.com/subscribe/post?u=5d0a376e982034a2ddd6edb98&amp;id=6ae2c503df" method="post" name="mc-embedded-subscribe-form" target="_blank"  rel="noreferrer" noValidate="">
                                
                                <div className={styles.right}>
                                    <input type="email" name="EMAIL" placeholder="Email Address" required="" />
                                    <div className={styles.btn}>
                                        <button><img src="https://blocknet.co/images/icon-chevron-right-24px-white.svg" alt="arrow" /></button>
                                    </div>
                                </div>

                            </form>
                        </div>
                    </div>
                </div>

                <div className={styles.secondary}>

                    <div className={styles.links}>

                        <div className={styles.pre}>
                            <div>
                                <h4>Quick Links</h4>
                                <a href="https://blocknet.co/blocknet-protocol">Protocol</a><br/>
                                <a href="https://blocknet.co/built-on-blocknet">Solutions</a><br/>
                                <a href="https://blocknet.co/build-with-blocknet">Developers</a><br/>
                                <a href="https://blocknet.co/downloads">Downloads</a><br/>
                                <a href="https://blocknet.co/roadmap">Roadmap</a><br/>
                                <a href="https://medium.com/blocknet">Blog</a><br/>
                            </div>

                            <div>
                                <h4>Documentation</h4>
                                <a href="https://docs.blocknet.co/">Documentation Portal</a><br/>
                                <a href="https://docs.blocknet.co/service-nodes/introduction/">Service Nodes Guide</a><br/>
                                <a href="https://docs.blocknet.co/wallet/setup/">Staking Wallet Guide</a><br/>
                                <a href="https://docs.blocknet.co/governance/introduction/">Governance</a><br/>
                                <a href="https://blocknet.co/brand-resources">Brand Resources</a><br/>
                            </div>
                        </div>

                        <div className={styles.post}>
                            <div>
                                <h4>Developers</h4>
                                <a href="https://api.blocknet.co/#getting-started">Getting Started Guides</a><br/>
                                <a href="https://github.com/blocknetdx/">GitHub</a><br/>
                                <a href="https://api.blocknet.co/">API Docs</a><br/>
                                <a href="https://chainz.cryptoid.info/block/">Chainz Explorer</a><br/>
                                <a href="https://explorer.blocknet.co/">Blocknet Explorer</a><br/>
                            </div>

                            <div>
                                <h4>Exchanges</h4>
                                <a href="http://blockdx.net/">Block DX</a><br/>
                                <a href="https://bittrex.com/Market/Index?MarketName=BTC-BLOCK">Bittrex</a><br/>
                                <a href="https://main.southxchange.com/Market/Book/BLOCK/BTC">SouthXchange</a><br/>
                                <a href="https://www.finexbox.com/market/pair/BLOCK-BTC.html">Finexbox</a><br/>
                                <a href="https://stakecube.net/app/exchange/BLOCK_BTC">Stakecube</a><br/>
                            </div>
                        </div>
                    </div>

                    <hr />


                    {/* Add the logo, copyright + socials */}

                    <div className={styles.footer_bottom}>

                        <a id={styles.img_node} href="https://blocknet.co" className={styles.bottom_link}>
                            <img className={styles.bottom_logo} src={Logo}  height="30" alt="logo" />
                        </a>

                        <div id={styles.cr_node} className={styles.cr}>
                            <a href="/" className={styles.footer_legal}>© Copyright 2021</a>
                        </div>

                        <div id={styles.icons_node} className={styles.icons_wrap}>
            
                            <a href="https://t.me/Blocknet" target="_blank" rel="noreferrer" className={styles.icon_link}>
                                <img src={IconTelegram} width="30" alt="" className={styles.bottom_icon} />
                            </a>
                        
                            <a href="https://discord.gg/mZ6pTneMx3" target="_blank" rel="noreferrer" className={styles.icon_link}>
                                <img src={IconDiscord} width="30" alt="" className={styles.bottom_icon} />
                            </a>
                            
                            <a href="https://twitter.com/The_Blocknet" target="_blank" rel="noreferrer" className={styles.icon_link}>
                                <img src={IconTwitter} width="30" alt="" className={styles.bottom_icon} />
                            </a>
                            
                            <a href="https://www.reddit.com/r/theblocknet/" target="_blank" rel="noreferrer" className={styles.icon_link}>
                                <img src={IconReddit} width="30" alt="" className={styles.bottom_icon} />
                            </a>
                            
                            <a href="https://en-gb.facebook.com/theblocknet/" target="_blank" rel="noreferrer" className={styles.icon_link}>
                                <img src={IconFacebook} width="30" alt="" className={styles.bottom_icon} />
                            </a>
                            
                            <a href="https://www.linkedin.com/company/blocknet/" target="_blank" rel="noreferrer" className={styles.icon_link}>
                                <img src={IconLinkedin} width="30" alt="" className={styles.bottom_icon} />
                            </a>
                            
                            <a href="http://github.com/blocknetdx/" target="_blank" rel="noreferrer" className={styles.icon_link}>
                                <img src={IconGithub} width="30" alt="" className={styles.bottom_icon} />
                            </a>
                            
                            <a href="https://www.youtube.com/channel/UCCDBoR9fHb21bLH7FGvFrQg/videos" target="_blank" rel="noreferrer" className={styles.icon_link}>
                                <img src={IconYoutube} width="30" alt="" className={styles.bottom_icon} />
                            </a>
                            
                            <a href="https://www.instagram.com/the_blocknet/" target="_blank" rel="noreferrer" className={styles.icon_link}>
                                <img src={IconInstagram} width="30" alt="" className={styles.bottom_icon} />
                            </a>
                        </div>

                        <div id={styles.cr_node} className={styles.cr_low}>
                            <a href="/" className={styles.footer_legal}>© Copyright 2021</a>
                        </div>

                    </div>
                </div>
            </div>
        )
    }
}
