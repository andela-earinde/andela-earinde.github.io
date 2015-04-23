angular.module("taguser.module")
    .controller("SignupLogin", ["FindUserTag","$timeout","$location", 
    	           function(FindUserTag, $timeout, $location) {

        self = this;
        self.msg = "";
        self.hideProg = true;

        //handle login here
        self.email = "";
        self.password = "";
        var params = {}
        var reqData = "";
        self.loginUser = function() {
        	self.hideProg = false;
            params.email = self.email;
            params.password = self.password;
            console.log(params);
            var defered = FindUserTag.loginUser(params);
            $timeout(function() {
                defered.then(function(response) {
	                reqData = response.data;
	               if(reqData.token) {
	               	  self.hideProg = true;
	            	  console.log(reqData.token);
	            	  FindUserTag.storeToken(reqData.token);
	            	  FindUserTag.getUserInfo(reqData.token);
	            	  $location.url("/profile");
	               }
	               else {
	               	   self.hideProg = true;
        		       self.hidemsg = false;
        			   self.msg = reqData.error;
        			   console.log(reqData);
        		   }
	            });
            }, 3000);
            params = {};
        }

        //handle signup here
        self.hidemsg = true;
        self.emailSign = "";
        self.passSign = "";
        self.userSign = "";
        self.firstName = "";
        self.lastName = "";
        self.noSpace = /^[a-zA-Z_]+$/;
        var signParam = {};
        var signData = "";
        self.signupUser = function() {
        	self.hideProg = false;
        	signParam.email = self.emailSign;
        	signParam.password = self.passSign;
        	signParam.username = self.userSign;
        	signParam.firstname = self.firstName;
        	signParam.lastname = self.lastName;

        	var defer = FindUserTag.signupUser(signParam);
        	$timeout(function(){
        		defer.then(function(response) {
        			signData = response.data;
        			if(signData.token) {
        				self.hideProg = true;
        				console.log(signData);
        				FindUserTag.storeToken(signData.token);
                        FindUserTag.getUserInfo(signData.token);
                        $location.url("/profile");
        			}
        			else {
        				self.hideProg = true;
        				self.hidemsg = false;
        				self.msg = signData;
        				console.log(signData);
        			}
        		});
        	}, 3000);
        	signParam = {};
        }
    }]);




