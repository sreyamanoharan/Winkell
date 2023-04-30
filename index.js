const mongoose=require('mongoose')
require("dotenv").config()

mongoose.connect(process.env.DB_URL).then(result=>{
    console.log('mongo db connected');
}).catch(err=>{
    console.log(err);
});


const express=require('express');
const app=express()


const session=require('express-session');
app.use(session({
    secret:'key',
    resave:true,
    saveUninitialized:true,
    cookie:{maxAge:60000*60*24}}))


const path = require('path')

const env=require('dotenv').config()



app.use(express.static(path.join(__dirname,'public')))
app.set('views',path.join(__dirname,'views'))
app.set('view engine','ejs')

//for user route
const userRoute=require('./routes/userRoute')
const adminRoute=require('./routes/adminRoute')

app.use('/admin',adminRoute)
app.use('/',userRoute)




app.listen(3000,function(){
    console.log('server');
})