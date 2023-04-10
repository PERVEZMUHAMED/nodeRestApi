
const userModel = require('../Models/userModel');
const bcrypt = require('bcrypt');
const errorHandler = require('../middlewares/errorHandler');
const jwt = require('jsonwebtoken')

const register = async(req,res,next)=>{
     try {
        const hashPassword = await bcrypt.hash(req.body.password, 7);
        const users = new userModel({
            ...req.body, password: hashPassword
        })
        const existsEmail = await userModel.findOne({email: req.body.email});
        if(existsEmail) return next(errorHandler(401, "Email Already Exists"))
        const existsUsername = await userModel.findOne({username: req.body.username});
        if(existsUsername) return next(errorHandler(401, "Username Already Exists"))

        const user = await users.save();
        res.status(200).json({
              data: user
        })
     } catch (error) {
         next(error)
     }
}

const login = async(req,res,next)=>{
     try {
        const {email,password} = req.body;
        const existsEmail = await userModel.findOne({email: req.body.email});
        if(!existsEmail)  return next(errorHandler(401, "Email Not valid"))
        const validPassword = await bcrypt.compare(password, existsEmail.password);
        if(!validPassword) return next(errorHandler(401, "Not vlaid password"));
       

        const token = jwt.sign({id:existsEmail._id}, process.env.TOKENKEY);
        res.cookie("acces_token", token, {
            httpOnly: true
        }).status(200).json("Login success ")
     } catch (error) {
        next(error)
     }
}

const updateData = async(req,res,next)=>{
     if(req.user.id === req.params.id){
        try {
            const updatedUser = await userModel.findByIdAndUpdate(req.params.id, {
                $set : req.body
            }, {new: true})
            res.status(200).json({
                msg: "User Updated",
                data: updatedUser
            })
        } catch (error) {
            next(error)
        }
     }else {
        next(errorHandler(401, "You are not a vlid user to access"))
     }
}


const deleteData = async (req,res,next)=>{
    if(req.user.id === req.params.id){
       try {
          const delData = await userModel.findByIdAndDelete(req.params.id);
          res.status(200).json({
            msg: "Data deleted",
            data: delData
          })
       } catch (error) {
          next(error)
       } 
    }
    else{
        next(errorHandler(401, "You can delete only your data"))
    }
}

module.exports = {register, login, updateData, deleteData}