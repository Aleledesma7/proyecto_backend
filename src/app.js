import express from "express"
import morgan from "morgan"
import productsRouter from './routes/product.routes.js'
import cartsRouter from './routes/carts.routes.js'
import http from 'http'
import { engine } from "express-handlebars"
import { Server } from "socket.io"
import ProductService from "./services/products.service.js"
import fs from 'fs'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'
import { connectDB } from "./config/mongo.connection.js"

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express()
const server = http.createServer(app)
const io = new Server(server)
const productService = new ProductService()

app.engine('handlebars', engine({ defaultLayout: "main" }));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, "..", 'views'));

// Middlewares
app.use(express.json())
app.use(morgan(process.env.NODE_ENV || 'dev'))
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

// Routes
app.use("/static", express.static("public"))
app.use('/api/products', productsRouter)
app.use('/api/carts', cartsRouter)

app.get("/", async (req, res) => {
    res.render("home", { title: "Listado de productos" })
})


app.get("/realtimeproducts", (req, res) => {
    io.on('connection', (socket) => {
        const products = productService.getProducts()
        console.log('a user connected', socket.id);

        socket.emit('send-products', products);


        socket.on("add-product", (data) => {
            productService.addProduct(data)
            io.sockets.emit('send-products', productService.getProducts());
        });

        socket.on('disconnect', () => {
            console.log('user disconnected', socket.id);
        });
    });

    res.render("realTimeProduct", { title: "Listado de productos en tiempo real" })
})

server.listen(8080, () => {
    connectDB();
    console.log("Server is running on http://localhost:8080")
})