app.controller('PaymentMethodCtrl', function ($scope, $stateParams, $ionicModal,$window, $state, WC, ApiServices, $timeout, $http, $ionicPopup, SharedService) {
    var Woocommerce = WC.WC(); // woocommerce dependency
    var paymentMethod = ApiServices.getPaymentMethodURL();
    $scope.userDetail = JSON.parse( $window.localStorage['userDetails'])[0];
    var customerInfoAPI = ApiServices.getCustomerDetailURL();
    var customerUpdateAPI = ApiServices.getCustomerUpdateURL();
    $scope.cartData = JSON.parse( $window.localStorage['cartdata']);
    $scope.total = 0;
    angular.forEach($scope.cartData, function (value, key) {
        $scope.total = value.totalprice + $scope.total;
    });
    $scope.totalPaise = $scope.total * 100;
    SharedService.startLoading();
    $scope.cod = false;
    Woocommerce.get(paymentMethod, function (err, data, res) {
        $scope.paymentMethods = JSON.parse(res);
        console.log($scope.paymentMethods);
        getUserInfo($scope.paymentMethods);
    });

    var getUserInfo = function (paymentMethods) {
        SharedService.startLoading();
        console.log($scope.userDetail)
        Woocommerce.get(customerInfoAPI + $scope.userDetail.email, function (err, data, res) {
            $scope.user = JSON.parse(res)[0];
            $scope.user.payment_method_title = $scope.paymentMethods[0].method_title;
            $scope.user.payment_method = $scope.paymentMethods[0].id
            $scope.user.billing.email = $scope.userDetail.email;
            console.log($scope.user)
            SharedService.stopLoading();
        });
    }
    var createorderAPI = ApiServices.getcreateOrderURL();
    $scope.user = {};
    $scope.user.shipping = {};
    $scope.checked = false;

    $scope.pay = function (user) {
        console.log($scope.user)
    }
    $scope.radio = function (user) {
        $scope.user.payment_method = user.id;
        $scope.user.payment_method_title = user.method_title;
        console.log($scope.user);
        if (user.id == "razorpay") {
            $scope.razorPayKey = user.settings.key_id.value;
            $scope.paid = true;
        }
        else {
            $scope.paid = false;
        }
        console.log($scope.razorPayKey);
    };
    $scope.check = function () {
        $scope.checked = !$scope.checked;
    }
    $scope.createOrder = function () {
        if ($scope.user.payment_method == "cod" && $scope.user.billing.postcode != "370421") {
            SharedService.showToastMsg("Cash on delivery is not available in your region");
        }
        else {
             $window.localStorage['userAddress'] = JSON.stringify($scope.user.billing);
            if ($scope.checked == true) {
                $scope.user.shipping = {};
                $scope.user.shipping.first_name = $scope.user.billing.first_name;
                $scope.user.shipping.last_name = $scope.user.billing.last_name;
                $scope.user.shipping.address_1 = $scope.user.billing.address_1;
                $scope.user.shipping.address_2 = $scope.user.billing.address_2;
                $scope.user.shipping.city = $scope.user.billing.city;
                $scope.user.shipping.state = $scope.user.billing.state;
                $scope.user.shipping.country = $scope.user.billing.country;
                $scope.user.shipping.postcode = $scope.user.billing.postcode;
                console.log($scope.user);
            }
            SharedService.startLoading();
            $scope.listing = [];
            $scope.total = 0;
            angular.forEach($scope.cartData, function (value, key) {
                console.log("Adding to cart....",value,key)
                    if (value.appSize) {
                        $scope.listing.push({
                            product_id : value.id,
                            quantity: value.quantity,
                            variation_id : value.appVaritaion
                        });
                    }
                    else {
                        $scope.listing.push({
                            product_id: value.id,
                            quantity: value.quantity
                        });
                    }
                $scope.total = value.totalprice + $scope.total;
            });
            var userinfo = JSON.parse( $window.localStorage['userInfo']);
            var orderData = {
                payment_method: $scope.user.payment_method,
                payment_method_title: $scope.user.payment_method_title,
                set_paid: $scope.paid,
                billing: $scope.user.billing,
                shipping: $scope.user.shipping,
                line_items: $scope.listing,
            }
            /*
            * change customer id to account to order and change status for Cash on Delivery
            * */
            orderData["customer_id"]=JSON.parse(localStorage.getItem("userInfo")).id;
            orderData["status"]="processing";
            console.log(`order`,"SEND",orderData,"user",userinfo)
            Woocommerce.post(customerUpdateAPI + $scope.user.id, $scope.user, function (err, data, res) {
                console.log(res);
            });
            Woocommerce.post(createorderAPI, orderData, function (err, data, res) {
                SharedService.stopLoading();
                if (data.statusCode == 201) {
                    $scope.openModal();
                }
            });
        }
    };
    $scope.openModal = function () {
        $ionicModal.fromTemplateUrl('app/paymentMethod/thankyouModal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.modal = modal;
            $scope.modal.show();
        });
        $timeout(function () {
             $window.localStorage['cartdata'] = JSON.stringify([]);
            $scope.modal.hide();
            $state.go('app.dashboard');
        }, 3000);
    }
    // `ng-click` is triggered twice on ionic. (See https://github.com/driftyco/ionic/issues/1022).
    // This is a dirty flag to hack around it
    var called = false;
    var successCallback = function (payment_id) {
        SharedService.showToastMsg("Payment Success");
        called = false;
        $scope.user.payment_method_title = $scope.user.payment_method_title+ "("+ payment_id+")";
        console.log($scope.user.payment_method_title);
        $scope.createOrder();
    };

    var cancelCallback = function (error) {
        SharedService.showToastMsg("Payment Failed");
        called = false;
    };

    $scope.payNow = function () {
        var options = {
            description: 'Payment towards order',
            image: 'http://www.whomikart.com/wp-content/uploads/2018/05/Whomikart-Logo-Black.png',
            currency: 'INR',
            key: $scope.razorPayKey,
            amount: $scope.totalPaise,
            name: 'Whomikart',
            prefill: {
                email: $scope.userDetail.email,
                contact: $scope.userDetail.billing.phone,
                name: $scope.userDetail.first_name
            },
            theme: {
                color: '#996498'
            }
        };
        if (!called) {
            RazorpayCheckout.open(options, successCallback, cancelCallback);
            called = true;
        }
    };
});
