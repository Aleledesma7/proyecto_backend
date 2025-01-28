import express from "express"
import fs from 'fs'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

router.get("/", (req, res) => {
    // ruta del archivo products.json (nuestra base de datos)
    const productsPath = path.join(__dirname, "..", 'data/products.json')

    // verifico si el archivo existe
    if (fs.existsSync(productsPath)) {
        const products = fs.readFileSync(productsPath) // lee el archivo de products.json
        res.send({ status: "ok", payload: JSON.parse(products) })
        return
    }
    res.status(404).send({ status: "not found", message: "Products not found" })
});

router.get("/:pid", (req, res) => {
    // ruta del archivo products.json (nuestra base de datos)
    const productsPath = path.join(__dirname, "..", 'data/products.json')

    // verifico si el archivo existe
    if (fs.existsSync(productsPath)) {
        const products = fs.readFileSync(productsPath) // lee el archivo de products.json
        const product = JSON.parse(products).find(product => product.id === req.params.pid)
        res.send({ status: "ok", payload: product })
        return
    }

    res.status(404).send({ status: "not found", message: `Product with id: ${req.params.pid} not found` })
});

router.post("/", (req, res) => {
    // ruta del archivo products.json (nuestra base de datos)
    const productsPath = path.join(__dirname, "..", 'data/products.json')

    // verifico si el archivo existe
    if (fs.existsSync(productsPath)) {
        const products = fs.readFileSync(productsPath)  // lee el archivo de products.json
        const productsJSON = JSON.parse(products)
        const id = crypto.randomUUID()
        const { code } = req.body

        if (productsJSON.find(product => product.code === code)) {
            res.status(400).send({ status: "error", message: `Product with code: ${code} already exists` })
            return
        }

        productsJSON.push({ id, ...req.body })

        fs.writeFileSync(productsPath, JSON.stringify(productsJSON))
        res.send({ status: "ok", message: "Product created" })
        return
    }

    fs.writeFileSync(productsPath, JSON.stringify([req.body]))
    res.send({ status: "ok", message: "Product created" })
});

router.put("/:pid", (req, res) => {
    // ruta del archivo products.json (nuestra base de datos)
    const productsPath = path.join(__dirname, "..", 'data/products.json')

    // verifico si el archivo existe
    if (fs.existsSync(productsPath)) {
        const products = fs.readFileSync(productsPath) // lee el archivo de products.json
        const productsJSON = JSON.parse(products)
        const productIndex = productsJSON.findIndex(product => product.id === req.params.pid) // se busca el index

        if (productIndex !== -1) { // si se encuentra el index
            delete req.body.id
            
            productsJSON[productIndex] = { ...productsJSON[productIndex], ...req.body } // agrega el contenido del body dentro del indice buscado
            fs.writeFileSync(productsPath, JSON.stringify(productsJSON)) // escribo en el archivo
            res.send({ status: "ok", message: "Product updated" })
            return
        }

        res.status(404).send({ status: "not found", message: `Product with id: ${req.params.pid} not found` })
        return
    }

    res.status(404).send({ status: "not found", message: "Products not found" })
});

router.delete("/:pid", (req, res) => {
    // ruta del archivo products.json (nuestra base de datos)
    const productsPath = path.join(__dirname, "..", 'data/products.json')

    // verifico si el archivo existe
    if (fs.existsSync(productsPath)) {
        const products = fs.readFileSync(productsPath) // lee el archivo de products.json
        const productsJSON = JSON.parse(products)
        const productIndex = productsJSON.findIndex(product => product.id === req.params.pid)

        if (productIndex !== -1) { // si se encuentra
            productsJSON.splice(productIndex, 1) // se elimina del array
            fs.writeFileSync(productsPath, JSON.stringify(productsJSON))
            res.send({ status: "ok", message: "Product deleted" })
            return
        }

        res.status(404).send({ status: "not found", message: `Product with id: ${req.params.pid} not found` })
        return
    }

    res.status(404).send({ status: "not found", message: "Products not found" })
});

export default router;