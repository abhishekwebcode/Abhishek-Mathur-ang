app.service( 'SharedService', function($window, $cordovaToast, $ionicLoading) {

    this.showToastMsg=function(msg){
      $cordovaToast.showLongBottom(msg).then(function(success) {
        // success
      }, function (error) {
        // error
    });
    }

  this.startLoading = function() {
    $ionicLoading.show({
      template: ' <ion-spinner icon="android" class="spinner-dark"></ion-spinner>'
    });
  };

  this.stopLoading = function() {
    $ionicLoading.hide();
  };

})
