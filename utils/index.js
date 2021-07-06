const jwt = require('jsonwebtoken');
require('dotenv').config();


const verifyToken = (headersAuth) => {
    const [, token]               = headersAuth.split("Bearer ");
    const validatedToken          = jwt.verify(token, process.env.JWT_SECRET);

    return validatedToken
}


module.exports = {verifyToken}