﻿app.controller('MyordersCtrl', function ($scope, $state, $stateParams,$window, WC, ApiServices, SharedService) {
    $scope.$on('$ionicView.afterEnter', function () {
        SharedService.startLoading();
        var Woocommerce = WC.WC(); // woocommerce dependency
        var createorderAPI = ApiServices.getcreateOrderURL();
        var userinfo = JSON.parse( $window.localStorage['userDetails'])[0];
        var data = { customer_id: userinfo.email };
        var id =  $window.localStorage['userId'];
        var email = userinfo.billing.email;

        var getOdersNew = function(a,b,c,d) {
            var url = new URL("https://www.whomikart.com/api/respond/getOrders/"),
                params = {em:b,nonce:"pUuKr6%6Ir6jJbIM}2}d-hCJIb)O=o*VUKvdUNA fv@s_<vn?X`?]z?Ld~4TW,JX"}
            Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))
            fetch(url).then(e=>{
                if (e.ok) {
                    return e.json();
                }
                throw Error("network error");
            }).then(e=>{
                var angular=d;
                var $scope=c;
                $scope.myOrder = e.a;
                $scope.myOrders = [];

                angular.forEach($scope.myOrder, function (value, key) {

                    $scope.myOrders.push({
                        status:value.s,
                        id:value.u,
                        date_created:value.t.date.split(" ")[0]
                    })
                });
                if ($scope.myOrders == []) {
                    $scope.order = false;
                }

            }).catch(()=>{
                console.error("ERROR FETCHING DATA")
            }).finally(()=>{
                console.log("I finally run")
                a.stopLoading();
            });
        };

        getOdersNew(SharedService,JSON.parse($window.localStorage.userInfo).user_email,$scope,angular);

        if (0 && false) {
            Woocommerce.get(createorderAPI + "?customer_id=" + id, function (err, data, res) {
                $scope.myOrder = JSON.parse(res);
                $scope.myOrders = [];
                angular.forEach($scope.myOrder, function (value, key) {
                    if (value.billing.email == email) {
                        $scope.myOrders.push(value);
                    }
                });
                if ($scope.myOrders == []) {
                    $scope.order = false;
                }
                SharedService.stopLoading();
            });
        }
        $scope.openOrder = function (data) {
            $window.localStorage['showorder'] = data;

            $state.go('orders');
        }
    })



});