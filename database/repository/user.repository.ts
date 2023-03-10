import { DocumentDefinition } from 'mongoose'
import userModel from '../models/user.model'
import {IUser, IUserInputs} from '../types/user.type'


export const  createUser  = async ({name,email,password} : IUserInputs) =>{
        try {
            const user = new userModel({
                name,
                email,
                password
            })
            
            const userResult = await user.save()

            return userResult


        } catch (error: any) {
            return error
        }
    }

 export const  findUser =async (email : any)=>{
        try {
            const existingUser = await userModel.findOne({email : email})
            return existingUser
        } catch (error : any) {
            return error
        }
    }

export const findUserByToken = async (refreshToken : any)   =>{
    try {
        const existingUser = await userModel.findOne({refreshToken:refreshToken})
        return existingUser
    } catch (error: any) {
        return error
    }
} 

export const saveRefreshToken =async (userID: string , refreshToken :string) => {
    try {
        const user = await userModel.findById(userID).findOneAndUpdate({refreshToken:refreshToken})
        const result = await user?.save();
    } catch (error:any) {
        return error
    }


}

export const  findUserById = async (id : string) =>{
        try {
            const existingUser = await userModel.findById(id).select('-password').select('-refreshToken')

            return existingUser

        } catch (error) {
            return {
                error: "error"
            }
        }
    }

export const removeRefreshToken =async (refreshToken : string) => {
    try {
        const user = await findUserByToken(refreshToken)   
        if(user) {
            user.refreshToken = ''
            const result = await user.save();
        }

    } catch (error) {
        
    }
}