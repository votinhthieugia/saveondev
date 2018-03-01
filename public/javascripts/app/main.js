var app = angular.module('saveondev', []);
app.controller('mainController', function($scope, $http) {
	$scope.data = [];

	var request = $http.get('/posts');
	request.then(function(response) {
		$scope.data = response.data;
	}, function(error) {
		console.log('Error:' + error);
	});
});