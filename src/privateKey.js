const fs = require('fs');
const privateKey = fs.readFileSync('./keys/private.pem');
module.exports = privateKey;