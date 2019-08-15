app.service('ApiServices', function ($rootScope, $window) {

  var signinEP = "http://www.whomikart.com/wp-json/jwt-auth/v1/token";
  var signupEP = "customers";
  var catagoryListEP = "products/categories?per_page=70";
  var productListEP = "products/?category=";
  var productDetailEP = "";
  var ordersListEP = "";
  var addressEP = "";
  var createOrderEP = "orders";
  var paymentMethodEP = "payment_gateways";
  var productDetailsEP = "products/";
  var customerDetailEP = "customers?email=";
  var customerUpdateEP = "customers/";

  //api for getting signin endpoint
  this.getSigninURL = function () {
    return signinEP;
  };

  //api for getting signup endpoint
  this.getSignupURL = function () {
    return signupEP;
  };

  //api for getting all product items
  this.getProductlistingURL = function (id) {
    return productListEP + id +"&per_page=70";
  };

  this.getCatagoriesListURL = function () {
    return catagoryListEP;
  };

  this.getOrdersListURL = function () {
    return ordersListEP;
  };

  this.getcreateOrderURL = function () {
    return createOrderEP;
  }

  this.getPaymentMethodURL = function () {
    return paymentMethodEP;
  }

  this.getproductDetailsURL = function () {
    return productDetailsEP;
  }

  this.getCustomerDetailURL = function () {
    return customerDetailEP;
  }
  this.getCustomerUpdateURL = function(){
    return customerUpdateEP;
  }

  this.getNewOrderDetailURL= function () {
    return `https://www.whomikart.com/api/respond/getOrderDetail/?ordf=`;
  }


});
