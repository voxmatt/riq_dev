// Set up app and disable anchorScroll b/c it breaks the scroll spy
var riqDevApp = angular.module('riqDevApp', [ 'ngRoute']).value('$anchorScroll', angular.noop);

// CONTROLLERS
riqDevApp.controller('ListCtrl', function($scope, $http, $location, $anchorScroll, $routeParams) {

  // Default language
  $defaultLang = "curl";
  $scope.tokenID = "[API Token ID]";
  $scope.tokenSecret = "[API Token Secret]";

  // Load data
  $http.get('app/data/docs.json', { cache: true}).success(function(data) {
    $scope.docs = data;
    // After docs load, check if they're navigating to a supporeted language, if not, send them to the default
    var path = $location.path().substr(1);
    if ( $.inArray(path, data.languages) == -1 ){
      $location.path($defaultLang); 
    }
  });

  // Get URL slug and set page language
  var langSlug = function(){ 
    var path = $location.path().substr(1);
    if ( path == "" ){
      return $defaultLang;
    } else {
      return path;
    }
  };

  // watch for changes in the page language and return to scope
  $scope.$watch(langSlug, function(newLangSlug){ 
    $scope.langSlug = newLangSlug; 
  });

  // Hijacking the links to maintain page location hash
  $scope.langChange = function(language){
    $location.path(language);
    $scope.langSlug = language;
  }

  // Set scroll and nav after the last template is loaded if url contains a hash
  $scope.lastLoad = function(last) {
    if (last && $location.hash()){
      elem = "#" + $location.hash();
      $("body, html").scrollTop($(elem).offset().top);
      $("#sideNav li[scroll-to = " + $location.hash() + "]").addClass("active");
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
            if ((pos = spyElems[spy.id].offset().top) - $window.scrollY <= 100) {
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
        console.log("Scrolled to" + attrs.scrollTo);
        $("body, html").scrollTop($("#" + attrs.scrollTo).offset().top);
      });
      scrollSpy.addSpy({
        id: attrs.scrollTo,
        in: function() {
          elem.addClass(attrs.spyClass);
          if (elem.parent().hasClass("nav-subsection")){
            elem.closest(".nav-section").addClass("child-active");
          }
          scope.$apply(function() {
            $location.hash(attrs.scrollTo);
          });
        },
        out: function() {
          elem.removeClass(attrs.spyClass);
          if (elem.parent().hasClass("nav-subsection")){
            elem.closest(".nav-section").removeClass("child-active");
          }
        }
      });
    }
  };
})