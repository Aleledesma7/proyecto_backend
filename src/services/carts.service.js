import Cart from "../schemas/cart.schema.js"
import Product from "../schemas/product.schema.js"

export default class CartsService {

    async addCart(cart) {
        try {
            const cartMongo = new Cart(cart)
            let isInvalidId = false

            for (const product of cart.products) {
                const existProduct = await Product.findById(product.product)
                if (!existProduct) isInvalidId = true
            }

            if (isInvalidId) {
                return { status: "error", statusCode: 404, message: "The requested product does not exist" }
            }

            const cartCreated = await cartMongo.save();
            return { status: "success", payload: cartCreated }
        } catch (e) {
            return { status: "error", statusCode: 500, message: e.toString() }
        }
    }

    async addProductToCart(cartId, productId, body) {
        try {
            const productExist = await Product.findById(productId)

            if (!productExist) {
                return { status: "error", statusCode: 404, message: "The requested product does not exist" }
            }

            const cart = await Cart.findById(cartId)
            let existOnCart = false


            cart.products = cart.products.map((product) => {
                if (product.product.toString() === productId) {
                    existOnCart = true;
                    return { ...product.toObject(), quantity: body.quantity }
                }
                return product;
            });

            if (!existOnCart) {
                cart.products.push({ product: productId, quantity: body.quantity })
            }

            const cartUpdate = await cart.save()

            return { status: "success", message: "Product added to cart", payload: cartUpdate }

        } catch (e) {
            return { status: "error", statusCode: 500, message: e.toString() }
        }
    }

    async getCartById(id) {
        try {
            const response = await Cart.findById(id).populate("products.product")

            if (!response) {
                return { status: "error", statusCode: 404, message: `Cart with id: ${id} not found` }
            }

            return { status: "success", payload: response }
        } catch (e) {
            return { status: "error", statusCode: 500, message: e.toString() }
        }
    }

    async deleteCart(id) {
        try {
            const cart = await Cart.findByIdAndDelete(id)

            if (!cart) {
                return { status: "error", statusCode: 404, message: `Cart with id: ${id} not found` }
            }

            return { status: "success", message: "Cart deleted" }
        } catch (e) {
            return { status: "error", statusCode: 500, message: e.toString() }
        }
    }

    async deleteProductOnCart(cartId, productId) {
        try {
            const cart = await Cart.findById(cartId);
            if (!cart) {
                return { status: "error", statusCode: 404, message: "Cart not found" };
            }

            const productExist = await Product.findById(productId)

            if (!productExist) {
                return { status: "error", statusCode: 404, message: "Product not found" };
            }

            if (cart.products.length === 0) {
                return { status: "error", statusCode: 404, message: "The cart is empty" };
            }

            const updatedProducts = cart.products.filter(product => product.product.toString() !== productId);

            cart.products = updatedProducts;
            const updatedCart = await cart.save();

            return { status: "success", message: "Product removed from cart", payload: updatedCart };
        } catch (e) {
            return { status: "error", statusCode: 500, message: e.toString() };
        }
    }
}