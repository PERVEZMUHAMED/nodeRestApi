const jwt = require('jsonwebtoken');
const errorHandler = require('./errorHandler');
const verifytoken = (req,res,next)=>{
        const token = req.cookies.acces_token;
        if(!token) return next(errorHandler(404, "Not valid token"));
        jwt.verify(token, process.env.TOKENKEY, (err,user)=>{
            if(err) return next(errorHandler(401, "Not uathorized user"));
            req.user = user;
            next();
        })
}

module.exports = verifytoken;