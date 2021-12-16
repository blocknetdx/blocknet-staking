const io = require("socket.io-client");
let socket = io("http://localhost:5001");

module.exports = socket;