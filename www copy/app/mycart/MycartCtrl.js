﻿app.controller('MycartCtrl', function ($scope, $stateParams, $ionicPopup,$window, $state, WC, ApiServices, $rootScope, $ionicHistory) {
  $scope.$on('$ionicView.afterEnter', function () {
    // Anything you can think of
    // SharedService.startLoading();
    //alert("test")
    $scope.cartData = JSON.parse( $window.localStorage['cartdata']);
    $scope.badge = 0;
    $scope.subtotal = 0;
    $scope.$emit('mycart', $scope.cartData);
    console.log($scope.cartData);
  });
  var Woocommerce = WC.WC(); // woocommerce dependency
  var paymentMethod = ApiServices.getPaymentMethodURL();
  var createorderAPI = ApiServices.getcreateOrderURL();

  $scope.openDelivery = function () {
    $state.go('app.delivery');
  }

  $scope.back = function () {
    window.history.back();
  }
  
  $scope.removeCart = function (product) {
    var confirmPopup = $ionicPopup.confirm({
      title: 'Remove from cart',
      template: 'Are you sure you want to remove from the cart?'
    });
    confirmPopup.then(function (res) {
      if (res) {
        product.cart = false;
        product.quantity = 0;
        product.totalprice = 0;
        angular.forEach($scope.cartData, function (value, key) {
          if (value.id == product.id) {
            $scope.cartData.splice(key, 1);
          }
        });
        $scope.$emit('mycart', $scope.cartData);
         $window.localStorage['cartdata'] = JSON.stringify($scope.cartData);
      } else {
        console.log('You are not sure');
      }
    });
  }

  $scope.$on('mycart', function (event, data) {
    $scope.subtotal = 0;
    $scope.badge = data.length;
    angular.forEach(data, function (value, key) {
      $scope.subtotal = value.totalprice + $scope.subtotal;
    });
    console.log($scope.cartData);
  });

  $scope.addItem = function (data) {
    data.quantity = data.quantity + 1;
    data.totalprice = data.quantity * data.price;
    console.log($scope.cartData)
     $window.localStorage['cartdata'] = JSON.stringify($scope.cartData);
    $scope.$emit('mycart', $scope.cartData);
  }
  $scope.removeItem = function (data) {
    data.quantity = data.quantity - 1;
    data.totalprice = data.quantity * data.price;
    console.log($scope.cartData)
    if (data.quantity == 0) {
      var confirmPopup = $ionicPopup.confirm({
        title: 'Remove from cart',
        template: 'Are you sure you want to remove from the cart?'
      });
      confirmPopup.then(function (res) {
        if (res) {
          angular.forEach($scope.cartData, function (value, key) {
            if (value.id == data.id) {
              $scope.cartData.splice(key, 1);
            }
          });
           $window.localStorage['cartdata'] = JSON.stringify($scope.cartData);
          $scope.$emit('mycart', $scope.cartData);
        } else {
          data.quantity = 1;
          data.totalprice = data.quantity * data.price;
        }
      });
    }
     $window.localStorage['cartdata'] = JSON.stringify($scope.cartData);
    $scope.$emit('mycart', $scope.cartData);
  }

  $scope.ProceedToPay = function () {
    $state.go('paymentMethod');
  }
  // orderlist
});
