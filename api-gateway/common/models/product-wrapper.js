'use strict';


module.exports = function(Productwrapper) {

var cache = {};
Productwrapper.lookup = function(productId, next) {
  if (cache[productId]) {
    console.log('Serving from cache for ' + productId);
  next(null,cache[productId])
  } else {
    console.log('Making REST call for ' + productId);
    var productRestService = Productwrapper.app.dataSources.ProductRestService;
    var productData;
    productRestService.getProducts(productId,function(err, response, context) {
      productData = response;
      cache[productId] = productData;
      next(null, productData);
    });
  }
}

Productwrapper.remoteMethod('lookup', {
      accepts: {arg: 'productId', type: 'string'},
      returns: {arg: 'product', type: 'string'},
      http: { verb: 'get', path: '/lookup' }
});
};
