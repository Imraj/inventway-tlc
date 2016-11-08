var apptlc = angular.module("flapper",["ui.router","ngMessages","angular-filepicker","flash"]);

apptlc.run(["$rootScope","$window","AuthFactory",function($rootScope,$window,AuthFactory){

  $rootScope._isAuthenticated = AuthFactory.isLoggedIn();
  $rootScope._currentUser = AuthFactory.currentUser();
  $rootScope._currentUserDetails = AuthFactory.currentUserDetails();

  if($rootScope._currentUserDetails && $rootScope._currentUserDetails.driver_type && $rootScope._currentUserDetails.driver_type.indexOf("Driver") !== -1 ){
    $rootScope._currentAcctType = "driver";
  }

  $rootScope.rootLogOut = function(){
    AuthFactory.logOut();
    $state.go("index");
  }

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
              openTo: 'COMPUTER'
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
        if($rootScope._currentUserDetails && $rootScope._currentUserDetails.driver_type && $rootScope._currentUserDetails.driver_type.indexOf("Driver") !== -1 ){
          $rootScope._currentAcctType = "driver";
        }
        console.log("going to base | isauth : " + $rootScope._isAuthenticated);
        $state.go("base.overview");
      });
  }

}]);

apptlc.controller("LoginCtrl",["$scope","$state","$rootScope","AuthFactory",function($scope,$state,$rootScope,AuthFactory){

    $scope.email = "";
    $scope.password = "";

    $scope.loginUser = function(){
      console.log(JSON.stringify($scope.loginData,null,4));
      AuthFactory.loginUser($scope.email,$scope.password)
            .error(function(err){
                console.log("err login msg  : " +  $scope.email + " | " + $scope.password );
            }).then(function(){
                console.log("login going to base.overive");
                $rootScope._isAuthenticated = AuthFactory.isLoggedIn();
                $rootScope._currentUser = AuthFactory.currentUser();
                $rootScope._currentUserDetails = AuthFactory.currentUserDetails();
                if($rootScope._currentUserDetails && $rootScope._currentUserDetails.driver_type && $rootScope._currentUserDetails.driver_type.indexOf("Driver") !== -1 ){
                  $rootScope._currentAcctType = "driver";
                }
                $state.go("base.overview");
            });
    }

}]);

apptlc.controller("BaseCtrl",["$scope","$state","$rootScope",function($scope,$state,$rootScope){



}]);

apptlc.controller("UnionCtrl",["$scope","$state","$rootScope","UnionFactory",function($scope,$state,$rootScope,UnionFactory){

  $scope.event = {};

  $scope.submitEvent = function(){
    UnionFactory.addEvent($scope.event)
                .success(function(data,status){

                })
                .error(function(err,code){

                });
  }

}]);


apptlc.controller("BaseInboxCtrl",["$scope","$state","$rootScope","InboxFactory",function($scope,$state,$rootScope,InboxFactory){

    InboxFactory.getMessages()
        .success(function(data,status){
            console.log(data + " | " + status);
            $scope.messages = data.messages;
        })
        .error(function(err,code){
            console.log(err + " | " + code);
        });

}]);

apptlc.controller("BaseInboxMsgCtrl",["$scope","$state","$rootScope","$stateParams","InboxFactory",
                                                          function($scope,$state,$rootScope,$stateParams,InboxFactory){

  var msgId = $stateParams.id;
  InboxFactory.getMessage(msgId)
            .success(function(data,status){
                console.log(data + " | " + status);
                $scope.message = data.message;
            })
            .error(function(err,code){
                console.log(err + " | " + code);
            });


  $scope.replyAdMessage = function(msgParentId)
  {

     AdFactory.replyMessage($scope.message,msgParentId)
                 .success(function(data,status){
                     console.log(data + " | " + status);
                 })
                 .error(function(err,code){
                     console.log(err + " | " + code);
                 });
  }

}]);

apptlc.controller("BaseHVideoCtrl",["$scope","$state","$rootScope",function($scope,$state,$rootScope){

  $scope.uploadHVideo = function(){
    filepickerService.pick({
        mimetype: 'image/*',
        language: 'en',
        services: ['COMPUTER','DROPBOX','GOOGLE_DRIVE','IMAGE_SEARCH', 'FACEBOOK', 'INSTAGRAM'],
        openTo: 'COMPUTER'
      },function(Blob){
            console.log(JSON.stringify(Blob));
            $scope.hvideo = Blob.url;
    });
  }

}]);

