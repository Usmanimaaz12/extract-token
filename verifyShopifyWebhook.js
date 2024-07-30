const crypto = require('crypto');

// Middleware to verify Shopify webhook HMAC signature
const verifyShopifyWebhook = (req, res, next) => {
  const hmacHeader = req.get('X-Shopify-Hmac-Sha256');
  const body = JSON.stringify(req.body);
  const generatedHash = crypto
    .createHmac('sha256', process.env.SHOPIFY_WEBHOOK_SECRET)
    .update(body, 'utf8')
    .digest('base64');

  if (generatedHash === hmacHeader) {
    next();
  } else {
    res.status(401).send('HMAC validation failed');
  }
};

module.exports = verifyShopifyWebhook;
