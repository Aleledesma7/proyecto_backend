import Product from '../schemas/product.schema.js';

export default class ProductService {

    async addProduct(product) {
        try {
            const productMongo = new Product(product)
            const products = await Product.find();
            let existCode = false

            if (products.length !== 0) {
                products.map((value) => {
                    console.log(value, product)
                    if (value.code === product.code) existCode = true
                })
            }

            if (existCode) {
                console.log(existCode)
                return { status: "error", statusCode: 409, message: `Product with code: ${product.code} already exists` }
            }

            const productCreated = await productMongo.save();
            return { status: "success", payload: productCreated }
        } catch (e) {
            return { status: "error", statusCode: 500, message: e.toString() }
        }
    }

    async getProducts() {
        try {
            const response = await Product.find()

            if (!response) {
                return { status: "error", statusCode: 400, message: `Something went wrong` }
            }

            return { status: "success", payload: response }
        } catch (e) {
            return { status: "error", statusCode: 500, message: e.toString() }
        }
    }

    async getProductById(id) {
        try {
            const response = await Product.findById(id)

            if (!response) {
                return { status: "error", statusCode: 404, message: `Product with id: ${id} not found` }
            }

            return { status: "success", payload: response }
        } catch (e) {
            return { status: "error", statusCode: 500, message: e.toString() }
        }
    }

    async deleteProduct(id) {
        try {
            const product = await Product.findByIdAndDelete(id)

            if (!product) {
                return { status: "error", statusCode: 404, message: `Product with id: ${id} not found` }
            }

            return { status: "success", message: "Product deleted" }
        } catch (e) {
            return { status: "error", statusCode: 500, message: e.toString() }
        }
    }

    async updateProduct(id, product) {
        try {
            const response = await Product.updateOne({ _id: id }, product);
            if (!response) {
                return { status: "error", statusCode: 404, message: `Product with id: ${id} not found` }
            }

            return { status: "success", message: "Product updated", payload: response }
        } catch (e) {
            return { status: "error", statusCode: 500, message: e.toString() }
        }
    }
}