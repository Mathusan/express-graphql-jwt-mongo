

import {signUp, logIn,userFind,logout,userFindByID} from '../../src/services/user.service'
import { generateToken } from '../../src/utils'
import config from '../../config'
import jwt, {JwtPayload} from 'jsonwebtoken'
import { access } from 'fs';

export interface CustomRequest extends Request {
    user: any | JwtPayload;
   }


export const resolver = {
     login : async ({email,password}:any, context:any) => {
        try {
            const data = await logIn({email,password})
            context.res.cookie('jwt',data.refreshToken, {httpOnly:true , sameSite:'strict', maxAge:24*60*60*1000})
            return {
                name : data.name,
                id: data.id,
                accessToken : data.accessToken
            }
        } catch (error : any) {
            throw new Error( error.message)
        }

    },

    register : async({name,email,password}:any,context:any) =>{
        try {
            const data = await signUp({name,email,password})
            context.res.cookie('jwt',data.refreshToken, {httpOnly:true , sameSite:'strict', maxAge:24*60*60*1000})
            return {
                name : data.name,
                id: data.id,
                accessToken : data.accessToken
            }
        } catch (error :any ) {
            throw new Error(error.message)    
        }   
    },

    refreshtoken :async ({}:any, context:any) => {
        try {
            const cookies = context.req.cookies
            if(!cookies?.jwt) return context.res.sendStatus(204);
            const refreshToken = cookies.jwt as string

            const findUser = await  userFind(refreshToken)// servcies to find user using refresh token 
            if(!findUser) return context.res.sendStatus(403);
        
           const accessToken = await  jwt.verify(
                refreshToken,
                `${config.refreshTokenKey}`,
                async (err:any,decoded:any) =>{
                    if(err || findUser.name !== decoded.name) return context.res.sendStatus(403);
                    const accessToken = await  generateToken({email:findUser.email , _id: findUser._id})
                    //context.res.json({accessToken})  
                    
                    return accessToken as string      
                }
            )
            return {accessToken}
        } catch (error: any) {
            throw new Error(error.message)
        }
    },

    logout :async ({}, context:any) => {
        try {
            const cookies = context.req.cookies;
            if (!cookies?.jwt) return context.res.sendStatus(204); 
            const refreshToken = cookies.jwt;
        
            await logout(refreshToken)
            context.res.clearCookie('jwt', { httpOnly: true, sameSite: 'strict', secure: true });
            context.res.status(204);
            return

        } catch (error:any) {
            throw new Error(error.message)
        }

        
    },

    privateroute:async ({}, context:any) => {
        const token  = <any>context.req.header('Authorization')?.replace('Bearer ', '');

        if (!token) { 
            context.res.status(401).json({
                error : " Token not found "
            })
        }
    
        try {
            const user = await <any>jwt.verify(token , `${config.accessTokenKey}`);
            
            (context.req as CustomRequest).user  =  await userFindByID(user._id);
            
            return {
                name : (context.req as CustomRequest).user.name,
                id  : (context.req as CustomRequest).user.id
            }

    
        } catch (error : any) {
            context.res.status(403)
            throw new Error(error.message)
        }
    }

}