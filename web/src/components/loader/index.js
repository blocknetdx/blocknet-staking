import React, { Component } from 'react'
import styles from './index.module.css';


export default class index extends Component {
    render() {
        return (
            <div className={styles.content}>
                <div className={styles.loader}>
                    <span className={styles.inner}></span>
                </div>
                <p>Fetching live data...</p>
            </div>
        )
    }
}
