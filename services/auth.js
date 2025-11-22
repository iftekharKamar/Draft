const JWT = require('jsonwebtoken');
require('dotenv').config(); 


const secret = process.env.JWT_SECRET_KEY;
if (!secret) {
    throw new Error("FATAL ERROR: JWT_SECRET_KEY is not defined in .env");
}

const createTokenForUser = (user) => {
    const payload = {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        profileImageURL: user.profileURL,
        role: user.role,
    };
    const token = JWT.sign(payload, secret, { expiresIn: "1d" }); 
    
    return token;
}

const validateToken = (token) => {
    const payload = JWT.verify(token, secret);
    return payload;
}

module.exports = { createTokenForUser, validateToken };