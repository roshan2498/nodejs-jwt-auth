import jwt from "jsonwebtoken";
import createError from "http-errors";

//signing access token means we are generating a NEW token that is signed token, so we are actually creating a new token here.
export function signAccessToken(userId): Promise<unknown>{
    return new Promise((resolve, reject)=> {
        const payload = {
        }
        const secret = process.env.ACCESS_TOKEN_SECRET;
        const options = {
            expiresIn: "1h",
            issuer: "roshankharke.in",
            audience: userId
        };
        
        jwt.sign(payload,secret,options, (err,token) => {
            if(err){
                console.log(err.message);
                reject(createError.InternalServerError())
            }
            resolve(token);
        })
    })
}