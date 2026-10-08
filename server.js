const express = require('express')
require('dotenv').config()
const fs = require('fs')
const path = require('path')

const dbConnection = require('./src/config/dbCon')

const app = express()
const port = process.env.PORT || 3000

dbConnection()
app.set('view engine', 'ejs')
app.set('views', './src/views')

app.use(express.json())

app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.use(express.static('public'))

app.use(express.static(path.join(__dirname, "public")))

app.use("/bootstrap", express.static("node_modules/bootstrap/dist"));
app.use(express.urlencoded({extended: true}))

const homeRoute = require('./src/router/user.route')

app.use(homeRoute)

app.listen(port, ()=> {
    console.log(`http://localhost:${port}/`);
    
})