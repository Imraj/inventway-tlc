var apptlc = angular.module("flapper",["ui.router","ngMessages","angular-filepicker"]);

apptlc.run(["$rootScope","$window","AuthFactory",function($rootScope,$window,AuthFactory){

  $rootScope._currentUser = AuthFactory.currentUser();
  $rootScope._currentUserDetails = AuthFactory.currentUserDetails();

}]);

apptlc.controller("HomeCtrl",["$scope","$state","$rootScope","AuthFactory","filepickerService",
                          function($scope,$state,$rootScope,AuthFactory,filepickerService){

  $scope.categoriesA = ["Garage Dispatcher","Medallion Owner","Hotel Doorman","Garage Owner","Building Doorman",
                        "TLC Commisioner","Medallion Brookers or Corp.","DMV & TLC Lawyer","Radio Dispatcher",
                      "DMV Lawyer","City Dispatcher","TLC Lawyer"];

  $scope.categoriesB1 = ["Already Experienced Driver","New Driver Currently got licensed by TLC",
                        "New Student seeking to get  TLC License","Driver-Owned Vehicle(DOV)",
                         "Individual-Owned Operator(Own Vehicle & Medallion)"];

  $scope.categoriesB2 = ["Yellow Cab","Gypsy & Radio","App Uber & Others","Green Cab","SUV",
                         "Dial7 & Others","Black Car","Limousine","Commuter Van"];

  $scope.categoriesC = ["Insurance company","Car Dealer","Meter Shop","Car Wash","Verifone","Lube & Oil Change","CMT.",
                        "Collision and Body Shop","Food and Catering Business","Accounting Business","Other Business"
                       ]

  $scope.user = {
    email: "",
    password : "",
    actor :"",
    driver_type :"",
    driver_community :"",
    business_type :"",
    image:""
  };

  if($rootScope._email != "")$scope.user.email = $rootScope._email;
  if($rootScope._password != "")$scope.user.password = $rootScope._password;

  console.log( $scope.user.email + " | " + $scope.user.password);


  $scope.uploadFiles = function(file,invfile){

  }

  $scope.saveUser = function(){
    $rootScope._email = $scope.user.email;
    $rootScope._password = $scope.user.password;
    $state.go("complete_registeration");
  }

  $scope.upload = function(){
          filepickerService.pick({
              mimetype: 'image/*',
              language: 'en',
              services: ['COMPUTER','DROPBOX','GOOGLE_DRIVE','IMAGE_SEARCH', 'FACEBOOK', 'INSTAGRAM'],
              openTo: 'IMAGE_SEARCH'
            },function(Blob){
                  console.log(JSON.stringify(Blob));
                  $scope.user.image = Blob.url;
              });
  }

  $scope.registerUser = function(){
      console.log("register button clicked");
      console.log(JSON.stringify($scope.user,null,4));
      AuthFactory.registerUser($scope.user)
      .error(function(err){
        $scope.err = err;
        console.log("reg err");
      })
      .then(function(){
        $rootScope._isAuthenticated = AuthFactory.isLoggedIn();
        $rootScope._currentUser = AuthFactory.currentUser();
        $rootScope._currentUserDetails = AuthFactory.currentUserDetails();
        console.log("going to base | isauth : " + $rootScope.isAuthenticated);
        $state.go("base.overview");
      });
  }

}]);

apptlc.controller("LoginCtrl",["$scope","$state","$rootScope","AuthFactory",function($scope,$state,$rootScope,AuthFactory){

    $scope.user = {
      email:"",
      password:""
    }

    $scope.loginUser = function(){
      AuthFactory.loginUser($scope.user)
            .error(function(err){
                console.log("login err ;" + JSON.stringify(err,null,4));
            }).then(function(){
                console.log("login going to base.overive");
                $state.go("base.overview");
            });
    }

}]);

apptlc.controller("BaseCtrl",["$scope","$state","$rootScope",function(){



}]);

apptlc.factory("AuthFactory",function($http,$window){

          var auth = {};

          auth.registerUser = function(userData){
            return $http.post("/register",{"user":userData}).success(function(data){
                auth.saveToken(data.token);
            });
          };

          auth.loginUser = function(user){
            return $http.post("/login",{"user":user}).success(function(data){
                auth.saveToken(data.token);
            });
          };

          auth.saveToken = function(token){
            $window.localStorage['apptlc-token'] = token;
          };

          auth.getToken = function(){
            return $window.localStorage['apptlc-token'];
          };

          auth.isLoggedIn = function(){
            var token = auth.getToken();
            console.log("isLoggedIn token : " + token);
            if(token){
              var payload = JSON.parse($window.atob(token.split('.')[1]));
              console.log("payload  ee : " + JSON.stringify(payload,null,4) );
              return payload.exp > Date.now()/1000;
            }
            else {
              return false;
            }
          };

          auth.currentUser = function(){
              if(auth.isLoggedIn()){
                var token = auth.getToken();
                var payload = JSON.parse($window.atob(token.split('.')[1]));
                return payload.email;
              }
         };

         auth.currentUserDetails = function(){
             if(auth.isLoggedIn()){
               var token = auth.getToken();
               var payload = JSON.parse($window.atob(token.split('.')[1]));
               return payload;
             }
        };

         return auth;

});

apptlc.config(function(filepickerProvider){
    filepickerProvider.setKey('AgJlhxtixSnK4e0Hdw3kdz');
});

apptlc.config([ "$stateProvider","$urlRouterProvider",
  function($stateProvider,$urlRouterProvider){

    $stateProvider
      .state("index",{
        templateUrl:"templates/home.html",
        url:"/",
        controller:"HomeCtrl"
      })

      .state("base",{
        templateUrl:"templates/base.html",
        url:"/base",
        abstract:true,
        controller:"BaseCtrl"
      })

      .state("base.overview",{
        templateUrl:"templates/overview.html",
        url:"/overview",
        controller:"BaseCtrl"
      })

      .state("base.inbox",{
        templateUrl:"templates/inbox.html",
        url:"/inbox",
        controller:"BaseCtrl"
      })

      .state("base.ads",{
        templateUrl:"templates/ads.html",
        url:"/ads",
        controller:"BaseCtrl"
      })

      .state("base.qualifications",{
        templateUrl:"templates/qualifications.html",
        url:"/qualifications",
        controller:"BaseCtrl"
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
        controller:"LoginCtrl"
      })

      .state("register",{
        templateUrl:"templates/user/register.html",
        url:"/register",
        controller:"AuthCtrl"
      })

      .state("complete_registeration",{
         templateUrl:"templates/user/complete_registeration.html",
         url:"/complete_registeration",
         controller:"HomeCtrl"
      })

      .state("blog",{
        templateUrl:"templates/blog/blog.html",
        url:"/blog",
        controller:"HomeCtrl"
      })

      .state("about",{
        templateUrl:"templates/about.html",
        url:"/about",
        controller:"HomeCtrl"
      })

      .state("investor",{
        templateUrl:"templates/investor.html",
        url:"/investor",
        controller:"HomeCtrl"
      })

      .state("contact",{
        templateUrl:"templates/contact.html",
        url:"/contact",
        controller:"HomeCtrl"
      });

    $urlRouterProvider.otherwise("/");

}]);
