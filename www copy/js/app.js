// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('starter', ['ionic', 'ionic-material', 'ngCordova']);

app.run(function ($ionicPlatform) {
  $ionicPlatform.ready(function () {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)

    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

app.config(function ($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
      url: '/app',
      abstract: true,
      templateUrl: 'app/menu/menu.html',
      controller: 'MenuCtrl'
    })
    .state('signin', {
      url: '/signin',
      templateUrl: 'app/signin/signin.html',
      controller: 'SigninCtrl'
    })
    .state('signup', {
      url: '/signup',
      templateUrl: 'app/signup/signup.html',
      controller: 'SignupCtrl'
    })
    .state('shipping', {
      url: '/shipping',
      templateUrl: 'app/shipping/shipping.html',
      controller: 'ShippingCtrl'
    })
    .state('paymentMethod', {
      url: '/paymentMethod',
      templateUrl: 'app/paymentMethod/paymentmethod.html',
      controller: 'PaymentMethodCtrl'
    })
    .state('app.aboutus', {
      url: '/aboutus',
      views: {
        'menuContent': {
          templateUrl: 'app/aboutus/aboutus.html',
          controller: 'AboutusCtrl'
        }
      }
    })

    .state('app.dashboard', {
      url: '/dashboard',
      views: {
        'menuContent': {
          templateUrl: 'app/dashboard/dashboard.html',
          controller: 'DashboardCtrl'
        }
      }
    })

    .state('app.mycart', {
      url: '/mycart',
      views: {
        'menuContent': {
          templateUrl: 'app/mycart/mycart.html',
          controller: 'MycartCtrl'
        }
      }
    })

    .state('app.myorders', {
      url: '/myorders',
      views: {
        'menuContent': {
          templateUrl: 'app/myorders/myorders.html',
          controller: 'MyordersCtrl'
        }
      }
    })
    .state('orders', {
      url: '/orders',


      templateUrl: 'app/order/order.html',
      controller: 'OrdersCtrl'


    })

    .state('app.myprofile', {
      url: '/myprofile',
      views: {
        'menuContent': {
          templateUrl: 'app/myprofile/myprofile.html',
          controller: 'MyProfileCtrl'
        }
      }
    })

    .state('app.support', {
      url: '/support',
      views: {
        'menuContent': {
          templateUrl: 'app/support/support.html',
          controller: 'SupportCtrl'
        }
      }
    })

    .state('app.terms', {
      url: '/terms',
      views: {
        'menuContent': {
          templateUrl: 'app/terms/terms.html',
          controller: 'TermsCtrl'
        }
      }
    })

    .state('app.productlist', {
      url: '/productlist',
      views: {
        'menuContent': {
          templateUrl: 'app/productlist/productlist.html',
          controller: 'ProductlistCtrl'
        }
      }
    })
    .state('app.productdetails', {
      url: '/productdetails',
      views: {
        'menuContent': {
          templateUrl: 'app/productdetails/productdetails.html',
          controller: 'ProductDetailsCtrl'
        }
      },
      params: {
        productDetails: null
      }
    })
    .state('app.delivery', {
      url: '/delivery',
      views: {
        'menuContent': {
          templateUrl: 'app/delivery/delivery.html',
          controller: 'DeliveryCtrl'
        }
      }
    });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/signin');
});
