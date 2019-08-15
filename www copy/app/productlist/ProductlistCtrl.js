﻿app.controller('ProductlistCtrl', function ($scope,$ionicPopup,$window, $state, WC, SharedService, ApiServices, $timeout) {
  $scope.$on('$ionicView.afterEnter', function () {
    // Anything you can think of
    // SharedService.startLoading();
    //alert("test")
    $scope.cartData = JSON.parse( $window.localStorage['cartdata']);
    $scope.badge=0;
    $scope.$emit('mycart',$scope.cartData);
    $scope.searchText = "";
  });

  //location.reload();
  var Woocommerce = WC.WC(); // woocommerce dependency

  $scope.productList = [];
  $scope.catagoryDetail = JSON.parse( $window.localStorage['catagory']);
  var productListAPI = ApiServices.getProductlistingURL($scope.catagoryDetail.id);
  console.log(JSON.parse( $window.localStorage['catagory']));

  $scope.addtoCart = function (product) {
    if(product.stock_quantity==0){
      SharedService.showToastMsg(" Product out of stock");
    }
    else{
      product.cart=true;
      product.quantity = 1;
      product.totalprice = product.quantity*product.price;
      $scope.cartData.push(product);
       $window.localStorage['cartdata']=JSON.stringify($scope.cartData)
      $scope.$emit('mycart',$scope.cartData);
    }
  };

  $scope.removeCart = function(product){
    var confirmPopup = $ionicPopup.confirm({
      title: 'Remove from cart',
      template: 'Are you sure you want to remove from the cart?'
    });
    confirmPopup.then(function(res) {
      if(res) {
        product.cart=false;
        product.quantity = 0;
        product.totalprice = 0;
        angular.forEach($scope.cartData,function(value,key) {
          if(value.id==product.id){
            $scope.cartData.splice(key, 1);
          }
        });
        $scope.$emit('mycart',$scope.cartData);
         $window.localStorage['cartdata']=JSON.stringify($scope.cartData);
    
      } else {
        console.log('You are not sure');
      }
    });
     }

  $scope.$on('mycart', function(event, data) {
    $scope.badge=data.length;
  });

  $scope.mycart = function () {
    $state.go('app.mycart')
    // SharedService.showToastMsg("Work in progress");
  };
 
  $scope.openProductDetails = function (product) {
    $window.localStorage['productDetail'] = JSON.stringify(product);
    $state.go('app.productdetails');
  };

  $scope.getProductsList = function () {
    SharedService.startLoading();
    Woocommerce.get(productListAPI, function (err, data, res) {
      $scope.productList = JSON.parse(res);
      console.log( res);
      angular.forEach($scope.productList,function(value,key) {
        value.cart=false;
        value.quantity = 0;
        value.totalprice = 0;
        if($scope.cartData.length!=0){
          angular.forEach($scope.cartData,function(value1,key){
            if(value1.id==value.id){
              value.cart=true;
            }
          })
        }
      });
      SharedService.stopLoading();
      console.log($scope.productList);
      if (err)
        console.log(err);
      SharedService.stopLoading();
    });
  };

  $scope.openSearchbar = function () {
    $scope.showSearchbar = !$scope.showSearchbar;
  };

  $scope.back = function () {
    console.log("back")
    window.history.back();
  };

  $scope.filterFunc = function(filterValue){
    $scope.searchText = filterValue;
    console.log(filterValue);
  };

});
