import express from "express"
import ProductService from "../services/products.service.js";
import { createResponseAndPagination } from "../config/createResponseAndPagination.js";

const router = express.Router()
const productsService = new ProductService()

router.get("/", async (req, res) => {
    const { page = 1, limit = 10, query, sort } = req.query;
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const response = await productsService.getProducts();
    const baseUrl = `${req.protocol}://${req.get("host")}${req.baseUrl}`;
    const payload = response.payload

    if (sort && sort.toLowerCase() === "asc") payload.sort((a, b) => a.price - b.price)
    if (sort && sort.toLowerCase() === "desc") payload.sort((a, b) => b.price - a.price)

    res.send(createResponseAndPagination(payload, response.status, pageNumber, limitNumber, baseUrl));
});

router.get("/:pid", async (req, res) => {
    const response = await productsService.getProductById(req.params.pid)
    if (response.status === "error") {
        res.status(response.statusCode).send(response)
        return
    }
    res.send(response)
});

router.post("/", async (req, res) => {
    const response = await productsService.addProduct(req.body)
    if (response.status === "error") {
        res.status(response.statusCode).send(response)
        return
    }
    res.send(response)
});

router.put("/:pid", async (req, res) => {
    const response = await productsService.updateProduct(req.params.pid, req.body)
    if (response.status === "error") {
        res.status(response.statusCode).send(response)
        return
    }
    res.send(response)
});

router.delete("/:pid", async (req, res) => {
    const response = await productsService.deleteProduct(req.params.pid)
    if (response.status === "error") {
        res.status(response.statusCode).send(response)
        return
    }
    res.send(response)
});

export default router;