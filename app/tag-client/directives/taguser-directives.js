angular.module('taguser.module')
    .directive("slider", [function() {

    	return {
    		restrict: "E",
    		templateUrl: "app/tag-client/templates/courousel.html"
    	}
    }]);