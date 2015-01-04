angular.module('myapp')
	.controller('SignInController', SignInController);

function SignInController($scope, $cordovaOauth) {
	$scope.facebookLogin = function() {
        $cordovaOauth.facebook("1378021859167386", ["email"]).then(function(result) {
            // results
            $scope.result = result;
        }, function(error) {
            // error
            $scope.error = error;
        });
    }
};