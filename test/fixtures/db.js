const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const User = require('../../src/models/user')
const Task = require('../../src/models/task')
const userOneId = mongoose.Types.ObjectId()

const userOne = {
    _id: userOneId,
    name: 'Mike',
    email: '9808@hotmail.com',
    password: '9807mikecom',
    age: 46,
    tokens: [{
        token: jwt.sign({_id: userOneId}, process.env.JWT_SECRET)
        }]
}

const userTwoId = mongoose.Types.ObjectId()

const userTwo = {
    _id: userTwoId,
    name: 'May',
    email: 'meimei@hotmail.com',
    password: 'meiyiMayLorimer',
    age: 4,
    tokens: [{
        token: jwt.sign({_id: userTwoId}, process.env.JWT_SECRET)
        }]
}

const taskOne = {
    _id: mongoose.Types.ObjectId(),
    description: 'User One Task 1',
    completed: true,
    owner: userOneId
}

const taskTwo = {
    _id: mongoose.Types.ObjectId(),
    description: 'User One Task 2',
    completed: false,
    owner: userOneId
}

const taskThree = {
    _id: mongoose.Types.ObjectId(),
    description: 'User Two Task 3',
    completed: false,
    owner: userTwoId
}

const setUpDatabase = async () => {
    await User.deleteMany()
    await Task.deleteMany()
    await new User(userOne).save()
    await new User(userTwo).save()
    await new Task(taskOne).save()
    await new Task(taskTwo).save()
    await new Task(taskThree).save()
}

module.exports = {userOneId, userOne, userTwo, taskThree, setUpDatabase }