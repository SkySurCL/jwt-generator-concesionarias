const fs = require('fs');
const publicKey = fs.readFileSync('./keys/public.pem');
module.exports = publicKey;