import express from "express"
import ProductService from "../services/products.service.js";

const router = express.Router()
const productsService = new ProductService()

router.get("/", (req, res) => {
    const products = productsService.getProducts()
    res.send(products)
});

router.get("/:pid", (req, res) => {
    const product = productsService.getProductById(req.params.pid)
    if (product.hasOwnProperty("status")) {
        res.status(404).send(product)
        return
    }
    res.send(product)
});

router.post("/", (req, res) => {
    const response = productsService.addProduct(req.body)
    if (response.hasOwnProperty("error")) {
        res.status(400).send(response)
        return
    }
    res.send(response)
});

router.put("/:pid", (req, res) => {
    const response = productsService.updateProduct(req.params.pid, req.body)
    if (response.hasOwnProperty("error")) {
        res.status(400).send(response)
        return
    }
    res.send(response)
});

router.delete("/:pid", (req, res) => {
    const response = productsService.deleteProduct(req.params.pid)
    if (response.hasOwnProperty("not found")) {
        res.status(404).send(response)
        return
    }
    res.send(response)
});

export default router;