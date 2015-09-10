angular.module('app').config([
    '$stateProvider',
    '$urlRouterProvider',
    '$locationProvider',
    function($stateProvider, $urlRouterProvider, $locationProvider) {


        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: '/views/home.html',
                controller: 'HomeCtrl'
            })
            .state('login', {
                url: '/login',
                templateUrl: '/views/login.html',
                controller: 'AuthCtrl',
                onEnter: ['$state', 'auth', function($state, auth) {
                    if (auth.isLoggedIn()) {
                        $state.go('home');
                    }
                }]
            })
            .state('register', {
                url: '/register',
                templateUrl: '/views/register.html',
                controller: 'AuthCtrl',
                onEnter: ['$state', 'auth', function($state, auth) {
                    if (auth.isLoggedIn()) {
                        $state.go('home');
                    }
                }]
            });


        $urlRouterProvider.otherwise('/');

        $locationProvider.html5Mode(true);
    }
]);