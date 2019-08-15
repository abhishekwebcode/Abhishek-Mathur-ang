app.controller('DashboardCtrl', function ($scope, $stateParams, $state,$window, WC, ApiServices, SharedService) {
    $scope.$on('$ionicView.afterEnter', function () {
        // Anything you can think of
        // SharedService.startLoading();
        //alert("test")
        $scope.catagoriesList = [];
        if ( $window.localStorage["catagoriesList"]) {
            $scope.catagoriesList = JSON.parse( $window.localStorage["catagoriesList"]);
        }

        $scope.cartData = JSON.parse( $window.localStorage['cartdata']);
        $scope.badge = 0;
        $scope.subtotal = 0;
        $scope.$emit('mycart', $scope.cartData);
    });
    $scope.$on('mycart', function (event, data) {
        $scope.subtotal = 0;
        $scope.badge = data.length;
    });

    var Woocommerce = WC.WC(); // woocommerce dependency
    $scope.showSearchbar = false;
    $scope.mycart = function () {
        $state.go('app.mycart')
        // SharedService.showToastMsg("Work in progress");
    }


    $scope.openList = function (id) {
        console.log(id);
        angular.forEach($scope.catagoriesList, function(value, key) {
            if(id==value.id){
                $scope.product= value;
            }
        });
         $window.localStorage['catagory'] = JSON.stringify($scope.product);
        $state.go('app.productlist');
    };
});
