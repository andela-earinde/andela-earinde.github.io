angular.module("taguser.module")
    .factory("FindUserTag", ["$q", "$http", "$localStorage", 
            function($q, $http, $localStorage) {
    	var deferred  = {};

        if(!$localStorage.tagToken) {
            $localStorage.tagToken = {};
        }      

    	return {
            
            getAllTags: function(param) {
                return $http.get("https://tag-gate.herokuapp.com/tags/"+param);
            },

            getAllUsers: function(param) {
                return $http.get("https://tag-gate.herokuapp.com/users/"+param);
            },

            loginUser: function(params) {
                return $http.post("https://tag-gate.herokuapp.com/users/login", params);
            },

            signupUser: function(params) {
                return $http.post("https://tag-gate.herokuapp.com/users/signup", params);   
            },

            getUserInfo: function(params) {
                var req = {
                    method: "GET",
                    url: "https://tag-gate.herokuapp.com/users",
                    headers: {
                        "Accept": "application/json",
                        "Authorization": params
                    }
                }

                deferred = $http(req);
                return deferred;   
            },

            createTag: function(token, params) {
                var req = {
                    method: "POST",
                    url: "https://tag-gate.herokuapp.com/users/tag",
                    headers: {
                        "Accept": "application/json",
                        "Authorization": token
                    },
                    data: params
                }

                return $http(req);    
            },

            editUser: function(token, params) {
                  var req = {
                    method: "PUT",
                    url: "https://tag-gate.herokuapp.com/users/edit",
                    headers: {
                        "Accept": "application/json",
                        "Authorization": token
                    },
                    data: params
                }

                return $http(req); 
            },

            editTag: function(token, params, name) {
               var req = {
                    method: "PUT",
                    url: "https://tag-gate.herokuapp.com/users/tag/"+name,
                    headers: {
                        "Accept": "application/json",
                        "Authorization": token
                    },
                    data: params
                }

                return $http(req); 
            },

            deleteTag: function(token, params) {
              var req = {
                    method: "DELETE",
                    url: "https://tag-gate.herokuapp.com/users/tag",
                    headers: {
                        "Accept": "application/json",
                        "Authorization": token,
                        "Content-Type": "application/json;charset=utf-8"
                    },
                    data: {tagName: params}
                }

                return $http(req);  
            },

            returnDefer: function() {
                return deferred;
            },

            storeToken: function(tokin) {
                $localStorage.tagToken.token = tokin;
            }
    	}
    }]);