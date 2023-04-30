const mongoose=require('mongoose')

const couponSchema=mongoose.Schema({

    code:{
        type:String,
        required:true,
        unique:true

    },
    available:{
        type:Number
    },
    minAmount:{
        type:Number,
        required:true
    },
    amount:{
        type:Number,
        required:true
    },
    status:{
        type:String,
        required:true
    },
    expiry:{
        type:Date,
        required:true
    },
},{
    timestamps:true
})

module.exports=mongoose.model('Coupon',couponSchema)