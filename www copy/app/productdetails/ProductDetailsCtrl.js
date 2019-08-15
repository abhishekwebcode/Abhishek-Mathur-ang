app.controller('ProductDetailsCtrl', function ($scope, $stateParams, $timeout, $state, WC, ApiServices, SharedService, $window, $ionicPopup) {
  var Woocommerce = WC.WC(); // woocommerce dependency
  //console.log("productDetails" + JSON.stringify($stateParams.productDetails));
  $scope.productDetails = JSON.parse($window.localStorage['productDetail']);
  console.log("debugging producrtderauks")
  console.dir($scope.productDetails);

  if ($scope.productDetails.attributes.length != 0) {
    $scope.size = true;
    $scope.productSize = $scope.productDetails.attributes[0].options;
    console.log($scope.productSize);
    $scope.selectedCat = $scope.productSize[0];
  }

  $scope.$on('$ionicView.afterEnter', function () {
    // Anything you can think of
    // SharedService.startLoading();
    //alert("test")
    $scope.cartData = JSON.parse($window.localStorage['cartdata']);
    $scope.badge = 0;
    $scope.$emit('mycart', $scope.cartData);
    try {$("#sizeSelect")[0].selectedIndex = 0;} catch (e) {

    }
    getRelatedItems();

  });

  var getRelatedItems = function () {
    //to get related items
    SharedService.startLoading();
    var productDetailsAPI = ApiServices.getproductDetailsURL();
    $scope.relatedProductDetailsList = [];
    var relatedProductIdList = $scope.productDetails.related_ids;
    console.log(relatedProductIdList.length)
    for (var i = 0; i < relatedProductIdList.length; i++) {
      Woocommerce.get(productDetailsAPI + relatedProductIdList[i], function (err, data, res) {
        var relatedProductDetails = JSON.parse(res);
        relatedProductDetails.cart = false;
        if($scope.cartData.length!=0){
          angular.forEach($scope.cartData,function(value1,key){
            if(value1.id==relatedProductDetails.id){
              relatedProductDetails.cart=true;
            }
          })
        }
        $scope.relatedProductDetailsList.push(relatedProductDetails);
        $scope.$apply();
         SharedService.stopLoading();
        // console.log($scope.relatedProductDetailsList.length);
        if (err)
          console.log(err);
      });
    }
  };

  $scope.openRelated = function (data) {
      $scope.productDetails = data;
      $window.localStorage['productDetail'] = JSON.stringify(data);
      // if ($scope.productDetails.attributes.length != 0) {
      //   $scope.size = true;
      //   $scope.productSize = $scope.productDetails.attributes[0].options;
      //   $scope.selectedCat = $scope.productSize[0];
      // }
      // getRelatedItems();
      // SharedService.stopLoading();
      window.location.reload();
  };

  $scope.mycart = function () {
    // $state.go('app.mycart')
    SharedService.showToastMsg("Work in progress");
  };

  $scope.back = function () {
    console.log("back")
    window.history.back();
  };

  var showGenericError=function (sharedService) {
    sharedService.showToastMsg("There was an error adding variation to cart,please check your internet connection");
  }

  var addCartVariation=function(product,cat,ss) {
    if (cat=="") {
      ss.showToastMsg("Please Select a size");return;
    }
        var tt=ss;
        console.log("SHard",tt);
        console.log(product,cat,"VARAIRTION");
        tt.startLoading();
        fetch("https://www.whomikart.com/api/respond/getPV?query="+$scope.productDetails.id)
            .then(e=>{
              if (e.ok) {return e}
              throw Error("network error")
            })
            .then(e=>e.json())
            .then(e=>{
              var json=e;
              if (!(cat in e.r)) {
                tt.showToastMsg("Your selected size is not active")
                throw new Error("");
              }
              else {
                product.cart = true;
                product.quantity = 1;
                product.totalprice = product.quantity * product.price;
                product.appSize=cat;
                product.appVaritaion=e.r[cat];
                console.log("hrrrr",product);
                $scope.cartData.push(product);
                $window.localStorage['cartdata'] = JSON.stringify($scope.cartData)
                $scope.$emit('mycart', $scope.cartData);
              }
            })
            .catch(e=>{
              console.error("dsfdsf",e)
              showGenericError(tt);
            })
            .finally(()=>{
              tt.stopLoading();
            })
  }

  $scope.addtoCart = function (product) {
    if (product.stock_quantity == 0) {
      SharedService.showToastMsg("Out Of Stock");
    } else {

      if (product.attributes.length!=0) {
        addCartVariation(product,$("#sizeSelect").val(),SharedService);
        return;
      }


      product.cart = true;
      product.quantity = 1;
      product.totalprice = product.quantity * product.price;
      $scope.cartData.push(product);
      $window.localStorage['cartdata'] = JSON.stringify($scope.cartData)
      $scope.$emit('mycart', $scope.cartData);
    }
  };

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
  };

  var vartiationBuyNow=function(product,cat,ss) {
    if (cat=="") {
      ss.showToastMsg("Please Select a size");return;
    }
    var tt=ss;
    console.log("SHard",tt);
    console.log(product,cat,"VARAIRTION");
    tt.startLoading();
    fetch("https://www.whomikart.com/api/respond/getPV?query="+$scope.productDetails.id)
        .then(e=>{
          if (e.ok) {return e}
          throw Error("network error")
        })
        .then(e=>e.json())
        .then(e=>{
          var json=e;
          if (!(cat in e.r)) {
            tt.showToastMsg("Your selected size is not active")
            throw new Error("");
          }
          else {
            product.cart = true;
            product.quantity = 1;
            product.totalprice = product.quantity * product.price;
            product.appSize=cat;
            product.appVaritaion=e.r[cat];
            console.log("hrrrr",product);
            $scope.cartData.push(product);
            $window.localStorage['cartdata'] = JSON.stringify($scope.cartData)
            $scope.$emit('mycart', $scope.cartData);
            $state.go('app.mycart');
          }
        })
        .catch(e=>{
          console.error("dsfdsf",e)
          showGenericError(tt);
        })
        .finally(()=>{
          tt.stopLoading();
        })
  }
  $scope.buynow = function (product) {
    if (product.stock_quantity == 0) {
      SharedService.showToastMsg("Product out of stock");
    } else {
      if (product.cart == true) {
        $state.go('app.mycart');
      } else {
        if (product.attributes.length!=0) {
          vartiationBuyNow(product,$("#sizeSelect").val(),SharedService);
          return;
        }
        product.cart = true;
        product.quantity = 1;
        product.totalprice = product.quantity * product.price;
        $scope.cartData.push(product);
        $window.localStorage['cartdata'] = JSON.stringify($scope.cartData)
        $scope.$emit('mycart', $scope.cartData);
        $state.go('app.mycart');
      }
    }
  };

  $scope.$on('mycart', function (event, data) {
    $scope.badge = data.length;
  });

  $scope.mycart = function () {
    $state.go('app.mycart')
    // SharedService.showToastMsg("Work in progress");
  };
});
