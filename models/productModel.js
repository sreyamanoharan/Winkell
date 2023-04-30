const mongoose=require('mongoose')

const productSchema=mongoose.Schema({

     name:{
        type:String,
        required:true
     },
     description:{
      type:String,
      required:true
     },
     category:{
      type:String,
      ref:'category',
      required:true
     },
     price:{
        type:Number,
        required:true
     },
     image:{
        type:Array,
        required:true
     },
     stock:{
        type:Number,
        required:true
     },
     status:{
      type:Boolean,
      default:'true'
     },
     discount:{
      type:Number,
      default:0
     },
     offerStatus:{
      type:Boolean,
      default:true
     },
    discountPrice:{
      type:Number,
      default:0
    },
    originalPrice:{
      type:Number

    }

})


module.exports=mongoose.model('product',productSchema);