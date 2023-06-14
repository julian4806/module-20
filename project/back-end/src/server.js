import express from "express";
import { MongoClient } from "mongodb";
import path from "path";

async function start() {
  const client = new MongoClient("mongodb://127.0.0.1:27017/");

  await client.connect();
  const db = client.db("oil_db");

  const app = express();
  app.use(express.json());

  // IMAGES
  app.use("/images", );

  app.get("/api/products", async (req, res) => {
    await client.connect();
    const db = client.db("oil_db");
    const products = await db.collection("products").find({}).toArray();
    res.send(products);
  });

  async function populateCartIds(ids) {
    return Promise.all(
      ids.map((id) => db.collection("products").findOne({ id }))
    );
  }

  app.get("/api/cart", (req, res) => {
    const populatedCart = populateCartIds(cartItems);
    res.json(populatedCart);
  });

  // GET CART CONTENTS
  app.get("/api/users/:userId/cart", async (req, res) => {
    const user = await db
      .collection("users")
      .findOne({ id: req.params.userId });
    const populatedCart = await populateCartIds(user.cartItems);
    res.json(populatedCart);
  });

  // ADD CART CONTENTS
  app.post("/api/users/:userId/cart", async (req, res) => {
    const userId = req.params.userId;
    const productId = req.body.id;

    // ADD TO DB WITHOUT DUPLICATES
    await db.collection("users").updateOne(
      { id: userId },
      {
        $addToSet: { cartItems: productId },
      }
    );

    const user = await db
      .collection("users")
      .findOne({ id: req.params.userId });
    const populatedCart = await populateCartIds(user.cartItems);
    res.json(populatedCart);
  });

  // DELETE product
  app.delete("/api/users/:userId/cart/:productId", async (req, res) => {
    const userId = req.params.userId;
    const productId = req.params.productId;

    await db.collection("users").updateOne(
      { id: userId },
      {
        $pull: {
          cartItems: productId,
        },
      }
    );

    const user = await db
      .collection("users")
      .findOne({ id: req.params.userId });
    const populatedCart = await populateCartIds(user.cartItems);
    res.json(populatedCart);
  });

  // GET PRODUCT
  app.get("/api/products/:productId", async (req, res) => {
    const productId = req.params.productId;
    const product = await db.collection("products").findOne({ id: productId });
    res.json(product);
  });

  app.listen(8000, () => {
    console.log("server is listening on port 8000");
  });
}

start();