apptlc.controller("BaseGroupCtrl",["$scope","$state","$rootScope",function($scope,$state,$rootScope){

  $scope.group = {application:""}

  $scope.sendGroupApplication = function(){

  }

}]);

apptlc.controller("BasePaymentCtrl",["$scope","$state","$rootScope",function($scope,$state,$rootScope){

  $scope.card = {
    name:"",
    number:"",
    exp_month:"",
    exp_year:"",
    cvv:""
  }

  $scope.updateCard = function(){

  }

}]);

apptlc.controller("BaseElectionCtrl",["$scope","$state","$rootScope",function($scope,$state,$rootScope){

  $scope.applyForElection = function(){

  }

  $scope.sendYourVote = function(){

  }


}]);


apptlc.controller("BaseTicketCtrl",["$scope","$state","$rootScope",function($scope,$state,$rootScope){

  $scope.uploadTicketImage = function(){
    filepickerService.pick({
        mimetype: 'image/*',
        language: 'en',
        services: ['COMPUTER','DROPBOX','GOOGLE_DRIVE','IMAGE_SEARCH', 'FACEBOOK', 'INSTAGRAM'],
        openTo: 'COMPUTER'
      },function(Blob){
            console.log(JSON.stringify(Blob));

    });
  }

  $scope.uploadImageOrVideo = function(){
    filepickerService.pick({
        mimetype: 'image/*',
        language: 'en',
        services: ['COMPUTER','DROPBOX','GOOGLE_DRIVE','IMAGE_SEARCH', 'FACEBOOK', 'INSTAGRAM'],
        openTo: 'COMPUTER'
      },function(Blob){
            console.log(JSON.stringify(Blob));

    });
  }

  $scope.submitTicket = function(){
    filepickerService.pick({
        mimetype: 'image/*',
        language: 'en',
        services: ['COMPUTER','DROPBOX','GOOGLE_DRIVE','IMAGE_SEARCH', 'FACEBOOK', 'INSTAGRAM'],
        openTo: 'COMPUTER'
      },function(Blob){
            console.log(JSON.stringify(Blob));

    });
  }

}]);

apptlc.controller("BaseCODCtrl",["$scope","$state","$rootScope",function($scope,$state,$rootScope){

  $scope.CODExperience = "";

  $scope.saveAndExitCOD = function(){

  }

  $scope.activateCOD = function(){

  }

}]);

apptlc.controller("BaseAcctCtrl",["$scope","$state","$rootScope",function($scope,$state,$rootScope){

  $scope.uploadImage = function(){

    filepickerService.pick({
        mimetype: 'image/*',
        language: 'en',
        services: ['COMPUTER','DROPBOX','GOOGLE_DRIVE','IMAGE_SEARCH', 'FACEBOOK', 'INSTAGRAM'],
        openTo: 'COMPUTER'
      },function(Blob){
            console.log(JSON.stringify(Blob));

    });
  }

}]);

apptlc.controller("BaseBlogCtrl",["$scope","$state","$rootScope","BlogFactory","filepickerService","flash",
                function($scope,$state,$rootScope,BlogFactory,filepickerService,flash){

  $scope.blog={title:"",text:"",image:""}

  $scope.saveAndExitBlog = function()
  {
    console.log(JSON.stringify($scope.blog,null,4));
    BlogFactory.saveAndExitBlog($scope.blog)
             .success(function(data,status){
                console.log(JSON.stringify(data,null,4));
                console.log("data.success : " + data.success);

                if(data.success)
                {
                  flash('Article successfully shared!');
                }
             })
             .error(function(err,code)
             {
               console.log(err + " | " + code);
               flash('An error occured! Please try again');
             });
  }

  $scope.uploadBlogImage = function(){
    filepickerService.pick({
        mimetype: 'image/*',
        language: 'en',
        services: ['COMPUTER','DROPBOX','GOOGLE_DRIVE','IMAGE_SEARCH', 'FACEBOOK', 'INSTAGRAM'],
        openTo: 'COMPUTER'
      },function(Blob){
            console.log(JSON.stringify(Blob));
            $scope.blog.image = Blob.url;
        });
  }

  $scope.publishBlog = function(){
    console.log(JSON.stringify($scope.blog,null,4));
    BlogFactory.payAndSubmitBlog($scope.blog)
             .success(function(data,status){
               console.log( JSON.stringify(data,null,4) );
               if(data.success == true)
               {

               }
             })
             .error(function(err,code){
                console.log(err + " | " + code);
             });
  }


}]);

