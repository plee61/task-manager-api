const app = require('./app')
const port = process.env.PORT

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})

//Users/"PEI WAI LEE"/programming/mongodb/bin/mongod --dbpath=/Users/"PEI WAI LEE"/programming/mongodb-data