const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    slug: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
    },
    description: {
        type:String,
        required:true
    },
    category :{
        type:mongoose.ObjectId,
        ref: "category",
        required:true
    },
    photos: {
        data: Buffer,
        contentType: String
    },
    shipping: {
        type: String
    }
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);
