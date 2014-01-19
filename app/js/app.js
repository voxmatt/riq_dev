var riqDevApp = angular.module('riqDevApp', [ 'ngRoute']);

// CONTROLLERS
riqDevApp.controller('ListCtrl', function($scope, $http, $location, $anchorScroll, $routeParams) {

  // Load data
  $http.get('app/data/docs.json').success(function(data) {
    $scope.docs = data;
  });

  // Get URL slug
  var langSlug = function(){ 
    var path = $location.path().substr(1);
    if (path == ""){
      return "curl";
    } else {
      return path;
    }
  };

  // watch for changes in the url
  $scope.$watch(langSlug, function(newLangSlug){ 
    $scope.langSlug = newLangSlug; 
  });

  // Hijacking the links to maintain page location
  $scope.langChange = function(language){
    $location.path(language);
    $scope.langSlug = language;
  }

  // Set scroll and nav after the last template is loaded if url contains a hash
  $scope.lastLoad = function(last) {
    if (last){
      $anchorScroll();    
    }
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

// ScrollSpy directive for the body
riqDevApp.directive('scrollSpy', function($window) {
  return {
    restrict: 'A',
    controller: function($scope) {
      $scope.spies = [];
      $scope.test = 0;
      setTimeout(function(){$scope.test = 8}, 1000)
      this.addSpy = function(spyObj) {
        $scope.spies.push(spyObj);
      };
    },
    link: function(scope, elem, attrs) {
      var spyElems = [];
      scope.$watch('spies', function(spies) {
        for (var _i = 0; _i < spies.length; _i++) {
          var spy = spies[_i];
          if (spyElems[spy.id] == null) {
            spyElems[spy.id] = (elem.find('#' + spy.id));
          }
        }
      }, true);

      $($window).scroll(function() {
        var highlightSpy, pos, spy, _i, _len, _ref;
        highlightSpy = null;
        _ref = scope.spies;

        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          spy = _ref[_i];
          spy.out();
          spyElems[spy.id] = spyElems[spy.id].length === 0 ? elem.find('#' + spy.id) : spyElems[spy.id];
          if (spyElems[spy.id].length !== 0) {
            if ((pos = spyElems[spy.id].offset().top) - $window.scrollY <= 0) {
              spy.pos = pos;
              if (highlightSpy == null) {
                highlightSpy = spy;
              }
              if (highlightSpy.pos < spy.pos) {
                highlightSpy = spy;
              }
            }
          }
        }
        return highlightSpy != null ? highlightSpy["in"]() : void 0;
      });
    }
  };
});

// Scrollspy directive for nav
riqDevApp.directive('scrollTo', function($location) {
  return {
    restrict: "A",
    require: "^scrollSpy",
    link: function(scope, elem, attrs, scrollSpy) {
      if (attrs.spyClass == null) {
        attrs.spyClass = "active";
      }
      elem.click(function() {
        scope.$apply(function() {
          $location.hash(attrs.scrollTo);
        });
      });
      scrollSpy.addSpy({
        id: attrs.scrollTo,
        in: function() {
          elem.addClass(attrs.spyClass);
          scope.$apply(function() {
            $location.hash(attrs.scrollTo);
          });
        },
        out: function() {
          elem.removeClass(attrs.spyClass);
        }
      });
    }
  };
})