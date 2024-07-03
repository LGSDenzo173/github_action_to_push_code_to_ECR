const helmet = require('helmet');
const compression = require('compression');

// To be run before production
module.exports = app => {
    app.use(helmet());
    app.use(compression());
}