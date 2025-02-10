import fs from 'fs'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default class CartsService {
    cartsPath = path.join(__dirname, "..", 'data/carts.json')

    addCart(cart) {
        console.log(cart)
        if (fs.existsSync(this.cartsPath)) {
            const carts = fs.readFileSync(this.cartsPath)  // lee el archivo de carts.json
            const cartsJSON = JSON.parse(carts)
            const id = crypto.randomUUID()
            const { code } = cart

            if (cartsJSON.find(cart => cart.code === code)) {
                return { status: "error", message: `cart with code: ${code} already exists` }
            }

            cartsJSON.push({ id, ...cart })

            fs.writeFileSync(this.cartsPath, JSON.stringify(cartsJSON))
            return { status: "ok", message: "cart created" }
        }

        fs.writeFileSync(cartsPath, JSON.stringify([cart]))
        return { status: "ok", message: "cart created" }
    }

    addProductToCart(cartId, productId, product) {
        if (fs.existsSync(this.cartsPath)) {
            const carts = fs.readFileSync(this.cartsPath)
            const cartsJSON = JSON.parse(carts)

            const cartIndex = cartsJSON.findIndex(cart => cart.id === cartId)

            if (cartIndex === -1) {
                return { status: "not found", message: "The requested cart was not found" }
            }

            const productIndex = cartsJSON[cartIndex].products.findIndex(product => product.product === productId)

            if (productIndex === -1) {
                return { status: "not found", message: "The requested product on cart was not found" }
            }

            cartsJSON[cartIndex].products[productIndex] = { product: productId, ...product }

            fs.writeFileSync(this.cartsPath, JSON.stringify(cartsJSON))
            return { status: "ok", message: "Cart updated" }
        }

        return { status: "not found", message: "The requested cart was not found" }
    }

    getCarts() {
        if (fs.existsSync(this.cartsPath)) {
            const carts = fs.readFileSync(this.cartsPath) // lee el archivo de carts.json
            return JSON.parse(carts)
        }
        return []
    }

    getCartById(id) {
        if (fs.existsSync(this.cartsPath)) {
            const carts = fs.readFileSync(this.cartsPath) // lee el archivo de carts.json
            const cart = JSON.parse(carts).find(cart => cart.id === id)
            if (!cart) {
                return { status: "not found", message: `cart with id: ${id} not found` }
            }
            return cart
        }
        return { status: "not found", message: `cart with id: ${id} not found` }
    }    
}