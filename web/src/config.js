// module.exports = {
//     server: {
//         url: 'https://staking.core.cloudchainsinc.com'
//     }
// }

// Pull hostname from docker env vars 
let hostname = process.env.REACT_APP_HOSTNAME;

module.exports = {
    server: {
        url: 'https://' + hostname
    }
}