const mongoose=require('mongoose')
const { Number } = require('twilio/lib/twiml/VoiceResponse')

const userSchema=new mongoose.Schema({
      name:{
        type:String,
        require:true
      },
      email:{
        type:String,
        require:true
      },
      mobile:{
        type:String
     },
      password:{
        type:String,
        require:true

     },
     is_admin:{
      type:Number,
      require:true
     },
     is_verified:{
      type:Number,
      default:0
     },
     status:{
        type:Boolean,
        default:true
     },
     token:{
        type:String,
        default:''
     },
     address:[
      {

        name:{type:String},
        house:{type:String},
        post:{type:String},
        city:{type:String},
        district:{type:String},
        state:{type:String},
        pin:{type:Number}

      }
     ],
     
      cart:{
        items:[{
        productId:{
          type:String,
          ref:'product'
        },
        qty:{
          type:Number,
          default:1
        },
        price:{
          type:Number,
          default:0
        },
        date:{
          type:Date,
          dafault:Date.now
        },
        productTotalprice:{
          type:Number,

        },
        image:{
          type:Array,
          required:true

        }
      }],
      totalPrice:{
        type:Number,
        default:0

      },
      originalPrice:{
        type:Number
      },
      applied:{
        type:String
      },

      wishlist:{
        products:[{
            product:{
                type:String,
                ref:'Product'
            }
        }]
    },
      
    }
    },
   
    
    
)


module.exports = mongoose.model('user',userSchema)



