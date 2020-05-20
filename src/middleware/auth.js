const jwt = require("jsonwebtoken");
const User = require("../db/models/user");

const auth = async (req, res, next) => {
    try {
        //collect the auth token from req.header, and removes 'Bearer ' part
        const token = req.header("Authorization").replace("Bearer ", "");
        //jwt.verify decod the token coded with jwt.hash using the secret
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        //Find one particular user by his _id and his token

        const user = await User.findOne({
            _id: decoded._id,
            "tokens.token": token,
        });
        // console.log(user.name);

        if (!user) {
            //trigger the catch statement with the error
            throw new Error();
        }
        req.token = token;
        req.user = user;
        next();
    } catch (error) {
        // console.log(error);
        res.status(401).send("Invalid credentials");
    }
};

module.exports = auth;
