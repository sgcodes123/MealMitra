const jwt = require("jsonwebtoken");
const User = require("../models/user");

const protect = async (req,res,next)=>{
    let token;

    if(
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer ")
    ){
        try{
            token = req.headers.authorization.split(" ")[1];

            const decoded = jwt.verify(
                token,
                process.env.JWT_SECRET
            );

            const authenticatedUser = await User.findById(decoded.id)
                .select("-password +authVersion");
            req.user = authenticatedUser;
            if(!req.user){
                return res.status(401).json({
                message:"User not found"
                });
            }
            if ((authenticatedUser.authVersion || 0) !== (decoded.version || 0)) {
                return res.status(401).json({
                    message:"Password changed. Please sign in again"
                });
            }
            req.user.authVersion = undefined;
            next();

        }catch(error){
            return res.status(401).json({
                message:"Not authorized"
            });
        }
    }

    if(!token){
        return res.status(401).json({
            message:"No token provided"
        });
    }
};

module.exports = protect;
