const mongoose=require('mongoose')


const bannerSchema=mongoose.Schema({
     
      main:{
        type:String,
        required:true
      },
       sub:{
        type:String,
        required:true
    },
    bannerImg:{
      type:String,
      required:true
    },
    bannerStatus:{
      type:Boolean,
      default:'true'
    }
     
})

module.exports=mongoose.model('banners',bannerSchema);