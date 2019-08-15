app.controller('MenuCtrl', function ($scope, $state, $stateParams, SharedService, $ionicPopup, $window, $ionicPlatform) {
  $scope.userInformation = [];
  $scope.categoriesList = [];
  if ( $window.localStorage['userDetails']) {
    $scope.userInformation = JSON.parse( $window.localStorage['userDetails'])[0];
    console.log($scope.userInformation)
  }
  if ( $window.localStorage["catagoriesList"]) {
    $scope.categoriesList = JSON.parse( $window.localStorage["catagoriesList"]);
    console.log($scope.catagoriesList)
  }

  $scope.toggleGroup = function (group) {
    if ($scope.isGroupShown(group)) {
      $scope.shownGroup = null;
    } else {
      $scope.shownGroup = group;
    }
  };
  $scope.isGroupShown = function (group) {
    return $scope.shownGroup === group;
  };
  
  $scope.toggleMen = function (men,catagory) {
    if(catagory.display=="default"){
      $scope.openproductlist(catagory);
    }
    $scope.subCategory = [];
    angular.forEach($scope.categoriesList, function (value, key) {
      if(value.parent==catagory.id){
        $scope.subCategory.push(value);
      }
    });
    console.log($scope.subCategory);
    if ($scope.isMenShown(men)) {
      $scope.shownMen = null;
    } else {
      $scope.shownMen = men;
    }
  };
  $scope.isMenShown = function (men) {
    return $scope.shownMen === men;
  };

  // $scope.toggleWomen = function (women) {
  //   if ($scope.isWomenShown(women)) {
  //     $scope.shownWomen = null;
  //   } else {
  //     $scope.shownWomen = women;
  //   }
  // };
  // $scope.isWomenShown = function (women) {
  //   return $scope.shownWomen === women;
  // };

  // $scope.toggleKids = function (kids) {
  //   if ($scope.isKidsShown(kids)) {
  //     $scope.shownKids = null;
  //   } else {
  //     $scope.shownKids = kids;
  //   }
  // };
  // $scope.isKidsShown = function (kids) {
  //   return $scope.shownKids === kids;
  // };

  $scope.openproductlist = function (catagory) {
    console.log(catagory);
     $window.localStorage['catagory'] = JSON.stringify(catagory);
    $state.go('app.productlist', {
      category: catagory
    }, {
        reload: true
      });
  };

  $scope.workInProgress = function () {
    SharedService.showToastMsg("Work in progress");
  };
  $scope.openProfile = function () {
    $state.go('app.myprofile')
  }

  $scope.doLogout = function () {
    var confirmPopup = $ionicPopup.confirm({
      title: 'Confirmation Alert',
      template: 'Are you sure you want to logout ?'
    });
    confirmPopup.then(function (res) {
      if (res) {
        $window.localStorage.clear();
        ionic.Platform.exitApp();
      } else {
        console.log('You are not sure');
      }
    });
  }
});
