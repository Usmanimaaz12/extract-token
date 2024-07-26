const axios = require("axios");

const authorize = async (shop) => {
  return encodeURI(
    `https://${shop}.myshopify.com/admin/oauth/authorize?client_id=${process.env.client_id}&scope=${process.env.scopes}&redirect_uri=${process.env.redirect_uri}`
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
  //   964e88f1c8e27d74c2b633e0f1377758
};

module.exports = {
  authorize,
  redirect,
};