apptlc.controller("BaseRankCtrl",["$scope","$state","$rootScope",function($scope,$state,$rootScope){

  $scope.ranks = ["In cab rank","Anonymous/Nickname badge","Plate ranks(front and back)","Front Rank Plate Holder",
                  "Back Rank Plate Holder","Incab holder & Limiter","All of the above"
                  ];

    $scope.rank = {type:""}

    $scope.payAndOrderRank = function(){

    }

}]);

apptlc.controller("BaseQuaCtrl",["$scope","$state","$rootScope",function($scope,$state,$rootScope){

  $scope.vehicles = ["Yellow Cab","Gypsy & Radio","App Uber & Others","Green Cab","SUV",
                           "Dial7 & Others","Black Car","Limousine","Commuter Van"];

  $scope.qualifs =  ["Already Experienced Driver","New Driver Currently got licensed by TLC",
                        "New Student seeking to get  TLC License","Driver-Owned Vehicle(DOV)",
                         "Individual-Owned Operator(Own Vehicle & Medallion)"];


  $scope.updateQualification = function(){

  }

}]);

apptlc.controller("BaseViewAllAdsCtrl",["$scope","$state","$rootScope","AdFactory",function($scope,$state,$rootScope,AdFactory){

  AdFactory.getAllAds()
           .success(function(data,status){
              console.log("data : " + JSON.stringify(data,null,4) + " | " + status);
              if(data.success){
                $scope.all_ads = data.ads;
              }
           })
           .error(function(err,code){
              console.log("err : " + err + " | " + code);
           });

}]);

apptlc.controller("BaseViewAdsCtrl",["$scope","$state","$rootScope","AdFactory","$stateParams",
                                          function($scope,$state,$rootScope,AdFactory,$stateParams){

  var adsId = $stateParams.aId;

  $scope.showContactForm = false;
  $scope.showContactFormClick = function(){
    $scope.showContactForm = !$scope.showContactForm;
  }

  AdFactory.getAds(adsId)
           .success(function(data,status){
              if(data.success){
                $scope.ad = data.ad;
              }
           })
           .error(function(err,code){
              console.log("err");
           });

   $scope.message = {subject:"",content:""};
   $scope.sendAdMessage = function(user)
   {

     AdFactory.sendMessage($scope.message,user)
              .success(function(data,status){
                  console.log(data + " | " + status);
              })
              .error(function(err,code){
                  console.log(err + " | " + code);
              });
   };



}]);

apptlc.controller("BaseViewAllBlogsCtrl",["$scope","$state","$rootScope","BlogFactory",function($scope,$state,$rootScope,BlogFactory){

  BlogFactory.getAllBlogs()
           .success(function(data,status){
              if(data.success){
                $scope.blogs = data.blogs;
              }
           })
           .error(function(err,code){
              console.log("err");
           });

}]);

apptlc.controller("BaseViewBlogCtrl",["$scope","$state","$rootScope","BlogFactory","$stateParams",
                      function($scope,$state,$rootScope,BlogFactory,$stateParams){

  var blog_id = $stateParams.id;

  BlogFactory.getBlog(blog_id)
           .success(function(data,status){
              if(data.success){
                $scope.blog = data.blog;
              }
           })
           .error(function(err,code){
              console.log("err");
           });

}]);


