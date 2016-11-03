var apptlc = angular.module("flapper",["ui.router"]);

apptlc.controller("HomeCtrl",["$scope","$state",function($scope,$state){

}]);

apptlc.config([ "$stateProvider","$urlRouterProvider",
  function($stateProvider,$urlRouterProvider){

    $stateProvider
      .state("index",{
        templateUrl:"templates/home.html",
        url:"/",
        controller:"HomeCtrl"
      })

      .state("new_driver",{
        templateUrl:"templates/driver/new_driver.html",
        url:"/new_driver",
        controller:"HomeCtrl"
      })

      .state("already_driver",{
        templateUrl:"templates/driver/already_driver.html",
        url:"/already_driver",
        controller:"HomeCtrl"
      })

      .state("login",{
        templateUrl:"templates/user/login.html",
        url:"/login",
        controller:"AuthCtrl"
      })

      .state("register",{
        templateUrl:"templates/user/register.html",
        url:"/register",
        controller:"AuthCtrl"
      })

      .state("blog",{
        templateUrl:"/blog.html",
        url:"/blog",
        controller:"HomeCtrl"
      })

      .state("about",{
        templateUrl:"/about.html",
        url:"/about",
        controller:"HomeCtrl"
      });

    $urlRouterProvider.otherwise("/");

}]);
