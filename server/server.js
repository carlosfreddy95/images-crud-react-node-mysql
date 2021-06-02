const express = require("express"),
    mysql = require('mysql'),
    myconnection = require('express-myconnection'),
    cors = require('cors'),
    path = require('path')

const app = express()

//middlewares
app.use(myconnection(mysql, {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'osadia12',
    database: 'monkeyw_images_crud'
}))

app.use(cors())

app.use(express.static(path.join(__dirname, 'dbimages')))

app.use(require('./routes/routes'))

app.listen(3001, () => {
    console.log('server running on', 'http://localhost:' + 3001)
})