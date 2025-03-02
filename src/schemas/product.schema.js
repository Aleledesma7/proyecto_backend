import mongoose, { Mongoose, Types } from "mongoose";

const ProductSchema = new Mongoose().Schema({
    "title": { type: String, required: true },
    "description": { type: String, required: true },
    "code": { type: String, required: true },
    "price": { type: String, required: true },
    "status": { type: String, required: true },
    "stock": { type: String, required: true },
    "category": { type: String, required: true },
    "thumbnails": { type: [String], required: true }
});

const Product = mongoose.model("Product", ProductSchema)

export default Product;