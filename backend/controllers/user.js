const bcrypt = require('bcrypt');
const jwt=require('jsonwebtoken');
const User = require('../models/user');

exports.createUser = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash
            });
            user.save()
                .then(result => {
                    res.status(201).json({
                        message: "User created Successfully",
                        result: result
                    });
                })
                .catch(err => {
                    res.status(500).json({
                        message:"Invalid authentication credentials!"
                    });
                });

        });

}
exports.userLogin  = (req, res, next) => {
    let fetchedUser;
    User.findOne({email:req.body.email})
        .then(user=>{
            if(!user){
                return res.status(401).json({
                    message:"No user exists with the given email ID"
                })
            }
            fetchedUser=user;
            return bcrypt.compare(req.body.password, user.password)
        })
        .then(result=>{
            if(!result){
                return res.status(401).json({
                    message:"Invalid password"
                });
            }
            const token=jwt.sign(
                {email:fetchedUser.email, userId: fetchedUser._id}, 
                process.env.JWT_KEY,
                {expiresIn:'1h'}
            );
            res.status(200).json({
                token:token,
                expiresIn:3600,
                userId: fetchedUser._id
            })
        })
        .catch(err => {
            console.log(err)
            return res.status(401).json({
                message:"Invalid authentication credentials!"
            });
        });
}


exports.updateUser = (req, res, next) => {
    
    console.log(req.body)
	if(req.body.newPassword!=req.body.confirmNewPassword){
        console.log("newPassword!=confirmNewPassword")
		return res.status(401).json({
                    message:"New Password and Confirm New Password does not match"
                });
	}
    let userEmail="";
    
	User.findById(req.body.userId)
	.then(user=>{
            if(user){
                userEmail=user.email;
                console.log("user.email")
                console.log(userEmail)
                console.log("compare req.body.oldPassword, user.password")
                console.log(bcrypt.compare(req.body.oldPassword, user.password))
                return bcrypt.compare(req.body.oldPassword, user.password)
            }else{
                res.status(404).json({message:"User Pass not found"});
            }
        })
        .then(result=>{
            console.log(result)
            console.log("result")
            if(!result){
                return res.status(401).json({
                    message:"Invalid password"
                });
            }
           
            bcrypt.hash(req.body.newPassword, 10)
            	.then(hash=>{
                    const user = new User({
                    _id:req.body.userId,
                    email: userEmail,
                    password: hash
                    })
                    console.log("created User")
                    console.log(user);
                    User.updateOne({_id:req.body.userId, email:userEmail},user)
                        .then(result1=>{
                            
                            console.log("result1")
                            console.log(result1)
                            if(result1.modifiedCount>0){
                            res.status(200).json({message:"Password updated successfully!"});
                            }else{
                            res.status(401).json({message:"Not Authorized"})
                            }
                        })
			.catch((error)=>{
			        console.log("Password not updated")
			    res.status(500).json({message:'Unable to update Password!'})
			})
            	})
        })
        .catch((error)=>{
             console.log("Found error in getting a User by ID")
            res.status(500).json({message:'Failed to fetch User by ID!'})
        })
    }