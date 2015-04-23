angular.module("taguser.module")
    .controller("ProfileCtrl", ["FindUserTag","$timeout", 
    	                        "$localStorage", "$http", "$scope", "$window", "$location", "$mdDialog",
    	            function(FindUserTag, $timeout, $localStorage, 
    	            	     $http, $scope, $window, $location, $mdDialog) {
        var self = this

    	var defer = FindUserTag.returnDefer();
    	var token = $localStorage.tagToken.token;
    	self.userData = {};
    	self.tagData = [];
    	self.hideProg = false;

        function Init() {
            $timeout(function(){
	    		self.hideProg = true;
	    		defer.then(function(response) {
	    			console.log(response.data);
	                self.userData = response.data;
	    			var req = {
	                    method: "GET",
			            url: "http://localhost:5000/user/tags/"+response.data.username,
			            headers: {
			                "Accept": "application/json",
			                "Authorization": token
			            }
	                }
	                return $http(req);
	    		}).then(function(response) {
	    		       console.log(response.data);
	    		       self.tagData = response.data;
	    		});
    	    }, 3000);
        }

        Init();//initialise profile when it loads

    	//dialog to handle creation of tag
    	self.createTag = function(ev) {
            $mdDialog.show({
            	controller: CreateCtrl,
            	templateUrl: "../app/tag-client/templates/create-tag.html",
            	targetEvent: ev
            })
    	}

        //function to handle create tag dialog
    	function CreateCtrl($scope, $mdDialog) {
    		 $scope.hideProg = true;
    		 $scope.error = ""
    		 $scope.hidemsg = true;
    		 $scope.tagName = "";
    		 $scope.description = "";
    		 var msg = {};
             $scope.hide = function() {
                 $mdDialog.hide();
             };

             $scope.createTag = function() {
             	 $scope.hideProg = false;
                 msg.tagName = $scope.tagName;
                 msg.description = $scope.description;
                 var def = FindUserTag.createTag($localStorage.tagToken.token, msg);
                 $timeout(function() {
                 	 $scope.hideProg = true;
                 	 def.then(function(response) {
                         if(response.data.error) {
                         	$scope.error = response.data.error;
                         	$scope.hidemsg = false;
                         }
                         else {
                           $scope.error = response.data.success;
                           FindUserTag.getUserInfo($localStorage.tagToken.token);
                           Init();
                          }
                 	 });                    
                 }, 3000);    
             }
    	}

    	//Edit Profile dialog
      
    	self.editProfile = function(ev) {
    	     $mdDialog.show({
            	controller: EditProfCtrl,
            	templateUrl: "../app/tag-client/templates/edit-profile.html",
            	targetEvent: ev
            });	
    	}

    	function EditProfCtrl($scope, $mdDialog) {
    		$scope.hideProg = true;
    		$scope.error = "";
    		$scope.hidemsg = true;
    		$scope.username = self.userData.username;
    		$scope.email = self.userData.email;
    		$scope.firstname = self.userData.firstname;
    		$scope.lastname = self.userData.lastname;
    		var msg = {};

    		 $scope.hide = function() {
                 $mdDialog.hide();
             };

           $scope.editUser = function() {
           	   $scope.hideProg = false;
               msg.username = $scope.username;
               msg.email = $scope.email;
               msg.firstname = $scope.firstname;
               msg.lastname = $scope.lastname;
               var def = FindUserTag.editUser($localStorage.tagToken.token, msg);
                $timeout(function() {
                 	 $scope.hideProg = true;
                 	 def.then(function(response) {
                         if(response.data.error) {
                         	$scope.error = response.data.error;
                         	$scope.hidemsg = false;
                         }
                         else {
                         	$scope.hidemsg = false;
                         	$scope.error = response.data.postgres.success;
                         	$localStorage.tagToken.token = response.data.postgres.token;
                            promise = FindUserTag.getUserInfo(response.data.postgres.token);
                             $timeout(function(){
                                self.hideProg = true;
                                promise.then(function(response) {
                                  console.log(response.data);
                                   self.userData = response.data;
                                  var req = {
                                        method: "GET",
                                        url: "http://localhost:5000/user/tags/"+response.data.username,
                                        headers: {
                                            "Accept": "application/json",
                                            "Authorization": token
                                        }
                                  }
                                        return $http(req);
                                }).then(function(response) {
                                       console.log(response.data);
                                       self.tagData = response.data;
                                });
                              }, 3000);
                         }
                 	 });                    
                 }, 3000); 
           }
    	}

      //edit tag name
       var tagIndex;
      self.editTagName = function(ev, index) {
           tagIndex = index;
           console.log(tagIndex);
           $mdDialog.show({
              controller: EditTagCtrl,
              templateUrl: "../app/tag-client/templates/edit-tag.html",
              targetEvent: ev
            }); 
      }

      function EditTagCtrl ($scope, $mdDialog) {
        $scope.hideProg = true;
        $scope.error = "";
        $scope.hidemsg = true;
        $scope.tagName = self.tagData[tagIndex].tagName;
        $scope.description = self.tagData[tagIndex].description;
    
        var msg = {};

         $scope.hide = function() {
           $mdDialog.hide();
         };

         $scope.editTag = function() {
           $scope.hideProg =  false
           msg.tagName = $scope.tagName;
           msg.description = $scope.description;

           var def = FindUserTag.editTag($localStorage.tagToken.token, msg, self.tagData[tagIndex].tagName);
                 $timeout(function() {
                   $scope.hideProg = true;
                   def.then(function(response) {
                         if(response.data.error) {
                          $scope.error = response.data.error;
                          $scope.hidemsg = false;
                         }
                         else {
                           $scope.hidemsg = false;
                           $scope.error = response.data.success;
                           FindUserTag.getUserInfo($localStorage.tagToken.token);
                           Init();
                          }
                   });                    
                 }, 3000);
          }

          $scope.deleteTag = function() {
            $scope.hideProg = false;
            var def = FindUserTag.deleteTag($localStorage.tagToken.token, self.tagData[tagIndex].tagName);
             $timeout(function() {
                   $scope.hideProg = true;
                   def.then(function(response) {
                         if(response.data.error) {
                          $scope.error = response.data.error;
                          $scope.hidemsg = false;
                         }
                         else {
                           $scope.hidemsg = false;                           
                           $scope.tagName = "";
                           $scope.description = "";
                           $scope.error = response.data.success;
                           FindUserTag.getUserInfo($localStorage.tagToken.token);
                           Init();
                          }
                   });                    
                 }, 3000);
          }
      }

    	self.signOut = function() {
    		console.log("called");
    		$localStorage.tagToken = {};
    		$location.url("/login");
    	}
    }]);


