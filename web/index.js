// @ts-check
import { join } from "path";
import { readFileSync } from "fs";
import express from "express";
import serveStatic from "serve-static";

import shopify from "./shopify.js";
import productCreator from "./product-creator.js";
import PrivacyWebhookHandlers from "./privacy.js";
import mongoose from "mongoose";
import { GraphqlQueryError } from "@shopify/shopify-api";

const PORT = parseInt(
  process.env.BACKEND_PORT || process.env.PORT || "3000",
  10
);

const STATIC_PATH =
  process.env.NODE_ENV === "production"
    ? `${process.cwd()}/frontend/dist`
    : `${process.cwd()}/frontend/`;

const app = express();

// Set up Shopify authentication and webhook handling
app.get(shopify.config.auth.path, shopify.auth.begin());
app.get(
  shopify.config.auth.callbackPath,
  shopify.auth.callback(),
  shopify.redirectToShopifyOrAppRoot()
);
app.post(
  shopify.config.webhooks.path,
  shopify.processWebhooks({ webhookHandlers: PrivacyWebhookHandlers })
);

// If you are adding routes outside of the /api path, remember to
// also add a proxy rule for them in web/frontend/vite.config.js


app.use(express.json({ limit: '50mb' })); // Increased limit for image uploads
app.use("/userdata/*", authenticateUser);
app.use("/api/*", shopify.validateAuthenticatedSession());

// 1. connection to mongoose
// 2. create schema 
// 3. models
// 4. crud operations

mongoose.connect("mongodb://127.0.0.1:27017/shopdashboard")
  .then(() => {
    console.log("--- Connected to Mongoose Successfully ---");
  })
  .catch((error) => {
    console.log("--- Mongoose Can't Connect ---");
  })

let userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  useremail: {
    type: String,
    required: true,
    unique: true,
  }
});

let User = mongoose.model("userdata", userSchema);

async function authenticateUser(req, res, next) {
  let shop = req.query.shop;
  let storeName = await shopify.config.sessionStorage.findSessionsByShop(shop);
  if(shop === storeName[0].shop) {
    next();
  } else {
    res.send("User Not Authorized");
  }
}

// GETTING STOREFRONT DATA
app.post("/userdata/userinfo", async(req, res) => {
  let userData = req.body;
  try {
    let createUser = await User.create({
      username: userData[0][1],
      useremail: userData[1][1],
    });
    console.log("--- User Created Successfully ---", createUser);
    res.status(200).json({ message: "User Created Successfully" });
  } catch(error) {
    if(error.code === 11000) {
      return res.status(409).json({ message: "User Already Exists" });
    } else {
      console.log(error.message);
      return res.status(500).json({ error: error.message });
    }
  }
})

// app.get("/userdata/userinfo", async(req, res) => {
//   console.log("User info requested");
//   res.status(200).send("User info requested");
// })

app.get("/api/getusers", async(req, res) => {
  try {
    let users = await User.find({});
    res.status(200).send(users);
  }catch(error) {
    console.log(error)
  }
});

// GETTING STORE INFORMATION
app.get("/api/store/info", async(req, res) => {
  let storeInfo = await shopify.api.rest.Shop.all({
    session: res.locals.shopify.session,
  });
  res.status(200).send(storeInfo);
});

// GETTING STORE ORDERS
app.get("/api/orders/all", async(req, res) => {
  let storeOrders = await shopify.api.rest.Order.all({
    session: res.locals.shopify.session,
    status: "any",
  });
  res.status(200).send(storeOrders);
});

// READ ALL PRODUCTS
app.get("/api/product/count", async(req, res) => {
  let totalProducts = await shopify.api.rest.Product.count({
    session: res.locals.shopify.session,
  });
  res.status(200).send(totalProducts);
});

// READ ALL PRODUCTS
app.get("/api/products/all", async(req, res) => {
 let allProducts = await shopify.api.rest.Product.all({
  session: res.locals.shopify.session, 
});
res.status(200).send(allProducts);
});

