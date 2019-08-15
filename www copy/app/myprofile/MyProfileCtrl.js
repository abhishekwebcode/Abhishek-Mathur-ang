app.controller('MyProfileCtrl', function ($scope, $stateParams, WC, ApiServices,$window, SharedService, $ionicPopup) {
    var Woocommerce = WC.WC(); // woocommerce dependency
    var customerUpdateAPI = ApiServices.getCustomerUpdateURL();
    $scope.user = JSON.parse( $window.localStorage['userDetails'])[0];
    var customerInfoAPI = ApiServices.getCustomerDetailURL();
    console.log($scope.user.email)
    $scope.$on('$ionicView.afterEnter', function () {
        SharedService.startLoading();
        Woocommerce.get(customerInfoAPI + $scope.user.email, function (err, data, res) {
            $scope.userDetails = JSON.parse(res)[0];
            console.log($scope.userDetails)
            SharedService.stopLoading();
        });
      })

    $scope.updatecustomer = function () {
        console.log( customerUpdateAPI + $scope.userDetails.id)
        SharedService.startLoading();
        Woocommerce.post(customerUpdateAPI + $scope.userDetails.id, $scope.userDetails, function(err, data, res) {
            SharedService.stopLoading();
            var alertPopup = $ionicPopup.alert({
                title: 'Profile Update',
                template: 'Your profile has been successfully updated'
              });
           
              alertPopup.then(function(res) {
                console.log('Thank you for not eating my delicious ice cream cone');
              });
        });
    }
});
  

