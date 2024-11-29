module.exports = {
  customer: require("./customer"),
  // ! extracted to separate microservice
  // products: require('./products'),
  // shopping: require('./shopping')
  appEvent: require("./app-events"),
};
