var apptlc = angular.module("flapper",["ui.router"]);

apptlc.controller("HomeCtrl",["$scope","$state",function($scope,$state){

}]);

apptlc.config([ "$stateProvider","$urlRouterProvider",
  function($stateProvider,$urlRouterProvider){

    $stateProvider
      .state("home",{
        templateUrl:"templates/home.html",
        url:"/home",
        controller:"HomeCtrl"
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

    $urlRouterProvider.otherwise("home");

}]);