apptlc.controller("BaseAdsCtrl",["$scope","$state","$rootScope","filepickerService","AdFactory",
            function($scope,$state,$rootScope,filepickerService,AdFactory){

    $scope.ads = {
        type:"",
        image:"",
        description:"",
        car_model:"",
        car_year:""
    };

    $scope.card = {
        name:"",
        number:"",
        cvv:"",
        exp_month:"",
        exp_year:"",
    };

  $scope.payWithCreditCard = false;
  $scope.payWithCreditCardClick = function(){
      $scope.payWithCreditCard = !$scope.payWithCreditCard;
  }

  $scope.payWithPaypal =function(){

  }

  $scope.driver_ads_only = ["Need a cab","You have a cab","Need a night-shift driver","You are a night-shift driver",
                            "Need a day-shift driver","You are a day-shift driver"];

  $scope.housing_ads_only = ["Need a roommate culturally matched","You have a room","Need cash apartment",
                            "You have an apartment","Need five-months apt. for visitors",
                            "Rent your apartment for few months"];

  $scope.driver_biz_ads = ["Need to sharehold a business","You have a business, Need a partner",
                 "Cabs,Black,Green,SUVs and Limos","Delis and Restaurant","Food cart and street vending",
                  "Other Businesses"];

  $scope.car_images = [
                       {img:"images/cars/chevrolet_impala.jpg",val:"Chevrolet Impala"},
                       {img:"images/cars/ford_cmax.jpg",val:"Ford CMax"},
                       {img:"images/cars/ford_escape.jpg",val:"Ford Escape"},
                       {img:"images/cars/ford_grand_victoria.jpg",val:"Ford Grand Victoria"},
                       {img:"images/cars/ford_taraus.jpg",val:"Ford Taraus"},
                       {img:"images/cars/ford_transit.png",val:"Ford Transit"},
                       {img:"images/cars/nissan_maxima.jpg",val:"Nissan Maxima"},
                       {img:"images/cars/nissan_nv200.jpg",val:"Nissan MV 200"},
                       {img:"images/cars/toyota_camry.jpg",val:"Toyota Camry"},
                       {img:"images/cars/toyota_highlander.jpg",val:"Toyota Highlander"},
                       {img:"images/cars/toyota_prius.png",val:"Toyota Prius"}
                    ];


    $scope.uploadAdsImage = function(){
      filepickerService.pick({
          mimetype: 'image/*',
          language: 'en',
          services: ['COMPUTER','DROPBOX','GOOGLE_DRIVE','IMAGE_SEARCH', 'FACEBOOK', 'INSTAGRAM'],
          openTo: 'COMPUTER'
        },function(Blob){
              console.log(JSON.stringify(Blob));
              $scope.ads.image = Blob.url;
          });
    }

    $scope.saveAndExitAds = function(){
      console.log(JSON.stringify($scope.ads,null,4));
      AdFactory.saveAndExitAds($scope.ads)
               .success(function(data,status){
                  console.log(JSON.stringify(data,null,4));
                  if(data.success == true)
                  {

                  }
               })
               .error(function(err,code)
               {
                 console.log(err + " | " + code);
               });
    }

    $scope.payAndSubmitAds = function(){
      console.log(JSON.stringify($scope.ads,null,4));
      AdFactory.payAndSubmitAds($scope.ads)
               .success(function(data,status){
                 console.log( JSON.stringify(data,null,4) );
                 if(data.success == true)
                 {

                 }
               })
               .error(function(err,code){
                  console.log(err + " | " + code);
               });
    }

}]);

apptlc.controller("UnionAllEventsCtrl",["$scope","$state","UnionFactory",function($scope,$state,UnionFactory){

  UnionFactory.getAllEvents()
          .success(function(data,status){
              console.log(JSON.stringify(data,null,4) + " | " + status);
              $scope.events = data.events;
          })
          .error(function(err,code){
              console.log(err + " | " + code);
          });

}]);

apptlc.controller("UnionEventCtrl",["$scope","$state","$stateParams","UnionFactory",function($scope,$state,$stateParams,UnionFactory){

  var ev_id = $stateParams.id;

  UnionFactory.getEvent(ev_id)
          .success(function(data,status){
              console.log(JSON.stringify(data,null,4) + " | " + status);
              $scope.ev = data.eve;
          })
          .error(function(err,code){
              console.log(err + " | c: " + code);
          });
}]);


