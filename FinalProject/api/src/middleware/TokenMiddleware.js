const jwt = require('jsonwebtoken');

const TOKEN_COOKIE_NAME = "ParkUser";

exports.TokenMiddleware = (req, res, next) => {

    let token = null;
    let here = 0;
    console.log("***************/n I am here *****************/n");
    if(!req.cookies[TOKEN_COOKIE_NAME]) {
        here = 400;
        const header = req.get('Authorization');
        //console.log(header + " Hell0");
        console.log("***************/n I am here 2*****************/n");
        if(header && header.startsWith("Bearer ")) {
            here = 402;
            token = header.split(' ')[1];
        }
        
    }
    else {
        here = 401;
        token = req.cookies[TOKEN_COOKIE_NAME];
    }

    if(!token) {
        console.log("***************/n I am here 3 *****************/n");
        res.status(here).json({error: 'Not authenticated 1'});
        return;
    }

    try{

        const decoded = jwt.verify(token, process.env.API_SECRET);
        req.user = decoded.user;
        next();
    }
    catch(err) {
        res.status(401).json({error: 'Not authenticated 2'});
        return;
    }

}


exports.generateToken = (req, res, user) => {
    
    let data = {
        user : user,
        exp: Math.floor(Date.now() / 1000) + 3600
    }
    const token = jwt.sign(data, process.env.API_SECRET);

    res.cookie(TOKEN_COOKIE_NAME, token, {
        httpOnly: true,
        secure: true,
        maxAge: 100 * 60 * 1000
    });

}


exports.removeToken = (req, res) => {
    
    try {
    res.cookie(TOKEN_COOKIE_NAME, "", {
        httpOnly: true,
        secure: true,
        maxAge: -100000
    });
}
catch(err) {
    console.log(err);
}
}
