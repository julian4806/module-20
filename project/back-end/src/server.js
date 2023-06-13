import express from "express";
import { MongoClient } from 'mongodb'
import {
  cartItems as cartItemsRaw,
  products as ProductsRaw,
} from "./temp-data";

let cartItems = cartItemsRaw;
let products = ProductsRaw;



async function start() {
  const client = new MongoClient("mongodb://localhost:27017/")

  await client.connect()
  const db = client.db('oil_db')

  const app = express();
  app.use(express.json());

  app.get("/products", async (req, res) => {
    await client.connect()
    const db = client.db('oil_db')
    const products = await db.collection('products').find({}).toArray()
    res.send(products)
  });

  async function populateCartIds(ids) {

    return Promise.all(ids.map((id) => db.collection('products').findOne({ id })))
  }

  app.get("/cart", (req, res) => {
    const populatedCart = populateCartIds(cartItems);
    res.json(populatedCart);
  });

  // GET CART CONTENTS
  app.get("/users/:userId/cart", async (req, res) => {
    const user = await db.collection('users').findOne({ id: req.params.userId })
    const populatedCart = await populateCartIds(user.cartItems);
    res.json(populatedCart);
  });

  // ADD CART CONTENTS
  app.post('/users/:userId/cart', async (req, res) => {
    const userId = req.params.userId
    const productId = req.body.id

    // ADD TO DB WITHOUT DUPLICATES
    await db.collection('users').updateOne({ id: userId }, {
      $addToSet: { cartItems: productId }
    })

    const user = await db.collection('users').findOne({ id: req.params.userId })
    const populatedCart = await populateCartIds(user.cartItems);
    res.json(populatedCart);
  })


  // GET PRODUCT
  app.get("/products/:productId", async (req, res) => {
    const productId = req.params.productId
    const product = await db.collection('products').findOne({ id: productId })
    res.json(product)
  });

  app.listen(8000, () => {
    console.log("server is listening on port 8000");
  });

}

start()