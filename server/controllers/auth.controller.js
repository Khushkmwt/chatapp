import User from "../models/UserModel.js"
import jwt  from "jsonwebtoken"
import bcrypt from "bcrypt"
import {renameSync , unlinkSync} from "fs"

const maxAge = 3 * 60 * 60 * 1000

const createToken = (email,userId) =>{
    return jwt.sign({email,userId},process.env.JWT_KEY,{expiresIn:maxAge})
}
export const signup = async (req,res,next) => {
    console.log("req received")
    try {
        const {email,password} = req.body;
        if (!email || !password) {
            return res.status(400).send( "Email and password are required" );
        }
        const existingUser = await User.findOne({email});
        if(existingUser) {
            return res.status(400).send( 'Email already in use');
        }
        const user = new User({email,password});
        await user.save();
        const token = createToken(email,user._id);
        res.cookie('jwt',token,{secure:true,maxAge:maxAge,sameSite:"None"});
        res.status(201).json({
            user:{
                email:user.email,
                id:user._id,
                profileSetup:user.profileSetup,
            }
        });
        } catch (error) {
            console.log({error})
            return  res.status(500).send('Failed to create user');
        }
    
}


export const login = async (req,res,next) => {
    try {
        const {email,password} = req.body;
        if (!email || !password) {
            return res.status(400).send( "Email and password are required" );
        }
        const user = await User.findOne({email});
        if(!user) {
            return res.status(404).send( 'Email not found');
        }
        const isValidPassword = await bcrypt.compare(password,user.password);
        if(!isValidPassword) {
            return res.status(404).send( 'Invalid password');
        }
        const token = createToken(email,user._id);
        res.cookie('jwt',token,{secure:true,maxAge:maxAge,sameSite:"None"});
        res.status(200).json({
            user:{
                email:user.email,
                id:user._id,
                profileSetup:user.profileSetup,
                firstName:user.firstName,
                lastName:user.lastName,
                image:user.image,
                color:user.color
            }
        });
        } catch (error) {
            console.log({error})
            return res.status(500).send('Failed to login user');
        }
    
}

export const getUserInfo = async (req,res,next) => {
    try {
        const userData = await User.findById(req.userId)
        if (!userData) {
            return res.status(404).send('User not found');
        }
        return res.status(200).json({
           
                email:userData.email,
                id:userData._id,
                profileSetup:userData.profileSetup,
                firstName:userData.firstName,
                lastName:userData.lastName,
                image:userData.image,
                color:userData.color
            
        });
    } catch (error) {
        console.log({error})
        return res.status(500).send("Internal server error ")
        
    }
}

export const updateProfile = async (req ,res ,next) => {
    try {
        const {userId} = req;
        const {firstName,lastName,color} = req.body;
        if (!firstName || !lastName ) {
            return res.status(400).send('firstname lastname color is required');
        }
        const userData = await User.findByIdAndUpdate(userId,
            {
            firstName,lastName,color,profileSetup:true
            },
            {new:true , runValidators:true}
        )
        return res.status(200).json({
           
                email:userData.email,
                id:userData._id,
                profileSetup:userData.profileSetup,
                firstName:userData.firstName,
                lastName:userData.lastName,
                image:userData.image,
                color:userData.color
            
        });
    } catch (error) {
        console.log({error})
        return res.status(500).send("Internal server error ")
        
    }
}

export const addProfileImage = async (req ,res ,next) => {
    try {
       if (!req.file) {
        return res.status(400).send('Please upload a file');
       }
    
       //const date = new Date()
       const fileName = "uploads/profiles/" + req.file.originalname
       renameSync(req.file.path ,fileName)
       const updatedUser = await User.findByIdAndUpdate(
        req.userId,
        {image:fileName},
        {new:true,runValidators:true}
         )

        return res.status(200).json({
           image:updatedUser.image
        });
    } catch (error) {
        console.log({error})
        return res.status(500).send("Internal server error ")
        
    }
    
}

export const removeProfileImage = async (req,res,next) => {
    try {
        const {userId} = req;
        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).send('User not found')
        }
        if (user.image) {
            unlinkSync(user.image)
        }
        user.image = null
        await user.save()
       
        return res.status(200).send("Profile image removed successfully")
    } catch (error) {
        console.log({error})
        return res.status(500).send("Internal server error ")
    }
}

export const logout = async (req,res,next) => {
    try {
        res.cookie("jwt" ,"" ,{maxAge:1, secure:true , sameSite:"None"})
        return res.status(200).send("logged out successfully ")
       
    } catch (error) {
        console.log({error})
        return res.status(500).send("Internal server error ")
    }
}