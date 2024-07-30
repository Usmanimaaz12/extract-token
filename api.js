const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();

const { authorize, redirect, registerWebhooks } = require("./shopifyOAuthHelper");
const verifyShopifyWebhook = require("./verifyShopifyWebhook");

const port = process.env.PORT || 4000;
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', async (req, res) => {
  res.send('<h1>Hello</h1>');
});

app.get("/api/shopify/authorize", async (req, res) => {
  try {
    return res.redirect(await authorize(req.query.shop));
  } catch (error) {
    console.error("Authorization error:", error);
  }
});

app.get("/api/shopify/redirect", async (req, res) => {
  try {
    const tokenData = await redirect(req.query.code, req.query.shop);
    await registerWebhooks(req.query.shop, tokenData.access_token);
    return res.json(tokenData);
  } catch (error) {
    console.error("Redirection error:", error);
  }
});

app.post('/api/webhooks/app/uninstalled', verifyShopifyWebhook, (req, res) => {
  console.log('App Uninstalled:', req.body);
  res.status(200).send('Webhook received');
});

app.post('/api/webhooks/customers/data_request', verifyShopifyWebhook, (req, res) => {
  console.log('Customers Data Request:', req.body);
  res.status(200).send('Webhook received');
});

app.post('/api/webhooks/customers/redact', verifyShopifyWebhook, (req, res) => {
  console.log('Customers Redact:', req.body);
  res.status(200).send('Webhook received');
});

app.post('/api/webhooks/shop/redact', verifyShopifyWebhook, (req, res) => {
  console.log('Shop Redact:', req.body);
  res.status(200).send('Webhook received');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});


// http://localhost:4000/api/shopify/authorize?shop=maaz-test-dev-store
// https://extract-token.onrender.com/api/shopify/authorize?shop=maaz-test-dev-store

// 1. maaz-test-dev-shop :
// {
//     access_token: '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',
//     scope: 'write_products'
//   }

// 2. regisedge-test-shop
// {"access_token":"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","scope":"write_products"}
