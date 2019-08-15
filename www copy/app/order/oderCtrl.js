app.controller('OrdersCtrl', function ($scope, $stateParams, WC, $window, ApiServices, SharedService) {
    var Woocommerce = WC.WC(); // woocommerce dependency
    var productDetailsAPI = ApiServices.getproductDetailsURL();
    $scope.orderedItemList = [];
    $scope.total = 0;

    var openOrder = function () {
        var orderNo = window.localStorage.getItem("showorder");
        var orderNewURL = ApiServices.getNewOrderDetailURL();
        fetch(orderNewURL + orderNo)
            .then(e => e.json())
            .then(e => {
                for (var t in e.items) {
                    var a = e.items[t];
                    var x=new DOMParser();
                    var b=x.parseFromString(a.image,'text/html');
                    var c=b.getElementsByTagName("img")[0].getAttribute("src");
                    var obj={name:a.name, price:a.price, quantity:a.quantity, total:a.total, images:[{src:"https:"+c}]};
                    if (a.sizes && a.sizes.size) {
                        obj["size"]=a.sizes.size;
                    }
                    $scope.orderedItemList.push(obj);
                }
                $scope.s_total=e.s;
                $scope.shipping=e.u;
                $scope.total=e.t;
            })
            .catch(e => {
                SharedService.stopLoading();
                SharedService.showToastMsg('Error displaying your order')
                console.log(e);
            }).finally(()=>{
            SharedService.stopLoading();
        });
    }

    $scope.$on('$ionicView.afterEnter', function () {
        SharedService.startLoading();
        openOrder();

        return;

        $scope.cartData = JSON.parse($window.localStorage['orders']);
        SharedService.startLoading();
        angular.forEach($scope.cartData, function (value, key) {
            Woocommerce.get(productDetailsAPI + value.product_id, function (err, data, res) {
                var productDetails = JSON.parse(res);
                productDetails.total = value.total;
                productDetails.quantity = value.quantity;
                $scope.total = $scope.total + parseInt(productDetails.total);

                $scope.orderedItemList.push(productDetails);
                SharedService.stopLoading();
            });
        });
        console.log($scope.orderedItemList);
    });

    $scope.back = function () {
        window.history.back();
    };


});
