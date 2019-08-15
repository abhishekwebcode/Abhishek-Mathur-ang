'use strict';

/* see http://www.jshint.com/docs/ if you want to know what this is: */
/* global Pages */
// The NavigationLinks controller.

// Where do all these partials live?
var TemplatePrefix = 'views/';

// Create Angular application module angularjsSimpleWebsiteApp.
// Declare ngRoute as a dependency. http://docs.angularjs.org/api/ngRoute
// Then configure the $routeProvider by defining the routes.

var app = angular.module('angularjsSimpleWebsiteApp', ['ngRoute'])
    .controller('LogoutCtrl', ['$scope', '$location', function ($scope, $location) {
        $.post('/signout').promise().then(e => {
            window.location.reload();
        }).catch(e => {
            console.error(e);
        });
    }])
    .controller('ManageUsers', ['$scope', '$location', function ($scope, $location) {
        $scope.users=[];
        $.post('/api/users').promise().then(e=>{

            $scope.s3Files=e.files;
        }).fail(e=>{
            $scope.s3Files=["Error getting your files"]
        }).always(u=>{
            $scope.loadfing=false;
            $scope.$apply();
        })

    }])
    .controller('MigrateToS3', ['$scope', '$location', function ($scope, $location) {
        $scope.started = false;
        $scope.loading = false;
        $scope.s3Files=[];
        $scope.loadfingFiles=true;
        $scope.download=function(item) {
            document.location=`/getFileS3/${item}`;
        };
        $scope.refreshFiles=function() {
            $.post('/api/s3Files').promise().then(e=>{
                console.dir(e);
                $scope.s3Files=e.files;
            }).fail(e=>{
                $scope.s3Files=["Error getting your files"]
            }).always(u=>{
                $scope.loadfingFiles=false;
                $scope.$apply();
            })
        }
        $scope.refreshFiles();
        $scope.startS3 = function (par) {
            if ($scope.started) return;
            $scope.started = true;
            $scope.loading = true;
            //$scope.disabled="disabled";
            $scope.$apply();
            console.log(`START`);
            jQuery.post('/migrate').promise().then(e => {
                console.dir(e);
                if (e.success) {
                    alert(`Upload to S3 successful`);
                } else {
                    alert(`Conversion Failed`)
                }
            }).fail(e => {
                console.log(e);
                alert(`Conversion Request Failed`)
            }).always(() => {
                $scope.started = false;
                $scope.loading = false;
                $scope.$apply();
            })
        }
    }])
    .controller('NavigationLinks', ['$scope', '$location', function ($scope, $location) {
        // $routeChangeSuccess is an event that is fired,
        // when the app has switched from one route to another.
        // http://docs.angularjs.org/api/ngRoute.$route
        // here we subscribe to that event.
        $(`#company`).text('Welcome, ' + userMeta.Organisation.formalName);
        //console.log($scope.company=userMeta.Organisation.formalName);
        $scope.$on('$routeChangeSuccess',
            function () {
                $scope.locationPath = $location.path();
                $scope.company = userMeta.Organisation.formalName;
                console.log('locationPath: ' + $location.path());
            }
        );
    }])
    .controller('MainCtrl', ['$scope', '$location', function ($scope, $location) {
        if (!userMeta.Organisation.selectionDone) {
            $location.path('/select')
        }
    }])
    .run(['$route', function ($route) {
        $route.reload();
    }])
    .controller('SelectCtrl', ['$scope', '$location', function ($scope, $location) {
        $scope.loading = true;
        $scope.fieldsSobjects = [];
        $scope.selection = [];
        $scope.uploadFields = function () {
            if ($scope.selection.length == 0) {
                alert("You haven't selected any objects")
                return;
            }
            $.post('/api/putfields', {
                fieldsIndexes: $scope.selection
            }).promise().then(e => {
                if (e.success) {
                    userMeta.Organisation.selectionDone = true;
                    alert("Data import started");
                    $location.path('/')
                    $('.header ul.nav').append(
                        '<li ' +
                        'ng-class="{active: (locationPath==\'' + '/migrateToS3' + '\')}">' +
                        '<a href="#' + '/migrateToS3' + '">' +
                        'Migrate To S3' +
                        '</a>' +
                        '</li>');
                    if (!$scope.$$phase) $scope.$apply()
                } else {
                    //alert("Data import failed")
                    alert(e.message);
                }
                console.log(e);
            }).fail(e => {
                console.error(e);
                alert("Data import started in background")
            })
        };
        $scope.toggleSelection = function toggleSelection(fruitName) {
            var idx = $scope.selection.indexOf(fruitName);
            // Is currently selected
            if (idx > -1) {
                $scope.selection.splice(idx, 1);
            }
            // Is newly selected
            else {
                $scope.selection.push(fruitName);
            }
        };
        $.post('/api/getFields', {}).promise().then(
            e => {
                if (e.success) {
                    $scope.loading = false;
                    $scope.fieldsSobjects = e.result;
                    $scope.$apply();
                }
            }
        )
    }])
    .config(function ($routeProvider) {
        // register the routes and the templates
        // http://docs.angularjs.org/api/ngRoute.$routeProvider
        $routeProvider
            .when('/', {templateUrl: TemplatePrefix + 'main.html', controller: 'MainCtrl'})
            .when('/select', {templateUrl: TemplatePrefix + 'select.html', controller: "SelectCtrl"})
            .when('/logout', {templateUrl: TemplatePrefix + 'logout.html', controller: "LogoutCtrl"})
            .when('/migrateToS3', {templateUrl: TemplatePrefix + 's3.html', controller: "MigrateToS3"})
            .when('/users', {templateUrl: TemplatePrefix + 'users.html', controller: "ManageUsers"})

        for (var path in Pages) {
            var template = Pages[path][0];

        }
        // the default route
        $routeProvider
            .otherwise({
                redirectTo: '/'
            });
    })

;

/* jshint unused:false */

