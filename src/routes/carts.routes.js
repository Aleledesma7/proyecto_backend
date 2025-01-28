import express from "express"
import fs from 'fs'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ruta del archivo products.json (nuestra base de datos)
const cartsPath = path.join(__dirname, "..", 'data/carts.json')

router.get("/:cid", (req, res) => {
    // verifico si el archivo existe
    if (fs.existsSync(cartsPath)) {
        const carts = fs.readFileSync(cartsPath)
        const cart = JSON.parse(carts).find(cart => cart.id === req.params.cid)
        if (!cart) {
            res.status(404).send({ status: "not found", message: `Product with id: ${req.params.cid} not found` })        
        }
        res.send({ status: "ok", payload: cart })
        return
    }

    res.status(404).send({ status: "not found", message: `Product with id: ${req.params.cid} not found` })
});

router.post("/", (req, res) => {
    // verifico si el archivo existe
    if (fs.existsSync(cartsPath)) {
        const carts = fs.readFileSync(cartsPath)
        const cartsJSON = JSON.parse(carts)
        const id = crypto.randomUUID()

        cartsJSON.push({ id, ...req.body })

        fs.writeFileSync(cartsPath, JSON.stringify(cartsJSON))
        res.send({ status: "ok", message: "Cart created" })
        return
    }

    fs.writeFileSync(cartsPath, JSON.stringify([req.body]))
    res.send({ status: "ok", message: "Product created" })
});

router.post("/:cid/product/:pid", (req, res) => {
    // verifico si el archivo existe
    if (fs.existsSync(cartsPath)) {
        const carts = fs.readFileSync(cartsPath)
        const cartsJSON = JSON.parse(carts)

        const cartIndex = cartsJSON.findIndex(cart => cart.id === req.params.cid)

        if (cartIndex === -1) {
            res.status(404).send({ status: "not found", message: "The requested cart was not found" })
        }

        const productIndex = cartsJSON[cartIndex].products.findIndex(product => product.product === req.params.pid)

        if (productIndex === -1) {
            res.status(404).send({ status: "not found", message: "The requested product on cart was not found" })
        }

        cartsJSON[cartIndex].products[productIndex] = { product: req.params.pid, ...req.body }

        fs.writeFileSync(cartsPath, JSON.stringify(cartsJSON))
        res.send({ status: "ok", message: "Cart updated" })
        return
    }

    res.status(404).send({ status: "not found", message: "The requested cart was not found" })
});


export default router;