console.log('Node Mode: ' + process.env.NODE_ENV);

if (process.env.NODE_ENV === 'production') {
  // console.log('Using Production DB!');
  module.exports = require('./dbProd');
} else {
  // console.log('Using Development DB!');
  module.exports = require('./dbDev');
}