// UPDATE A PRODUCT
app.put("/api/products/update", async(req, res) => {
  let getProduct = req.body;
  let updateProduct = new shopify.api.rest.Product({
    session: res.locals.shopify.session,
  });
  updateProduct.id = getProduct.id;
  updateProduct.title = getProduct.title;

  await updateProduct.save({
    update: true
  });
  res.status(200).send({Message: "Product Updated Successfully"});
})

// CREATE A PRODUCT
app.post("/api/product/create", async(req, res) => {
  try {
    let getProduct = req.body;
    let newProduct = new shopify.api.rest.Product({
      session: res.locals.shopify.session,
    });
    
    // Use data from the form
    newProduct.title = getProduct.title || "New Product";
    newProduct.body_html = getProduct.body_html || "New Product Description";
    newProduct.handle = getProduct.handle || "new-product-" + Date.now();
    newProduct.variants = [{
      price: getProduct.variants?.[0]?.price || "10.00",
    }];
    
    // Add image if provided
    if(getProduct.image && getProduct.image.attachment) {
      newProduct.images = [{
        attachment: getProduct.image.attachment,
        filename: getProduct.image.filename || 'product-image.jpg'
      }];
    }
    
    await newProduct.save({
      update: false,
    });
    
    res.status(200).send({ Message: "Product Created Successfully", product: newProduct });
  } catch(error) {
    console.error("Error creating product:", error);
    res.status(500).send({ error: error.message });
  }
});

// DELETE A PRODUCT


// READ ALL COLLECTIONS
app.get("/api/collection/count", async(req, res) => {
  let totalCollections = await shopify.api.rest.CustomCollection.all({
    session: res.locals.shopify.session,
  });
  res.status(200).send(totalCollections);
})

app.get("/api/products/create", async (_req, res) => {
  let status = 200;
  let error = null;

  try {
    await productCreator(res.locals.shopify.session);
  } catch (e) {
    console.log(`Failed to process products/create: ${e.message}`);
    status = 500;
    error = e.message;
  }
  res.status(status).send({ success: status === 200, error });
});




// Get all metafielsd of the store. 

// app.get("/api/metafields/all", async(req, res) => {
//   try {
//    let metafields = await shopify.api.rest.Metafield.all({
//     session: res.locals.shopify.session,
//    })
//    res.status(200).send(metafields);
//   }
//   catch {

//   }
// })


// GET Product Metafields
// app.get("/api/metafields/product", async(req,res) => {
//   try {
    
//     let productMetafields = await shopify.api.rest.Metafield.all({
//       session: res.locals.shopify.session,
//       Metafield: {
//        "owner_id": "8608978567334", 
//        "owner_resource": "product"
//       }
//     })
//     console.log("productMetafields", productMetafields);
//     res.status(200).send(productMetafields);
//   }
//   catch(error) {
//     console.log(error);
//   }
  


// })



// GET Product Metafields graphql 
// GET Product Metafields graphql
// GET Product Metafields graphql
// GET Product Metafields graphql
// GET Product Metafields graphql
app.get("/api/metafields/product/graphql", async(req,res) => {
  const client = new shopify.api.clients.Graphql({session:res.locals.shopify.session});
  try {
      let productMetafields = await client.request(`
        query MetafieldDefinitions($ownerType: MetafieldOwnerType!, $first: Int) {
      metafieldDefinitions(ownerType: $ownerType, first: $first) {
        nodes {
          name
          namespace
          key
          type {
            name
          }
        }
      }
    }
        `, {
        variables: {
          "ownerType": "PRODUCT",
          "first": 10
        },
      });
    res.status(200).send(productMetafields);
  } catch (error) {
    if (error instanceof GraphqlQueryError) {
      throw new Error(
        `${error.message}\n${JSON.stringify(error.response, null, 2)}`
      );
    }
  }
})




app.use(shopify.cspHeaders());
app.use(serveStatic(STATIC_PATH, { index: false }));

app.use("/*", shopify.ensureInstalledOnShop(), async (_req, res, _next) => {
  return res
    .status(200)
    .set("Content-Type", "text/html")
    .send(
      readFileSync(join(STATIC_PATH, "index.html"))
        .toString()
        .replace("%VITE_SHOPIFY_API_KEY%", process.env.SHOPIFY_API_KEY || "")
    );
});

app.listen(PORT);