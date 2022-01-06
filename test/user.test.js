const request = require('supertest')
const User = require('../src/models/user')
const app = require('../src/app')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const {userOneId,userOne,setUpDatabase} = require('./fixtures/db')

beforeEach( setUpDatabase)
    
// test('Should sign up a new user', async ()=>{
//     await request(app).post('/users')
//     .send(userOne)
//     .expect(201)
// })
test('should authenticate user', async ()=>{
    const response = await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200)
    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()
    //assert that 
    expect(response.body.token).toBe(user.tokens[1].token)
})
test('should not login with nonexistent user', async()=>{
    await request(app).post('/users/login').send({
        email:'pl99@hotmail.com',
        password: '9838190pppp'
    }).expect(400)
})
test('should not delete user profile without authentication', async()=>{
    await request(app)
    .delete('/users/me')
    .send()
    .expect(401)
})
test('should delete user profile with authentication', async()=>{
     await request(app)
     .delete('/users/me')
     .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
     .send()
     .expect(200)

     const user = await User.findById(userOne._id)
     expect(user).toBeNull()
  })
test('should upload images', async()=>{
    await request(app)
    .post('/users/me/avatar')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .attach('avatar','./test/fixtures/wei.JPG')
    .expect(200)

    const user = User.findById(userOneId)
    console.log(`avatar: ${user}`)
    expect(user.avatar).toEqual(expect.any(Buffer))
})
test('should update user fields', async()=>{
    await request(app)
    .patch('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
        name: 'Hannah'
    })
    .expect(200)
    const user = await User.findById(userOneId)
    expect(user.name).toEqual('Hannah')
})
test('should not update invalid user fields', async()=>{
    await request(app)
    .patch('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
        location: 'australia'
    })
    .expect(400)
})