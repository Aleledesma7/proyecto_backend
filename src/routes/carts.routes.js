import express from "express"
import CartsService from "../services/carts.service.js";

const router = express.Router()
const cartsService = new CartsService()

router.get("/:cid", async (req, res) => {
    const response = await cartsService.getCartById(req.params.cid)
    if (response.status === "error") {
        res.status(response.statusCode).send(response)
        return
    }
    res.send(response)
});

router.post("/", async (req, res) => {
    const response = await cartsService.addCart(req.body)
    if (response.status === "error") {
        res.status(response.statusCode).send(response)
        return
    }
    res.send(response)
});

router.put("/:cid/product/:pid", async (req, res) => {
    const response = await cartsService.addProductToCart(req.params.cid, req.params.pid, req.body)
    if (response.status === "error") {
        res.status(response.statusCode).send(response)
        return
    }
    res.send(response)
});

router.delete('/:cid', async (req, res) => {
    const response = await cartsService.deleteCart(req.params.cid);
    if (response.status === "error") {
        res.status(response.statusCode).send(response)
        return
    }
    res.send(response)
})

router.delete('/:cid/products/:pid', async (req, res) => {
    const response = await cartsService.deleteProductOnCart(req.params.cid, req.params.pid)
    if (response.status === "error") {
        res.status(response.statusCode).send(response)
        return
    }
    res.send(response)
})


export default router;