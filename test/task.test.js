const request = require('supertest')
const Task = require('../src/models/task')
const app = require('../src/app')
const {userOne, userOneId, userTwo, taskThree, setUpDatabase} = require('./fixtures/db')
beforeEach( setUpDatabase)
 
test('should create task for user', async ()=>{
    const response = await request(app)
    .post('/tasks')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
        description: 'learn test suit with supertest'
    }).expect(201)
    const task = Task.findById(response.body._id)
    expect(task).not.toBeNull()
})

 test('should get tasks for user one', async ()=>{
    const response = await request(app)
    .get('/tasks')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({owner: userOne._id})
    .expect(200)
    expect(response.body.length).toEqual(2)
    const task = Task.findById(response.body._id)
    expect(task).not.toBeNull()
})

test ('delete task security', async ()=>{
    const response = await request(app)
    .delete(`/tasks/${taskThree._id}`)
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(404)
    const task = Task.findById(taskThree._id)
    expect(task).not.toBeNull()
})