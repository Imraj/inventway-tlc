var apptlc = angular.module("flapper",["ui.router"]);

apptlc.controller("HomeCtrl",["$scope","$state",function($scope,$state){

}]);

apptlc.config([ "$stateProvider","$urlRouterProvider",
  function($stateProvider,$urlRouterProvider){

    $stateProvider
      .state("home",{
        templateUrl:"/home.html",
        url:"/home",
        controller:"HomeCtrl"
      })

      .state("about",{
        templateUrl:"/about.html",
        url:"/about",
        controller:"HomeCtrl"
      });

    $urlRouterProvider.otherwise("home");  

}]);
