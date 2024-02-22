const { validationResult } = require("express-validator");
const { userModel } = require("../model/user");
const jwt = require('jsonwebtoken');

const handleUserSignup = async (request, response) => {
    let validation = validationResult(request);
    if(validation.isEmpty())
    {
        let newUser = request.body;
        let user = await userModel.findOne(newUser);
        if(!user)
        {
            newUser = await userModel.create(newUser);
            return response.json({method : request.method, endpoint : request.originalUrl, newUser});
        }

        return response.json({error : 'DuplicateEmail', message : `Email ${newUser.email} already exists`})       
    }

    return response.json({errors : validation.array()}) 
}

const handleUserLogin = async (request, response) => {
    let validation = validationResult(request);
    if(validation.isEmpty())
    {
        try {
            const user = await userModel.isValidCredentials(request.body);
            if(!user)
                return response.status(400).json({error : 'PasswordError', message : 'Entered password is Invalid'});
            /* 
                response.cookie('blogT', jwt.sign({id : user._id, email : user.email}, process.env.SECRET));
            */
            return response.json({blogT : jwt.sign({id : user._id, email : user.email}, process.env.SECRET, {
                expiresIn : '7d'
            })});
        } catch (error) {
            console.log(error)
            return response.status(400).json({error : 'NoUser', message : `Email ${request.body.email} doesn't exists`});    
        }
    }

    return response.json({errors : validation.array()}) 
}

module.exports = {
    handleUserSignup,
    handleUserLogin
}