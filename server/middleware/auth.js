import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next)=>{
   const authHeader = req.headers.authorization || req.headers.Authorization;
    let token = null;

    if (authHeader && typeof authHeader === 'string') {
        if (authHeader.startsWith('Bearer ')) token = authHeader.split(' ')[1];
        else token = authHeader;
    }
    if(!token){
        return res.json({success: false, message: "No token provided"});
    }
    try{
        const userId = jwt.decode(token, process.env.JWT_SECRET);
        if(!userId){
            return res.json({success: false, message: "No Authorization"});
        }
        req.user = await User.findById(userId.id).select("-password");
        next();
        
    }catch(error){
        res.json({success: false, message: error.message});
    }
}