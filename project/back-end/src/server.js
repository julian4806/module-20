import express from "express"
import { cartItems, products } from './temp-data'

const app = express()

app.get('/hello', (req, res) => {
    res.send('Hey!sssssssssssssssssssss')
})
app.get('/products', (req, res) => {
    res.json(products)
})
app.get('/cart', (req, res) => {
    res.json(cartItems)
})
app.get('/products/:productId', (req, res) => {
    const productId = req.params.productId
    const product = products.find(product => product.id === productId)
    res.json(product)
})

app.listen(8000, () => {
    console.log('server is listening on port 8000')
})