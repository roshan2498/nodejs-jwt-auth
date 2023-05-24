import jwt from "jsonwebtoken";
import createError from "http-errors";
import client from "./init_redis";

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
                return;
            }
            resolve(token);
        })
    })
}

export function verifyAccessToken(req,_res,next){
    if(!req.headers['authorization']) return next(createError.Unauthorized())
    const authHeader = req.headers['authorization'];
    const bearerToken = authHeader.split(' ');
    const token = bearerToken[1];
    jwt.verify(token,process.env.ACCESS_TOKEN_SECRET, (err, payload)=>{
        if(err){
            const message = err.name === 'JsonWebTokenError' ? 'Unauthorized' : err.message;
            return next(createError.Unauthorized(message));
        }

        req.payload = payload
        next()
    })
}

export function signRefreshToken(userId): Promise<unknown>{
    return new Promise((resolve, reject)=> {
        const payload = {
        }
        const secret = process.env.REFRESH_TOKEN_SECRET;
        const options = {
            expiresIn: "1y",
            issuer: "roshankharke.in",
            audience: userId
        };
        
        jwt.sign(payload,secret,options, (err,token) => {
            if(err){
                console.log(err.message);
                reject(createError.InternalServerError())
            }
            try{
                client.SET(userId, token);
                resolve(token);
            } 
            catch(err){
                    console.log(err);
                    reject(createError.InternalServerError())
                    return;
            }
        })
    })
}

export function verifyRefreshToken(refreshToken): Promise<unknown>{
    return new Promise((resolve, reject)=> {
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, payload) => {
            if(err) return reject(createError.Unauthorized())
            const userId = payload.aud
            resolve(userId);
        })
    })
}