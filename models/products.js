const mongoose=require('mongoose');

const Schema =mongoose.Schema;

const productSchema=new Schema({
     cat:String,
     image: String,
     quantity :  String ,
     title :  String ,
     price : Number,
     subcat :  String 
})

module.exports=mongoose.model('Product',productSchema);

