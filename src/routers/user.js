const express = require('express');
const User = require('../models/user')
const router = new express.Router()
const auth = require('../middleware/auth')
const sharp = require('sharp')  
const multer = require('multer');
const { request } = require('express');

// Add User
router.post('/users', async (req, res) => {
    const user = new User(req.body);

    try {
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({user, token})
    } catch (error) {
        res.status(400).send(error)
    }
})

//Logout user
router.post('/users/logout', auth, async(req, res)=>{
    try {
        req.user.tokens = req.user.tokens.filter((token) =>{
            return token.token !== req.token
        })
        await req.user.save()
        res.send()
    } catch (error) {
        res.status(500).send()
    }
})

//Logout user from all sessions
router.post('/users/logoutAll', auth, async(req, res)=>{
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (error) {
        res.status(500).send()
    }
})

// Read User (login)
router.get('/users/me', auth ,async (req, res)=>{
    res.send(req.user)
})

// Read User by ID
// router.get('/users/:id', async (req, res) =>{
//     const _id = req.params.id;
    
//     try {
//         const user = await User.findById(_id);

//         if (!user) {
//             return res.status(404).send()
//         }

//         res.send(user)

//     } catch (error) {
//         res.status(500).send()
//     }
// })

//Update User
router.patch('/users/me', auth, async (req, res)=>{
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']

    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({Error: 'Invalid Updates!'})
    }

    try {
        //const user = await User.findById(req.params.id);

        updates.forEach((update)=> req.user[update] = req.body[update])

        await req.user.save()

        //const user = await User.findByIdAndUpdate(req.params.id, req.body, {new:true,runValidators:true, useFindAndModify:false})
        res.send(req.user)

    } catch (error) {
        res.status(404).send(error)
    }
})

//Delete User
router.delete('/users/me', auth, async (req, res)=>{

    try {
        // const user = await User.findByIdAndDelete(req.user._id)

        // if (!user) {
        //     res.status(404).send()
        // }

        await req.user.remove()
        res.send(req.user)

    } catch (error) {
        res.status(500).send(error)
    }
})

//Login User
router.post('/users/login', async (req, res) =>{

    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)  // findByCredentials() is a custom function
        const token = await user.generateAuthToken()
        res.send({ user, token})

    } catch (error) {
        res.status(400).send()
    }
})

const upload = multer({
    limits: { fileSize: 1000000 },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload an image'))
        }
        cb(undefined, true)

    }
})

//Upload user Image
router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) =>{
    
    const buffer = await sharp(req.file.buffer).resize({ width:250, height:250 }).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send()
}, (error, req, res, next) =>{
    res.status(400).send({Error: error.message})
})


//Delete user Image
router.delete('/users/me/avatar', auth, async (req, res) =>{
    req.user.avatar = undefined
    await req.user.save()
    res.send()
})

//Get profile image
router.get('/users/:id/avatar', async(req, res) => {
    try {
        const user = await User.findById(req.params.id)
        
        if (!user || !user.avatar) {
            throw new Error()
        }

        res.set('Content-Type','image/png')
        res.send(user.avatar)

    } catch (error) {
        res.status(404).send()
    }
})

module.exports = router