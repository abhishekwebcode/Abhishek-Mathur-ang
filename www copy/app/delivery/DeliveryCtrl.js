app.controller('DeliveryCtrl', function ($scope, $stateParams, $cordovaToast, $state, WC, ApiServices) {
  var Woocommerce = WC.WC(); // woocommerce dependency
  $scope.buynow = function () {
    $cordovaToast.showLongBottom('Booking has been confirmed').then(function (success) {
      $state.go('app.dashboard');
    }, function (error) {
      // error
    });
  }

});
