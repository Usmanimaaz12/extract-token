const axios = require("axios");

const authorize = async (shop) => {
  return encodeURI(
    `https://${shop}.myshopify.com/admin/oauth/authorize?client_id=${process.env.client_id}&scope=${process.env.scopes}&redirect_uri=${process.env.redirect_uri}&access_mode=offline`
  );
};

const redirect = async (code, shop) => {
  let shopifyOAuthUrl = `https://${shop}/admin/oauth/access_token?client_id=${process.env.client_id}&client_secret=${process.env.client_secret}&code=${code}`;
  const { data } = await axios({
    url: shopifyOAuthUrl,
    method: "post",
    data: {},
  })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error;
    });
  console.log(data,"<==== res")
  return data;
};

const registerWebhooks = async (shop, accessToken) => {
  const webhooks = [
    { topic: 'app/uninstalled', address: `${process.env.redirect_uri}/api/webhooks/app/uninstalled` },
    { topic: 'customers/data_request', address: `${process.env.redirect_uri}/api/webhooks/customers/data_request` },
    { topic: 'customers/redact', address: `${process.env.redirect_uri}/api/webhooks/customers/redact` },
    { topic: 'shop/redact', address: `${process.env.redirect_uri}/api/webhooks/shop/redact` },
  ];

  for (const webhook of webhooks) {
    const url = `https://${shop}/admin/api/2022-01/webhooks.json`;
    await axios.post(url, {
      webhook: {
        topic: webhook.topic,
        address: webhook.address,
        format: 'json'
      }
    }, {
      headers: {
        'X-Shopify-Access-Token': accessToken,
        'Content-Type': 'application/json'
      }
    }).then(response => {
      console.log(`Webhook registered: ${webhook.topic}`);
    }).catch(error => {
      console.error(`Error registering webhook: ${webhook.topic}`, error.response.data.errors);
    });
  }
};

module.exports = {
  authorize,
  redirect,
  registerWebhooks
};
