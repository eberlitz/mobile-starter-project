'use strict';

angular.module('myapp',[
	'ionic',
  'ngCordova'
])
.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('signin', {
      url: '/sign-in',
      templateUrl: 'signin/sign-in.html',
      controller: 'SignInController'
    })
    .state('home', {
      url: '/home',
      templateUrl: 'home/home.html',
      controller: 'HomeController'
    });

   $urlRouterProvider.otherwise('/sign-in');
});