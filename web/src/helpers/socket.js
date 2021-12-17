import config from '../config';
const io = require("socket.io-client");

let socket = io(config.server.url);

export default socket;