apptlc.factory("AuthFactory",function($http,$window){

          var auth = {};

          auth.registerUser = function(userData){
            return $http.post("/register",{"user":userData}).success(function(data){
                auth.saveToken(data.token);
            });
          };

          auth.loginUser = function(email,password){
            return $http.post("/login",{"email":email,"password":password}).success(function(data){
                auth.saveToken(data.token);
            });
          };

          auth.saveToken = function(token){
            $window.localStorage['apptlc-token'] = token;
          };

          auth.getToken = function(){
            return $window.localStorage['apptlc-token'];
          };

          auth.logOut = function(){
              $window.localStorage.removeItem('apptlc-token');
          };

          auth.isLoggedIn = function(){
            var token = auth.getToken();
            //console.log("isLoggedIn token : " + token);
            if(token){
              var payload = JSON.parse($window.atob(token.split('.')[1]));
              //console.log("payload  ee : " + JSON.stringify(payload,null,4) );
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

apptlc.factory("BlogFactory",function($http,$rootScope){

  var blogs ={};

  var createdBy = $rootScope._currentUserDetails._id;

  blogs.saveAndExitBlog = function(blog){
     return $http.post("/submit_blog",{"blog":blog,"published":false,"createdBy":createdBy});
  };

  blogs.payAndSubmitBlog = function(blog){
    return $http.post("/submit_blog",{"blog":blog,"published":true,"createdBy":createdBy});
  };

  blogs.getAllBlogs = function(){
    return $http.post("/blogs");
  };

  blogs.getBlog = function(id){
    return $http.post("/blog",{"blogId":id});
  }

  return blogs;

});

apptlc.factory("AdFactory",function($http,$rootScope){

  var ads = {};
  var createdBy = $rootScope._currentUserDetails._id;
  ads.saveAndExitAds = function(ad){
     return $http.post("/submit_ad",{"ad":ad,"published":false,"createdBy":createdBy});
  };

  ads.payAndSubmitAds = function(ad){
    return $http.post("/submit_ad",{"ad":ad,"published":true,"createdBy":createdBy});
  };

  ads.getAllAds = function(){
    return $http.post("/ads");
  }

  ads.getAds = function(id){
    return $http.post("/ad",{"adsId":id});
  }

  ads.sendMessage = function(msg,msgTo){
    return $http.post("/send_message",{"message":msg,"createdBy":createdBy,"msgTo":msgTo});
  }

  ads.replyMessage = function(msg,msgParentId){
    return $http.post("/reply_message",{"message":msg,"createdBy":createdBy,"msgParentId":msgParentId});
  }

  return ads;

});

apptlc.factory("UnionFactory",function($http,$rootScope){

  var createdBy = $rootScope._currentUserDetails._id;
  var unions = {};

  unions.addEvent = function(ev)
  {
    return $http.post("/submit_event",{"event":ev,"createdBy":createdBy});
  };

  unions.getAllEvents = function(){
    return $http.post("/events");
  };

  unions.getEvent = function(eventId)
  {
    return $http.post("/event",{"id":eventId});
  };

  return unions;

});

apptlc.factory("InboxFactory",function($http,$rootScope){
  var inbox = {};

  inbox.getMessages = function(){
    return $http.post("/messages");
  };

  inbox.getMessage = function(id){
     return $http.post("/message",{"msgId":id});
  };

  return inbox;
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
        controller:"HomeCtrl",
        onEnter : ["$state","AuthFactory",function($state,AuthFactory){
            if(AuthFactory.isLoggedIn()){
              $state.go("base.overview");
            }
        }]

      })

      .state("union_general",{
        templateUrl:"templates/union/general.html",
        url:"/union_general",
        controller:"UnionCtrl",
        onEnter : ["$state","AuthFactory",function($state,AuthFactory){
            if(!AuthFactory.isLoggedIn()){
              $state.go("login");
            }
        }]

      })

      .state("union_ranking_system",{
        templateUrl:"templates/union/ranking_system.html",
        url:"/union_ranking_system",
        controller:"UnionCtrl",
        onEnter : ["$state","AuthFactory",function($state,AuthFactory){
            if(!AuthFactory.isLoggedIn()){
              $state.go("login");
            }
        }]

      })

      .state("union_dash_app",{
        templateUrl:"templates/union/dash_app.html",
        url:"/union_dash_app",
        controller:"UnionCtrl",
        onEnter : ["$state","AuthFactory",function($state,AuthFactory){
            if(!AuthFactory.isLoggedIn()){
              $state.go("login");
            }
        }]

      })

      .state("union_board",{
        templateUrl:"templates/union/board.html",
        url:"/union_board",
        controller:"UnionCtrl",
        onEnter : ["$state","AuthFactory",function($state,AuthFactory){
            if(!AuthFactory.isLoggedIn()){
              $state.go("login");
            }
        }]

      })

      .state("union_events",{
        templateUrl:"templates/union/events.html",
        url:"/union_events",
        controller:"UnionAllEventsCtrl",
        onEnter : ["$state","AuthFactory",function($state,AuthFactory){
            if(!AuthFactory.isLoggedIn()){
              $state.go("login");
            }
        }]
      })

      .state("union_event",{
        templateUrl:"templates/union/event.html",
        url:"/union_events/:id",
        controller:"UnionEventCtrl",
        onEnter : ["$state","AuthFactory",function($state,AuthFactory){
            if(!AuthFactory.isLoggedIn()){
              $state.go("login");
            }
        }]
      })


      .state("union_newevent",{
        templateUrl:"templates/union/newevent.html",
        url:"/union_newevent",
        controller:"UnionCtrl",
        onEnter : ["$state","AuthFactory",function($state,AuthFactory){
            if(!AuthFactory.isLoggedIn()){
              $state.go("login");
            }
        }]

      })


      .state("base",{
        templateUrl:"templates/base.html",
        url:"/base",
        abstract:true,
        controller:"BaseCtrl"
      })

      .state("base.account",{
        templateUrl:"templates/base/account.html",
        url:"/account",
        controller:"BaseAcctCtrl",
        onEnter : ["$state","AuthFactory",function($state,AuthFactory){
            if(!AuthFactory.isLoggedIn()){
              $state.go("login");
            }
        }]
      })

      .state("base.ads",{
        templateUrl:"templates/base/ads.html",
        url:"/ads",
        controller:"BaseAdsCtrl",
        onEnter : ["$state","AuthFactory",function($state,AuthFactory){
            if(!AuthFactory.isLoggedIn()){
              $state.go("login");
            }
        }]
      })

      .state("base.view_ads",{
        templateUrl:"templates/base/view_ads.html",
        url:"/view_ads",
        controller:"BaseViewAllAdsCtrl",
        onEnter : ["$state","AuthFactory",function($state,AuthFactory){
            if(!AuthFactory.isLoggedIn()){
              $state.go("login");
            }
        }]
      })


      //ind == individual
      .state("base.ind_ad",{
        templateUrl:"templates/base/ind_ad.html",
        url:"/view_ad/:aId",
        controller:"BaseViewAdsCtrl",
        onEnter : ["$state","AuthFactory",function($state,AuthFactory){
            if(!AuthFactory.isLoggedIn()){
              $state.go("login");
            }
        }]
      })

      .state("base.build_history",{
        templateUrl:"templates/base/build_history.html",
        url:"/build_history",
        controller:"BaseCtrl",
        onEnter : ["$state","AuthFactory",function($state,AuthFactory){
            if(!AuthFactory.isLoggedIn()){
              $state.go("login");
            }
        }]
      })



      .state("base.codriving",{
        templateUrl:"templates/base/codriving.html",
        url:"/driving",
        controller:"BaseCODCtrl",
        onEnter : ["$state","AuthFactory",function($state,AuthFactory){
            if(!AuthFactory.isLoggedIn()){
              $state.go("login");
            }
        }]
      })

      .state("base.contract",{
        templateUrl:"templates/base/contract.html",
        url:"/contract",
        controller:"BaseCtrl",
        onEnter : ["$state","AuthFactory",function($state,AuthFactory){
            if(!AuthFactory.isLoggedIn()){
              $state.go("login");
            }
        }]
      })

      .state("base.election",{
        templateUrl:"templates/base/election.html",
        url:"/election",
        controller:"BaseCtrl",
        onEnter : ["$state","AuthFactory",function($state,AuthFactory){
            if(!AuthFactory.isLoggedIn()){
              $state.go("login");
            }
        }]
      })

      .state("base.hvideo",{
        templateUrl:"templates/base/hvideo.html",
        url:"/hvideo",
        controller:"BaseHVideoCtrl",
        onEnter : ["$state","AuthFactory",function($state,AuthFactory){
            if(!AuthFactory.isLoggedIn()){
              $state.go("login");
            }
        }]
      })

      .state("base.inbox",{
        templateUrl:"templates/base/inbox.html",
        url:"/inbox",
        controller:"BaseInboxCtrl",
        onEnter : ["$state","AuthFactory",function($state,AuthFactory){
            if(!AuthFactory.isLoggedIn()){
              $state.go("login");
            }
        }]
      })

      .state("base.inbox_msg",{
        templateUrl:"templates/base/message.html",
        url:"/inbox/:id",
        controller:"BaseInboxMsgCtrl",
        onEnter : ["$state","AuthFactory",function($state,AuthFactory){
            if(!AuthFactory.isLoggedIn()){
              $state.go("login");
            }
        }]
      })

      .state("base.join_group",{
        templateUrl:"templates/base/join_group.html",
        url:"/join_group",
        controller:"BaseCtrl",
        onEnter : ["$state","AuthFactory",function($state,AuthFactory){
            if(!AuthFactory.isLoggedIn()){
              $state.go("login");
            }
        }]
      })

      .state("base.overview",{
        templateUrl:"templates/base/overview.html",
        url:"/overview",
        controller:"BaseCtrl",
        onEnter : ["$state","AuthFactory",function($state,AuthFactory){
            if(!AuthFactory.isLoggedIn()){
              $state.go("login");
            }
        }]
      })

      .state("base.payments",{
        templateUrl:"templates/base/payments.html",
        url:"/payments",
        controller:"BaseCtrl",
        onEnter : ["$state","AuthFactory",function($state,AuthFactory){
            if(!AuthFactory.isLoggedIn()){
              $state.go("login");
            }
        }]
      })

      .state("base.qualifications",{
        templateUrl:"templates/base/qualifications.html",
        url:"/qualifications",
        controller:"BaseQuaCtrl",
        onEnter : ["$state","AuthFactory",function($state,AuthFactory){
            if(!AuthFactory.isLoggedIn()){
              $state.go("login");
            }
        }]
      })

      .state("base.ranks",{
        templateUrl:"templates/base/ranks.html",
        url:"/ranks",
        controller:"BaseRankCtrl",
        onEnter : ["$state","AuthFactory",function($state,AuthFactory){
            if(!AuthFactory.isLoggedIn()){
              $state.go("login");
            }
        }]
      })

      .state("base.tickets",{
        templateUrl:"templates/base/tickets.html",
        url:"/tickets",
        controller:"BaseTicketCtrl",
        onEnter : ["$state","AuthFactory",function($state,AuthFactory){
            if(!AuthFactory.isLoggedIn()){
              $state.go("login");
            }
        }]
      })

      .state("base.upload",{
        templateUrl:"templates/base/upload.html",
        url:"/upload",
        controller:"BaseCtrl",
        onEnter : ["$state","AuthFactory",function($state,AuthFactory){
            if(!AuthFactory.isLoggedIn()){
              $state.go("login");
            }
        }]
      })

      .state("base.wroteby",{
        templateUrl:"templates/base/wroteby.html",
        url:"/wroteby",
        controller:"BaseBlogCtrl",
        onEnter : ["$state","AuthFactory",function($state,AuthFactory){
            if(!AuthFactory.isLoggedIn()){
              $state.go("login");
            }
        }]
      })

      .state("base.articles",{
        templateUrl:"templates/base/articles.html",
        url:"/articles",
        controller:"BaseViewAllBlogsCtrl",
        onEnter : ["$state","AuthFactory",function($state,AuthFactory){
            if(!AuthFactory.isLoggedIn()){
              $state.go("login");
            }
        }]
      })

      .state("base.article",{
        templateUrl:"templates/base/article.html",
        url:"/articles/:id",
        controller:"BaseViewBlogCtrl",
        onEnter : ["$state","AuthFactory",function($state,AuthFactory){
            if(!AuthFactory.isLoggedIn()){
              $state.go("login");
            }
        }]
      })

      .state("base.city_3d",{
        templateUrl:"templates/base/city/city_3d.html",
        url:"/city_3d",
        controller:"BaseStudentCtrl",
        onEnter : ["$state","AuthFactory",function($state,AuthFactory){
            if(!AuthFactory.isLoggedIn()){
              $state.go("login");
            }
        }]
      })

      .state("base.city_downtown",{
        templateUrl:"templates/base/city/city_downtown.html",
        url:"/city_downtown",
        controller:"BaseStudentCtrl",
        onEnter : ["$state","AuthFactory",function($state,AuthFactory){
            if(!AuthFactory.isLoggedIn()){
              $state.go("login");
            }
        }]
      })

      .state("base.city_regulation",{
        templateUrl:"templates/base/city/city_regulation.html",
        url:"/city_regulation",
        controller:"BaseStudentCtrl",
        onEnter : ["$state","AuthFactory",function($state,AuthFactory){
            if(!AuthFactory.isLoggedIn()){
              $state.go("login");
            }
        }]
      })

      .state("base.city_money_spots",{
        templateUrl:"templates/base/city/city_money_spots.html",
        url:"/city_money_spots",
        controller:"BaseStudentCtrl",
        onEnter : ["$state","AuthFactory",function($state,AuthFactory){
            if(!AuthFactory.isLoggedIn()){
              $state.go("login");
            }
        }]
      })

      .state("base.city_rest_spots",{
        templateUrl:"templates/base/city/city_rest_spots.html",
        url:"/city_rest_spots",
        controller:"BaseStudentCtrl",
        onEnter : ["$state","AuthFactory",function($state,AuthFactory){
            if(!AuthFactory.isLoggedIn()){
              $state.go("login");
            }
        }]
      })

      .state("base.city_camera_list",{
        templateUrl:"templates/base/city/city_camera_list.html",
        url:"/city_camera_list",
        controller:"BaseStudentCtrl",
        onEnter : ["$state","AuthFactory",function($state,AuthFactory){
            if(!AuthFactory.isLoggedIn()){
              $state.go("login");
            }
        }]
      })

      .state("base.city_turn_ticket",{
        templateUrl:"templates/base/city/city_turn_ticket.html",
        url:"/city_turn_ticket",
        controller:"BaseStudentCtrl",
        onEnter : ["$state","AuthFactory",function($state,AuthFactory){
            if(!AuthFactory.isLoggedIn()){
              $state.go("login");
            }
        }]
      })

      .state("base.city_airport_ticket",{
        templateUrl:"templates/base/city/city_airport_ticket.html",
        url:"/city_airport_ticket",
        controller:"BaseStudentCtrl",
        onEnter : ["$state","AuthFactory",function($state,AuthFactory){
            if(!AuthFactory.isLoggedIn()){
              $state.go("login");
            }
        }]
      })

      .state("base.city_all_package",{
        templateUrl:"templates/base/city/city_all_package.html",
        url:"/city_all_package",
        controller:"BaseStudentCtrl",
        onEnter : ["$state","AuthFactory",function($state,AuthFactory){
            if(!AuthFactory.isLoggedIn()){
              $state.go("login");
            }
        }]
      })

      .state("login",{
        templateUrl:"templates/user/login.html",
        url:"/login",
        controller:"LoginCtrl",
        onEnter : ["$state","AuthFactory",function($state,AuthFactory){
            if(AuthFactory.isLoggedIn()){
              $state.go("base.overview");
            }
        }]
      })

      .state("register",{
        templateUrl:"templates/user/register.html",
        url:"/register",
        controller:"AuthCtrl",
        onEnter : ["$state","AuthFactory",function($state,AuthFactory){
            if(AuthFactory.isLoggedIn()){
              $state.go("base.overview");
            }
        }]
      })

      .state("complete_registeration",{
         templateUrl:"templates/user/complete_registeration.html",
         url:"/complete_registeration",
         controller:"HomeCtrl",
         onEnter : ["$state","AuthFactory",function($state,AuthFactory){
             if(AuthFactory.isLoggedIn()){
               $state.go("base.overview");
             }
         }]
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
