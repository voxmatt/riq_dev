var riqDevApp = angular.module('riqDevApp', [ 'ngRoute']);

// CONTROLLERS
riqDevApp.controller('ListCtrl', function($scope, $http, $location, $anchorScroll, $routeParams) {

  // Load data
  $http.get('app/data/docs.json').success(function(data) {
    $scope.docs = data;
  });

  // Get URL slug
  $scope.langSlug = function(){ 
    var path = $location.path().substr(1);
    if (path == ""){
      return "curl";
    } else {
      return path;
    }
  };


  // Scroll to anchor
  $scope.scrollTo = function(id) {
     $location.hash(id);
     $anchorScroll();
  }

});


// DIRECTIVES
// code prettify
riqDevApp.directive("pre", [
  function(){
    return {
      restrict: 'E',
      link: function(scope, element, attrs){
        prettyPrint(element);
      }
    };
}]);