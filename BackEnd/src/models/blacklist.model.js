const mongoose =require('mongoose');

const blacklistTokenSchema=new mongoose.Schema({
    token:{
        type:String,
        requierd:[true,"Token is Required to be added in blacklist"]
    }
}, 
    {timestamps:true}
)

const tokenBlackListModel=mongoose.model("blacklistTokens", blacklistTokenSchema)

module.exports=tokenBlackListModel;