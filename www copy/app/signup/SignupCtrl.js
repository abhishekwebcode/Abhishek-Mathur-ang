app.controller('SignupCtrl', function ($scope, $stateParams, $state, WC, ApiServices, $ionicModal, $window,$http,$ionicPopup,SharedService) {
    var Woocommerce = WC.WC(); // woocommerce dependency
    var signupAPI = ApiServices.getSignupURL();
    var catagoriesListAPI = ApiServices.getCatagoriesListURL();
    $scope.checked = false;

    $scope.doSignup = function (user) {
        SharedService.startLoading();
        var userData = user;
        userData.role= "customer";
        userData.username = user.username;
        console.log("test" + JSON.stringify(userData));
        Woocommerce.post(signupAPI, userData, function (err, data, res) {         
            if(JSON.parse(res).role=="customer"){
                console.log(res)
                 $window.localStorage['userId']= JSON.parse(res).id;
                var userdetails = [];
                userdetails.push(JSON.parse(res));
                console.log(userdetails)
                 $window.localStorage['userInfo'] = JSON.stringify(res.data);
                 $window.localStorage['userDetails'] = JSON.stringify(userdetails);
                 $window.localStorage['cartdata'] = JSON.stringify([]);
                getCatagoriesList();
                // $state.go('app.dashboard');
            }
            else{
                SharedService.stopLoading();
                var alertPopup = $ionicPopup.alert({
                    title: 'something went wrong',
                    template: JSON.parse(res).message
                  });
                  alertPopup.then(function(res) {
                    console.log('Thank you for not eating my delicious ice cream cone');
                  });
            }
        });
    }; 
    var getCatagoriesList = function () {
        Woocommerce.get(catagoriesListAPI, function (err, data, res) {
          console.log(JSON.parse(res));
          var catagoriesList = JSON.parse(res);
           $window.localStorage["catagoriesList"] = res;
          SharedService.stopLoading();
          $state.go('app.dashboard');
          if (err) {
            SharedService.stopLoading();
            console.log(err);
          }
        });
      };

      $scope.check = function(){
          $scope.checked = !$scope.checked;
          console.log($scope.checked)
      };

      $scope.openModal = function () {
        $ionicModal.fromTemplateUrl('app/signup/termsandconditions.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.modal = modal;
            $scope.modal.show();
        });
    };
});