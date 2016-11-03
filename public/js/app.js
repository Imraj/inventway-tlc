var app = angular.module("apptlc",["ui.router"]);

app.controller("HomeCtrl",["$scope","$state",function($scope,$state){

}]);

app.config({"$stateProvider","$urlRouterProvider",function($stateProvider,$urlRouterProvider){


  $stateProvider
    .state("home",{
      url:"/home",
      templateUrl:"/home.html",
      controller:"HomeCtrl"
    })

    .state("about",{
      url:"/about",
      templateUrl:"/about.html",
      controller:"HomeCtrl"
    });

  $urlRouterProvider.otherwise("home");

}})
