import mongoose, { Mongoose, Types } from "mongoose";

const CartSchema = new Mongoose().Schema({
    "products": [
        {
            "product": { type: Types.ObjectId, ref: "Product", required: true },
            "quantity": { type: Number, required: true }
        }
    ]
});

const Cart = mongoose.model("Cart", CartSchema)

export default Cart;