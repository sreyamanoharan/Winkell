const mongoose=require('mongoose')

const categorySchema= new mongoose.Schema({

    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:false
    },
    status:{
        type:Boolean,
        default:true

    },
    offerStatus:{
        type:Boolean,
        defaut:true
    },
    discount:{
        type:Number,
        default:0
    }
})

module.exports=mongoose.model('category',categorySchema)





