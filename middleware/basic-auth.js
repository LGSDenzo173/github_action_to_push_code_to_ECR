const auth = require('basic-auth');

// Authenticates response data using a token provided in the header
module.exports = function basicAuth(req, res, next) {
    const user = auth(req);

    if (!user || user.name !== 'public' || user.pass !== '123') {
        res.set('WWW-Authenticate', 'Basic realm="Authentication Required"');
        res.sendStatus(401);
        return;
    }



    
    next();
}