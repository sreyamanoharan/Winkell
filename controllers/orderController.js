const User = require('../models/userModel')
const bcrypt = require('bcrypt')
const product = require('../models/productModel')
const Category = require('../models/categoryModel')
const Order = require('../models/orderModel')
const nodemailer = require('nodemailer')
const randomstring= require('randomstring')
const mongoose = require('mongoose')
const {ObjectId} = mongoose.Types
const config=require('../config/config')

