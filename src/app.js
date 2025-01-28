import express from "express"
import morgan from "morgan"
import productsRouter from './routes/product.routes.js'
import cartsRouter from './routes/carts.routes.js'
import http from 'http'

const app = express()

// Middlewares
app.use(express.json())
app.use(morgan(process.env.NODE_ENV || 'dev'))
app.use(express.urlencoded({ extended: true}))

// Routes
app.use("/static", express.static("public"))
app.use('/api/products', productsRouter)
app.use('/api/carts', cartsRouter)
app.get("/", (req, res) => {
    res.sendFile('index.html', {root: './public' })
})


http.createServer(app).listen(8080, () => {
    console.log("Server is running on http://localhost:8080")
})