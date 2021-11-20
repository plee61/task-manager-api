const mongoose = require('mongoose')
mongoose.connect(process.env.MONGODB_URL)

// const task = new Task({
//     description: 'Art Work with kids'
//    })

// task.save().then(() => {
//     console.log(task)
//    }).catch((error) => {
//     console.log('Error!', error)
//    })
