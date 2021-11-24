const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/authentication')
const multer = require('multer')
const sharp = require('sharp')
const {sendWelcomeEmail} = require('../emails/account')
const {sendCancelEmail} = require('../emails/account')
const router = new express.Router()

router.post('/users', async (req, res) => {
    const user = new User(req.body)
    try {
        await user.save()
        sendWelcomeEmail(user.email, user.name)
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })
    } catch (e) {
        console.log(e)
        res.status(400).send('create user error:' + e)
    }
})

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({ user, token })
    } catch (e) {
        res.status(400).send()
    }
})

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()

        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
})

router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()
        res.send(req.user)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/users/me', auth, async (req, res) => {
    try {
        await req.user.remove()
        sendCancelEmail(req.user.email, req.user.name)
        res.send(req.user)
    } catch (e) {
        console.log(e)
        res.status(500).send(e)
    }
})
const upload = multer({
//    dest: 'avatar', -- remove this line to save file to memory
    limit:{
        fileSize:1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(doc|docx)$/)){
            return cb(new Error('Please upload a Word document'))
        }
        cb(undefined, true)
    }
})
const errorMiddleware = (req, res, next) => {
    throw new Error('Error from Middleware')
} 

router.post('/upload', upload.single('upload'),auth, async (req, res)=>{
    req.user.avatar = req.file.buffer
    await req.user.save()
    res.send()
    }, (error, req, res, next)=>{ // so that uncaught error will only print the error message but not whole bunch of error
        res.status(400).send({error: error.message})
    }
)
const avatarUpload = multer({
//    dest: 'avatar',
    limit: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(JPG|JPEG|PNG)$/)){
            return cb(new Error('Please upload a picture with extension JPG/JPEG/PNG'))
        }
        cb(undefined, true)
    }
})
router.post('/users/me/avatar', avatarUpload.single('avatar'), auth, async (req, res)=>{
    const buffer = await sharp(req.file.buffer).resize({width:250, height:250}).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send('successful')
}, (error, req, res, next) =>{
    res.status(400).send({error: error.message})
})
router.delete('/users/me/avatar', auth, async (req, res)=>{
    req.user.avatar = null
    await req.user.save()
    res.send('avatar deleted')
}, (error, req, res, next) =>{
    res.status(400).send({error: error.message})
})
router.get('/users/:id/avatar', async (req, res) =>{
    try{
        const user = await User.findById(req.params.id)
        if (!user || !user.avatar) {
            throw new Error()
        }

        res.set('Content-Type','image/JPG')
        res.send(user.avatar)
    } catch (e) {

    } 
})
module.exports = router