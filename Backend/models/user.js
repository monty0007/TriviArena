const mongoose = require ('mongoose');

const userSchema = new mongoose.Schema({
    // userType:{
    //     type:String,
    //     enum:["Student","Teacher"],// isse bss hum student aur teachers ki hi value ko use kr payenge
    //     required:true,
    // },
    uid:{
        type:String,
        required:true,
    },
    firstName:{
        type:String,
        required:true,
    },
    lastName:{
        type:String,
        // required:true,
    },
    // userName:{
    //     type:String,
    //     required:true,
    //     minlength:5,
    //     maxlength:15,
    //     unique:true
    // },
    mail:{
        type:String,
        required:true,
        unique:true,

    }
    // password:{
    //     type:String,
    //     unique:true,
    // }
})

module.exports=mongoose.model("User",userSchema);