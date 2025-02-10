import fs from 'fs'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default class ProductService {
    productsPath = path.join(__dirname, "..", 'data/products.json')

    addProduct(product) {
        console.log(product)
        if (fs.existsSync(this.productsPath)) {
            const products = fs.readFileSync(this.productsPath)  // lee el archivo de products.json
            const productsJSON = JSON.parse(products)
            const id = crypto.randomUUID()
            const { code } = product

            if (productsJSON.find(product => product.code === code)) {
                return { status: "error", message: `Product with code: ${code} already exists` }
            }

            productsJSON.push({ id, ...product })

            fs.writeFileSync(this.productsPath, JSON.stringify(productsJSON))
            return { status: "ok", message: "Product created" }
        }

        fs.writeFileSync(productsPath, JSON.stringify([product]))
        return { status: "ok", message: "Product created" }
    }

    getProducts() {
        if (fs.existsSync(this.productsPath)) {
            const products = fs.readFileSync(this.productsPath) // lee el archivo de products.json
            return JSON.parse(products)
        }
        return []
    }

    getProductById(id) {
        if (fs.existsSync(this.productsPath)) {
            const products = fs.readFileSync(this.productsPath) // lee el archivo de products.json
            const product = JSON.parse(products).find(product => product.id === id)            
            if (!product) {
                return { status: "not found", message: `Product with id: ${id} not found` }
            }
            return product
        }
        return { status: "not found", message: `Product with id: ${id} not found` }
    }

    deleteProduct(id) {
        if (fs.existsSync(this.productsPath)) {
            const products = fs.readFileSync(this.productsPath) // lee el archivo de products.json
            const productsJSON = JSON.parse(products)
            const productIndex = productsJSON.findIndex(product => product.id === id)

            if (productIndex !== -1) { // si se encuentra
                productsJSON.splice(productIndex, 1) // se elimina del array
                fs.writeFileSync(this.productsPath, JSON.stringify(productsJSON))
                return { status: "ok", message: "Product deleted" }

            }

            return { status: "not found", message: `Product with id: ${id} not found` }
        }

        return { status: "not found", message: "Products not found" }
    }

    updateProduct(id, product) {
        if (fs.existsSync(this.productsPath)) {
            const products = fs.readFileSync(this.productsPath) // lee el archivo de products.json
            const productsJSON = JSON.parse(products)
            const productIndex = productsJSON.findIndex(product => product.id === id) // se busca el index

            if (productIndex !== -1) { // si se encuentra el index
                delete product.id

                productsJSON[productIndex] = { ...productsJSON[productIndex], ...product } // agrega el contenido del body dentro del indice buscado
                fs.writeFileSync(this.productsPath, JSON.stringify(productsJSON)) // escribo en el archivo
                return { status: "ok", message: "Product updated" }

            }

            return { status: "not found", message: `Product with id: ${id} not found` }

        }

        return { status: "not found", message: "Products not found" }
    }
}