const PORT = process.env.PORT || 3000;
const POLLING_INTERVAL = 60000 * 5; // Every 5 min
const URL_SEGMENT =
  "https://api.digitalriver.com/v1/shoppers/me/products?callback=jQuery111205399776325341743_1522978283981&format=json&expand=all&locale=en_us&apiKey=9485fa7b159e42edb08a83bde0d83dia&currency=USD";
const GPU_LIST = [
  // This is periodically in stock so it can be useful to test with
  // {
  //   productId: 5094274700,
  //   description: "NVIDIA Titan XP"
  // },
  {
    productId: 5094274900,
    description: "NVIDIA GeForce GTX 1080 Ti Founders Edition"
  },
  {
    productId: 2740204200,
    description: "NVIDIA GeForce GTX 1080 Founders Edition"
  },
  {
    productId: 5136449000,
    description: "NVIDIA GEFORCE GTX 1070 Ti"
  },
  {
    productId: 2740281000,
    description: "NVIDIA GeForce GTX 1070 Founders Edition"
  },
  {
    productId: 5056171200,
    description: "NVIDIA GeForce GTX 1060 6GB Founders Edition"
  }
];

module.exports = {
  POLLING_INTERVAL,
  URL_SEGMENT,
  GPU_LIST,
  PORT
};
