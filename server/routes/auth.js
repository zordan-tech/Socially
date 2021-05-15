const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model("User")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('../keys')
const requireLogin = require('../middleware/requireLogin')

router.get('/', (req, res) => {
    res.send("hello");
})



router.post('/signup', (req, res) => {
    const { name, email, password } = req.body
    if (!name || !email || !password) {
        return res.status(422).json({ error: "please add all fields required" })
    }
    User.findOne({ email: email })
        .then((savedUser) => {
            if (savedUser) {
                res.status(422).json({ error: "user already exit" })
            }
            bcrypt.hash(password, 12)
                .then(hashedpassword => {
                    const user = new User({
                        email,
                        password:hashedpassword,
                        name
                    })

                    user.save()
                        .then(user => {
                            res.json({ message: "saved successfully" })
                        })
                        .catch(error => {
                            console.log(err)
                        })
                })
        })
        .catch(err => {
            console.log(err)
        })
})

router.post('/signin',(req,res) => {
    const {email,password} = req.body
    if(!email || !password){
        return res.status(422).json({error:"please add email and password"})
    }
    User.findOne({email:email})
    .then(savedUser=>{
        if(!savedUser){
            return res.status(422).json({error:"Invalid email or password"})
        }
        bcrypt.compare(password,savedUser.password)
        .then(domatch=>{
            if(domatch){
               // res.json({message:"successfully signed in"})
               const token = jwt.sign({_id:savedUser._id},JWT_SECRET)
               res.json({token})
            }
            else{
                return res.status(422).json({error:"Invalid Password"})
            }
        })
        .catch(err=>{
            console.log(err)
        })
    })
    .catch(err=>{
        console.log(err)
    })
})

module.exports = router;