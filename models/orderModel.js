const mongoose=require('mongoose')
const ObjectId = mongoose.Types.ObjectId;

const orderSchema= new mongoose.Schema({

userId:{
    type:ObjectId,
    ref:'user'
},
deliveryAddress:{
    name:{
        type:String
    },
    housename:{
        type:String
    },
    post:{
        type:String
    },
    city:{
        type:String
    },
    district:{
        type:String
    },
    state:{
        type:String
    },
    

},
grandTotal:{
    type:Number,
    require:true
},

products:{
    type:Array,
    require:true
},
paymentmethod:{
    type:String,
    require:true
},
date:{
    type:Date,
    require:true
},
deliveryDate:{
    type:Date,
    default:Date.now
},

orderStatus:{
    type:String,
    require:true
},
month:{
    type:Number
}

})

module.exports=mongoose.model('Orders',orderSchema)