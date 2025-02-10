import express from "express"
import CartsService from "../services/carts.service.js";

const router = express.Router()
const cartsService = new CartsService()

router.get("/:cid", (req, res) => {
    const cart = cartsService.getCartById(req.params.cid)
    if (cart.hasOwnProperty("status")) {
        res.status(404).send(cart)
        return
    }
    res.send(cart)
});

router.post("/", (req, res) => {
    const response = cartsService.addCart(req.body)
    if (response.hasOwnProperty("error")) {
        res.status(400).send(response)
        return
    }
    res.send(response)
});

router.post("/:cid/product/:pid", (req, res) => {
    const response = cartsService.addProductToCart(req.params.cid, req.params.pid, req.body)
    if (response.hasOwnProperty("error") || response.hasOwnProperty("not found")) {
        res.status(400).send(response)
        return
    }
    res.send(response)
});


export default router;