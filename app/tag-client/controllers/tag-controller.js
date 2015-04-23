angular.module('taguser.module')
    .controller("TagController",["$mdSidenav","$location", "$mdDialog",
                                  "FindUserTag","$scope", "$timeout","$window","$localStorage",
                 function($mdSidenav, $location, $mdDialog,
                          FindUserTag, $scope, $timeout, $window, $localStorage) {

        self = this;

    	  self.showProgress = false;
        self.hideSlider = false;
        $scope.hideProfile = {val: true};
        $scope.hideLogin = {val: false};
    
    	self.openSideNav = function() {
    		$mdSidenav('left').toggle();
    	}

        self.hideSlide = function() {
            if($localStorage.tagToken.token) {
                FindUserTag.getUserInfo($localStorage.tagToken.token);
            }
        }

        //watch for change in location
        $scope.$on("$locationChangeStart", function(event) {
            if($localStorage.tagToken.token) {
                $scope.hideProfile.val = false;
                $scope.hideLogin.val = true;
                FindUserTag.getUserInfo($localStorage.tagToken.token);
            }
            else {
              $scope.hideProfile.val = true;
              $scope.hideLogin.val = false; 
            }

            if($location.path() === "/") {
                self.hideSlider = false;
            }
            else {
                self.hideSlider = true
            }
        });

        // $scope.$on("$viewContentLoaded", function(event) {
        //     if($location.path() === "/profile") {
        //         $scope.hideLogin.val = true
        //         $scope.hideProfile.val = false;
        //         FindUserTag.getUserInfo($localStorage.tagToken.token);
        //     }
        //     else {
        //       $scope.hideProfile.val = true;
        //       $scope.hideLogin.val = false; 
        //     }
        // });

        self.reloadHome = function() {
            $window.location.reload();
        }

        
        self.hideProg = true;
        //Find tags controller
        self.tags = "";
        self.getTags = [];
        var defer = "";
        self.submitTagForm = function() {
            self.hideProg = false
            defer = FindUserTag.getAllTags("all");
            $timeout(function(){
                self.hideProg = true;
                defer.then(function(response) {
                    self.getTags = response.data;
                    console.log(self.getTags);
                });
            }, 3000);
        }

        //find Users controller
        self.users = "";
        self.getUsers = [];
        var deferUser = "";
        self.submitUserForm = function() {
            self.hideProg = false
            deferUser = FindUserTag.getAllUsers("all");
             $timeout(function(){  
                self.hideProg = true               
                deferUser.then(function(response) {
                    self.getUsers = response.data;
               });   
            }, 3000);
        }
        
    }]);



