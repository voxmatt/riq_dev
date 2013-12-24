var riqDevApp = angular.module('riqDevApp', []);

/* Controllers */
riqDevApp.controller('ListCtrl', function($scope, $http) {
  $http.get('app/data/docs.json').success(function(data) {
    $scope.docs = data;
  });
});
