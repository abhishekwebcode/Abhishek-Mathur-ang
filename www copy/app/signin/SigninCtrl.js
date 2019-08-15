app.controller('SigninCtrl', function ($scope, $stateParams, $state, WC, ApiServices, $http, $ionicPopup, $window, SharedService, $cordovaInAppBrowser, $timeout) {
    var Woocommerce = WC.WC(); // woocommerce dependency
    var loginAPI = ApiServices.getProductlistingURL();
    var catagoriesListAPI = ApiServices.getCatagoriesListURL();
    var signinAPI = ApiServices.getSigninURL();
    var customerInfoAPI = ApiServices.getCustomerDetailURL();
    $window.localStorage['previousState'] = '';
    /*  if( $window.localStorage['userInfo']!=null|| $window.localStorage['userInfo']!=''|| $window.localStorage['userInfo']!=undefined){
        $state.go('app.dashboard');
      }*/

    var ss=SharedService;
    var st=$state;
    window.ss=ss;
    window.st=st;

    if ($window.localStorage['userInfo']) {
        $state.go('app.dashboard');
    }

    var showErrorGeneric=function() {
        ss.showToastMsg("There was an error logging in");
    };

    $scope.doSignin = function (user) {
        console.log(user)
        SharedService.startLoading();
        $http.post(signinAPI, user).then(function (resp) {
            console.log(resp.data);
            var userDetail = resp.data;
            if (resp.status === 200) {
                $window.localStorage['userInfo'] = JSON.stringify(resp.data);
                $window.localStorage['cartdata'] = JSON.stringify([]);
                //SharedService.showToastMsg("Logging in");
                getUserInfo(userDetail);
            }
        }, function (err) {
            SharedService.stopLoading();
            var alertPopup = $ionicPopup.alert({
                title: 'Error',
                template: 'Username / password is incorrect'
            });
            alertPopup.then(function (res) {
                console.log(err);
            });
        });
    };

    var getUserInfo = function (user) {
        Woocommerce.get(customerInfoAPI + user.user_email, function (err, data, res) {
            if (err) {showErrorGeneric();}
            try {
                window.localStorage['userId'] = JSON.parse(res)[0].id;
                window.localStorage['userDetails'] = res;
            } catch (e) {
                showErrorGeneric();
            }
            getCatagoriesList();
        });
    }

    var getCatagoriesList = function () {
        Woocommerce.get(catagoriesListAPI, function (err, data, res) {
            var catagoriesList = JSON.parse(res);
            window.localStorage["catagoriesList"] = res;
            ss.stopLoading();
            st.go('app.dashboard');
            if (err) {
                localStorage.clear();
                ss.showToastMsg("Error Logging in");
                ss.stopLoading();
                console.log(err);
            }
        });
    }

    $scope.forgotPassword = function () {
        SharedService.startLoading();
        SharedService.showToastMsg("Redirecting...");
        $timeout(function () {
            SharedService.stopLoading();
            openBrowser();
        }, 3000);

    };
    var openBrowser = function () {
        var options = {
            location: 'no',
            clearcache: 'no',
            toolbar: 'no'
        };
        $cordovaInAppBrowser.open('http://www.whomikart.com/my-account/lost-password/', '_self', options)
            .then(function (event) {
                console.log(event)
                // success
            })
            .catch(function (event) {
                // error
                console.log(event)
            });
        //$cordovaInAppBrowser.close();

    }

    $scope.signup = function () {
        $state.go('signup');
    };

    $scope.logInFacebook = function () {
        var scope = arguments[0];
        SharedService.startLoading();
        // connect to backend and get JWT token and then proceed
        CordovaFacebook.login({
            permissions: ["email"],
            onSuccess: function (result) {
                if (result.declined.length > 0) {
                    //alert("The User declined something!");
                    SharedService.showToastMsg("Facebook Login was cancelled")
                }

                fetch('https://www.whomikart.com/wp-json/wp/v2/m_facebook/login', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        token: result.accessToken
                    })
                })
                    .then(e => e.json())
                    .then(e => {
                    var userDetail = e;
                    window.localStorage['userInfo'] = JSON.stringify(e);
                    window.localStorage['cartdata'] = JSON.stringify([]);
                    //SharedService.showToastMsg("Logging in");
                        if (!e.token) {
                            throw new Error("");
                        }
                    getUserInfo(userDetail);
                }).catch(() => {
                    angular.element(document.body).injector().get("SharedService").stopLoading()
                    angular.element(document.body).injector().get("SharedService").showToastMsg("Error logging in through facebook, please allow email permission and ensure internet connection")
                });
                /* ... */
            },
            onFailure: function (result) {
                console.log(result);
                angular.element(document.body).injector().get("SharedService").stopLoading()
                if (result.cancelled) {
                    //alert("The user doesn't like my app");
                    angular.element(document.body).injector().get("SharedService").showToastMsg("Facebook Login was cancelled");
                } else if (result.error) {
                    angular.element(document.body).injector().get("SharedService").showToastMsg("Error occurred during Facebook Login, please check your internet connection");
                    //alert("There was an error:" + result.errorLocalized);
                }
            }
        });
    }

});
